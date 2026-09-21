package br.com.poolcontrol.sales.service;
import br.com.poolcontrol.sales.dto.QuoteConversionRequest;
import br.com.poolcontrol.sales.dto.SaleCreateRequest;
import br.com.poolcontrol.sales.dto.SaleResponse;
import br.com.poolcontrol.sales.entity.Sale;



import br.com.poolcontrol.catalog.repository.ProductRepository;
import br.com.poolcontrol.customer.repository.CustomerRepository;
import br.com.poolcontrol.sales.dto.QuoteRequest;
import br.com.poolcontrol.sales.dto.QuoteResponse;
import br.com.poolcontrol.sales.entity.Quote;
import br.com.poolcontrol.sales.entity.QuoteItem;
import br.com.poolcontrol.sales.entity.QuoteStatus;
import br.com.poolcontrol.sales.repository.QuoteItemRepository;
import br.com.poolcontrol.sales.repository.QuoteRepository;
import br.com.poolcontrol.salesperson.repository.SalespersonRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository repository;
    private final QuoteItemRepository itemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final SalespersonRepository salespersonRepository;
    private final CurrentUserService currentUser;
    private final SaleService saleService;

    @Transactional(readOnly = true)
    public List<Quote> list() {
        return repository.findAllByCompanyIdOrderByCreatedAtDesc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public QuoteResponse get(Long id) {
        var companyId = currentUser.companyId();
        var quote = repository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new NotFoundException("OrÃ§amento nÃ£o encontrado"));
        return new QuoteResponse(quote, itemRepository.findAllByCompanyIdAndQuoteId(companyId, id));
    }

    @Transactional
    public QuoteResponse create(QuoteRequest request) {
        return save(request, new Quote());
    }

    @Transactional
    public QuoteResponse update(Long id, QuoteRequest request) {
        var quote = repository.findLocked(id, currentUser.companyId()).orElseThrow(() -> new NotFoundException("OrÃ§amento nÃ£o encontrado"));
        ensureEditable(quote);
        itemRepository.deleteAll(itemRepository.findAllByCompanyIdAndQuoteId(currentUser.companyId(), id));
        return save(request, quote);
    }

    private void ensureEditable(Quote quote) {
        if (quote.getConvertedSaleId() != null || quote.getStatus() == QuoteStatus.CONVERTED) throw new BusinessException("OrÃ§amento jÃ¡ convertido em venda");
    }

    private QuoteResponse save(QuoteRequest request, Quote quote) {
        var companyId = currentUser.companyId();

        customerRepository.findByIdAndCompanyId(request.customerId(), companyId)
                .orElseThrow(() -> new NotFoundException("Cliente nÃ£o encontrado"));

        if (request.salespersonId() != null) {
            salespersonRepository.findByIdAndCompanyId(request.salespersonId(), companyId)
                    .orElseThrow(() -> new NotFoundException("Vendedor nÃ£o encontrado"));
        }

        quote.setCompanyId(companyId);
        quote.setCustomerId(request.customerId());
        quote.setSalespersonId(request.salespersonId());
        quote.setDiscount(request.discount());
        quote.setValidUntil(request.validUntil());
        quote.setNotes(request.notes());
        quote.setProject(request.project());
        quote = repository.save(quote);

        List<QuoteItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (var requestItem : request.items()) {
            if (requestItem.productId() != null) {
                productRepository.findByIdAndCompanyId(requestItem.productId(), companyId)
                        .orElseThrow(() -> new NotFoundException("Produto nÃ£o encontrado: " + requestItem.productId()));
            }

            var item = new QuoteItem();
            item.setCompanyId(companyId);
            item.setQuoteId(quote.getId());
            item.setProductId(requestItem.productId());
            item.setDescription(requestItem.description());
            item.setQuantity(requestItem.quantity());
            item.setUnitCost(requestItem.productId() == null ? (requestItem.unitCost() == null ? BigDecimal.ZERO : requestItem.unitCost()) : productRepository.findByIdAndCompanyId(requestItem.productId(), companyId).orElseThrow().getCostPrice());
            item.setUnitPrice(requestItem.unitPrice());
            item.setTotalPrice(requestItem.unitPrice().multiply(requestItem.quantity()).setScale(2, RoundingMode.HALF_UP));
            items.add(itemRepository.save(item));
            subtotal = subtotal.add(item.getTotalPrice());
        }

        BigDecimal total = subtotal.subtract(quote.getDiscount());
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Desconto nÃ£o pode deixar o orÃ§amento negativo");
        }

        quote.setSubtotal(subtotal);
        quote.setTotal(total);
        if (quote.getStatus() == null) quote.setStatus(QuoteStatus.DRAFT);
        repository.save(quote);

        return new QuoteResponse(quote, items);
    }

    @Transactional
    public QuoteResponse changeStatus(Long id, QuoteStatus status) {
        var quote = repository.findLocked(id, currentUser.companyId()).orElseThrow(() -> new NotFoundException("OrÃ§amento nÃ£o encontrado"));
        ensureEditable(quote);
        if (status == QuoteStatus.CONVERTED) throw new BusinessException("Use a conversÃ£o para gerar uma venda");
        quote.setStatus(status);
        repository.save(quote);
        return get(id);
    }
    @Transactional
    public br.com.poolcontrol.sales.dto.SaleResponse convert(Long id, br.com.poolcontrol.sales.dto.QuoteConversionRequest payment) {
        var quote = repository.findLocked(id, currentUser.companyId()).orElseThrow(() -> new NotFoundException("OrÃ§amento nÃ£o encontrado"));
        ensureEditable(quote);
        if (quote.getStatus() == QuoteStatus.REJECTED || quote.getStatus() == QuoteStatus.EXPIRED) throw new BusinessException("OrÃ§amento recusado ou expirado nÃ£o pode gerar venda");
        var items = itemRepository.findAllByCompanyIdAndQuoteId(currentUser.companyId(), id).stream().map(item -> new br.com.poolcontrol.sales.dto.SaleCreateRequest.Item(item.getProductId(),item.getDescription(),item.getQuantity(),item.getUnitPrice(),item.getUnitCost())).toList();
        var request = new br.com.poolcontrol.sales.dto.SaleCreateRequest(quote.getCustomerId(),quote.getSalespersonId(),quote.getProject(),quote.getNotes(),quote.getDiscount(),items,List.of(),List.of(new br.com.poolcontrol.sales.dto.SaleCreateRequest.Payment(quote.getTotal(),payment.dueDate(),payment.paymentMethod())));
        var response = saleService.register(request,payment.paid());
        response.sale().setQuoteId(id);
        quote.setConvertedSaleId(response.sale().getId());
        quote.setStatus(QuoteStatus.CONVERTED);
        repository.save(quote);
        return response;
    }
}
