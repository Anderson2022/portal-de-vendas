package br.com.poolcontrol.sales.service;

import br.com.poolcontrol.sales.entity.Sale;
import br.com.poolcontrol.sales.entity.SaleCost;
import br.com.poolcontrol.sales.entity.SaleCostType;
import br.com.poolcontrol.sales.entity.SaleItem;
import br.com.poolcontrol.sales.entity.SalePayment;
import br.com.poolcontrol.sales.entity.SaleStatus;
import br.com.poolcontrol.sales.repository.SaleCostRepository;
import br.com.poolcontrol.sales.repository.SaleItemRepository;
import br.com.poolcontrol.sales.repository.SalePaymentRepository;
import br.com.poolcontrol.sales.repository.SaleRepository;

import br.com.poolcontrol.catalog.entity.Product;
import br.com.poolcontrol.catalog.repository.ProductRepository;
import br.com.poolcontrol.customer.repository.CustomerRepository;
import br.com.poolcontrol.sales.dto.SaleCreateRequest;
import br.com.poolcontrol.sales.dto.SaleResponse;
import br.com.poolcontrol.sales.event.SaleCompletedEvent;
import br.com.poolcontrol.sales.entity.*;
import br.com.poolcontrol.sales.repository.*;
import br.com.poolcontrol.salesperson.repository.SalespersonRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository itemRepository;
    private final SaleCostRepository costRepository;
    private final SalePaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SalespersonRepository salespersonRepository;
    private final CurrentUserService currentUser;
    private final ApplicationEventPublisher eventPublisher;
    private final br.com.poolcontrol.financial.service.FinancialService financialService;

    @Transactional(readOnly = true)
    public List<Sale> list() {
        return saleRepository.findAllByCompanyIdOrderByCreatedAtDesc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public SaleResponse get(Long saleId) {
        var companyId = currentUser.companyId();
        var sale = saleRepository.findByIdAndCompanyId(saleId, companyId)
                .orElseThrow(() -> new NotFoundException("Venda nÃ£o encontrada"));

        return new SaleResponse(
                sale,
                itemRepository.findAllByCompanyIdAndSaleId(companyId, saleId),
                costRepository.findAllByCompanyIdAndSaleId(companyId, saleId),
                paymentRepository.findAllByCompanyIdAndSaleId(companyId, saleId));
    }

    @Transactional
    public SaleResponse create(SaleCreateRequest request) {
        var companyId = currentUser.companyId();

        customerRepository.findByIdAndCompanyId(request.customerId(), companyId)
                .orElseThrow(() -> new NotFoundException("Cliente nÃ£o encontrado"));

        BigDecimal commissionRate = BigDecimal.ZERO;
        if (request.salespersonId() != null) {
            commissionRate = salespersonRepository.findByIdAndCompanyId(request.salespersonId(), companyId)
                    .orElseThrow(() -> new NotFoundException("Vendedor nÃ£o encontrado"))
                    .getDefaultCommissionRate();
        }

        var sale = new Sale();
        sale.setCompanyId(companyId);
        sale.setCustomerId(request.customerId());
        sale.setProject(request.project());
        sale.setNotes(request.notes());
        sale.setSalespersonId(request.salespersonId());
        sale.setDiscount(request.discount() == null ? BigDecimal.ZERO : request.discount());
        sale.setStatus(SaleStatus.NEGOTIATION);
        sale = saleRepository.save(sale);

        List<SaleItem> savedItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal productCost = BigDecimal.ZERO;

        for (var itemRequest : request.items()) {
            Product product = null;
            BigDecimal unitCost = itemRequest.unitCost() == null ? BigDecimal.ZERO : itemRequest.unitCost();

            if (itemRequest.productId() != null) {
                product = productRepository.findByIdAndCompanyId(itemRequest.productId(), companyId)
                        .orElseThrow(
                                () -> new NotFoundException("Produto nÃ£o encontrado: " + itemRequest.productId()));
                unitCost = product.getCostPrice();
            }

            var item = new SaleItem();
            item.setCompanyId(companyId);
            item.setSaleId(sale.getId());
            item.setProductId(itemRequest.productId());
            item.setDescription(itemRequest.description());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(itemRequest.unitPrice());
            item.setUnitCost(unitCost);
            item.setTotalPrice(
                    itemRequest.unitPrice().multiply(itemRequest.quantity()).setScale(2, RoundingMode.HALF_UP));
            item.setTotalCost(unitCost.multiply(itemRequest.quantity()).setScale(2, RoundingMode.HALF_UP));

            savedItems.add(itemRepository.save(item));
            subtotal = subtotal.add(item.getTotalPrice());
            productCost = productCost.add(item.getTotalCost());
        }

        BigDecimal totalSale = subtotal.subtract(sale.getDiscount());
        if (totalSale.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Desconto nÃ£o pode deixar a venda negativa");
        }

        List<SaleCost> savedCosts = new ArrayList<>();
        BigDecimal additionalCost = BigDecimal.ZERO;

        if (request.costs() != null) {
            for (var costRequest : request.costs()) {
                if (costRequest.type() == SaleCostType.COMMISSION) {
                    throw new BusinessException("A comissÃ£o do vendedor Ã© calculada automaticamente");
                }

                var cost = new SaleCost();
                cost.setCompanyId(companyId);
                cost.setSaleId(sale.getId());
                cost.setType(costRequest.type());
                cost.setDescription(costRequest.description());
                cost.setAmount(costRequest.amount());
                savedCosts.add(costRepository.save(cost));
                additionalCost = additionalCost.add(cost.getAmount());
            }
        }

        BigDecimal commissionAmount = totalSale
                .multiply(commissionRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        if (commissionAmount.compareTo(BigDecimal.ZERO) > 0) {
            var commissionCost = new SaleCost();
            commissionCost.setCompanyId(companyId);
            commissionCost.setSaleId(sale.getId());
            commissionCost.setType(SaleCostType.COMMISSION);
            commissionCost.setDescription(
                    "ComissÃ£o do vendedor (" + commissionRate.stripTrailingZeros().toPlainString() + "%)");
            commissionCost.setAmount(commissionAmount);
            savedCosts.add(costRepository.save(commissionCost));
            additionalCost = additionalCost.add(commissionAmount);
        }

        List<SalePayment> savedPayments = new ArrayList<>();
        if (request.payments() != null && !request.payments().isEmpty()) {
            BigDecimal paymentsTotal = request.payments().stream()
                    .map(SaleCreateRequest.Payment::amount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (paymentsTotal.compareTo(totalSale) != 0) {
                throw new BusinessException("A soma dos pagamentos precisa ser igual ao valor total da venda");
            }

            for (var paymentRequest : request.payments()) {
                var payment = new SalePayment();
                payment.setCompanyId(companyId);
                payment.setSaleId(sale.getId());
                payment.setAmount(paymentRequest.amount());
                payment.setDueDate(paymentRequest.dueDate());
                payment.setPaymentMethod(paymentRequest.paymentMethod());
                savedPayments.add(paymentRepository.save(payment));
            }
        } else if (totalSale.compareTo(BigDecimal.ZERO) > 0) {
            var payment = new SalePayment();
            payment.setCompanyId(companyId);
            payment.setSaleId(sale.getId());
            payment.setAmount(totalSale);
            payment.setDueDate(LocalDate.now());
            payment.setPaymentMethod("UNDEFINED");
            savedPayments.add(paymentRepository.save(payment));
        }

        BigDecimal totalCost = productCost.add(additionalCost);
        BigDecimal profit = totalSale.subtract(totalCost);
        BigDecimal margin = totalSale.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : profit.multiply(new BigDecimal("100")).divide(totalSale, 4, RoundingMode.HALF_UP);

        sale.setSubtotal(subtotal);
        sale.setTotalSale(totalSale);
        sale.setProductCost(productCost);
        sale.setAdditionalCost(additionalCost);
        sale.setCommissionRate(commissionRate);
        sale.setCommissionAmount(commissionAmount);
        sale.setTotalCost(totalCost);
        sale.setProfit(profit);
        sale.setMarginPercent(margin);
        sale = saleRepository.save(sale);

        return new SaleResponse(sale, savedItems, savedCosts, savedPayments);
    }

    @Transactional
    public SaleResponse complete(Long saleId) {
        var companyId = currentUser.companyId();
        var sale = saleRepository.findLocked(saleId, companyId)
                .orElseThrow(() -> new NotFoundException("Venda nÃ£o encontrada"));
        var response = get(saleId);

        if (sale.getStatus() == SaleStatus.COMPLETED) {
            return response;
        }

        if (sale.getStatus() == SaleStatus.CANCELLED) {
            throw new BusinessException("Venda cancelada nÃ£o pode ser concluÃ­da");
        }

        sale.setStatus(SaleStatus.COMPLETED);
        sale.setCompletedAt(OffsetDateTime.now(ZoneOffset.UTC));
        saleRepository.save(sale);

        BigDecimal commissionRate = sale.getCommissionRate();
        BigDecimal commissionAmount = sale.getCommissionAmount();

        var eventItems = response.items().stream()
                .filter(item -> item.getProductId() != null)
                .map(item -> new SaleCompletedEvent.Item(item.getProductId(), item.getQuantity(), item.getUnitCost()))
                .toList();

        var eventPayments = response.payments().stream()
                .map(payment -> new SaleCompletedEvent.Payment(
                        payment.getAmount(),
                        payment.getDueDate(),
                        payment.getPaymentMethod()))
                .toList();

        eventPublisher.publishEvent(new SaleCompletedEvent(
                companyId,
                sale.getId(),
                sale.getCustomerId(),
                sale.getSalespersonId(),
                currentUser.userId(),
                sale.getTotalSale(),
                commissionRate,
                commissionAmount,
                eventItems,
                eventPayments));

        return get(saleId);
    }

    @Transactional
    public SaleResponse register(SaleCreateRequest request, boolean paid) {
        var created = create(request);
        var response = complete(created.sale().getId());
        if (paid)
            financialService.receivables().stream().filter(r -> response.sale().getId().equals(r.getSourceId()))
                    .forEach(r -> financialService.payReceivable(r.getId()));
        return response;
    }
}
