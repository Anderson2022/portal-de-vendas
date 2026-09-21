package br.com.poolcontrol.inventory.service;



import br.com.poolcontrol.catalog.repository.ProductRepository;
import br.com.poolcontrol.inventory.dto.StockMovementRequest;
import br.com.poolcontrol.inventory.dto.StockSummary;
import br.com.poolcontrol.inventory.entity.StockMovement;
import br.com.poolcontrol.inventory.entity.StockMovementType;
import br.com.poolcontrol.inventory.repository.StockMovementRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final StockMovementRepository repository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUser;
    private final JdbcClient jdbc;

    @Transactional
    public StockMovement move(StockMovementRequest request) {
        var companyId = currentUser.companyId();
        productRepository.findByIdAndCompanyId(request.productId(), companyId)
                .orElseThrow(() -> new NotFoundException("Produto nÃ£o encontrado"));

        if (request.warehouseId()!=null) {
            var blockingInventory = jdbc.sql("SELECT i.numero FROM inventarios i JOIN inventario_itens ii ON ii.inventario_id=i.id WHERE i.empresa_id=:company AND i.deposito_id=:warehouse AND ii.produto_id=:product AND i.bloqueia_movimentacoes AND i.status NOT IN ('CONCLUIDO','CANCELADO') ORDER BY i.id DESC LIMIT 1")
                    .param("company",companyId).param("warehouse",request.warehouseId()).param("product",request.productId()).query(String.class).optional();
            if (blockingInventory.isPresent())
                throw new BusinessException("Produto bloqueado pelo inventário " + blockingInventory.get() + ". Consulte Logística > Inventário.");
        }

        BigDecimal normalized = normalize(request.type(), request.quantity());

        if (request.type() == StockMovementType.EXIT) {
            BigDecimal available = summary(request.productId()).available();
            if (available.add(normalized).compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException("Estoque insuficiente para a saÃ­da solicitada");
            }
        }

        if (request.type() == StockMovementType.RESERVATION) {
            BigDecimal available = summary(request.productId()).available();
            if (available.subtract(normalized).compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException("Estoque insuficiente para a reserva solicitada");
            }
        }

        if (request.type() == StockMovementType.RELEASE) {
            BigDecimal reserved = repository.reservedBalance(companyId, request.productId());
            if (reserved.add(normalized).compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException("LiberaÃ§Ã£o maior que a quantidade reservada");
            }
        }

        var movement = new StockMovement();
        movement.setCompanyId(companyId);
        movement.setProductId(request.productId());
        movement.setWarehouseId(request.warehouseId());
        movement.setLocationId(request.locationId());
        movement.setType(request.type());
        movement.setQuantity(normalized);
        movement.setUnitCost(request.unitCost() == null ? BigDecimal.ZERO : request.unitCost());
        movement.setTotalCost(movement.getUnitCost().multiply(normalized.abs()));
        movement.setReferenceType(request.referenceType());
        movement.setReferenceId(request.referenceId());
        movement.setCreatedBy(currentUser.userId());
        movement.setNotes(request.notes());
        return repository.save(movement);
    }

    @Transactional(readOnly = true)
    public StockSummary summary(Long productId) {
        var companyId = currentUser.companyId();
        var product = productRepository.findByIdAndCompanyId(productId, companyId)
                .orElseThrow(() -> new NotFoundException("Produto nÃ£o encontrado"));

        BigDecimal physical = repository.physicalBalance(companyId, productId);
        BigDecimal reserved = repository.reservedBalance(companyId, productId);
        BigDecimal available = physical.subtract(reserved);

        String status = available.compareTo(BigDecimal.ZERO) <= 0
                ? "CRITICAL"
                : available.compareTo(product.getMinimumStock()) <= 0 ? "LOW" : "OK";

        return new StockSummary(
                productId,
                product.getName(),
                physical,
                reserved,
                available,
                product.getMinimumStock(),
                status
        );
    }

    @Transactional(readOnly = true)
    public List<StockSummary> listSummaries() {
        return productRepository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId())
                .stream()
                .map(product -> summary(product.getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StockMovement> history(Long productId) {
        return repository.findAllByCompanyIdAndProductIdOrderByCreatedAtDesc(currentUser.companyId(), productId);
    }

    private BigDecimal normalize(StockMovementType type, BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) == 0) {
            throw new BusinessException("Quantidade deve ser diferente de zero");
        }

        return switch (type) {
            case ENTRY, RETURN, RESERVATION -> quantity.abs();
            case EXIT, RELEASE -> quantity.abs().negate();
            case ADJUSTMENT -> quantity;
        };
    }
}
