package br.com.poolcontrol.workorder.service;



import br.com.poolcontrol.catalog.repository.ProductRepository;
import br.com.poolcontrol.customer.repository.CustomerRepository;
import br.com.poolcontrol.pool.repository.CustomerPoolRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.workorder.dto.WorkOrderRequest;
import br.com.poolcontrol.workorder.dto.WorkOrderResponse;
import br.com.poolcontrol.workorder.event.WorkOrderCompletedEvent;
import br.com.poolcontrol.workorder.entity.WorkOrder;
import br.com.poolcontrol.workorder.entity.WorkOrderMaterial;
import br.com.poolcontrol.workorder.entity.WorkOrderStatus;
import br.com.poolcontrol.workorder.repository.WorkOrderMaterialRepository;
import br.com.poolcontrol.workorder.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository repository;
    private final WorkOrderMaterialRepository materialRepository;
    private final CustomerRepository customerRepository;
    private final CustomerPoolRepository poolRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUser;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<WorkOrder> list() {
        return repository.findAllByCompanyIdOrderByScheduledAtDesc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public WorkOrderResponse get(Long id) {
        var companyId = currentUser.companyId();
        var workOrder = repository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new NotFoundException("Ordem de serviÃ§o nÃ£o encontrada"));
        return new WorkOrderResponse(
                workOrder,
                materialRepository.findAllByCompanyIdAndWorkOrderId(companyId, id)
        );
    }

    @Transactional
    public WorkOrderResponse create(WorkOrderRequest request) {
        var companyId = currentUser.companyId();

        customerRepository.findByIdAndCompanyId(request.customerId(), companyId)
                .orElseThrow(() -> new NotFoundException("Cliente nÃ£o encontrado"));

        if (request.poolId() != null) {
            poolRepository.findByIdAndCompanyId(request.poolId(), companyId)
                    .orElseThrow(() -> new NotFoundException("Piscina nÃ£o encontrada"));
        }

        var workOrder = new WorkOrder();
        workOrder.setCompanyId(companyId);
        workOrder.setCustomerId(request.customerId());
        workOrder.setPoolId(request.poolId());
        workOrder.setAssignedUserId(request.assignedUserId());
        workOrder.setType(request.type());
        workOrder.setScheduledAt(request.scheduledAt());
        workOrder.setDescription(request.description());
        workOrder.setLaborCost(request.laborCost() == null ? BigDecimal.ZERO : request.laborCost());
        workOrder = repository.save(workOrder);

        List<WorkOrderMaterial> materials = new ArrayList<>();
        if (request.materials() != null) {
            for (var item : request.materials()) {
                var product = productRepository.findByIdAndCompanyId(item.productId(), companyId)
                        .orElseThrow(() -> new NotFoundException("Produto nÃ£o encontrado: " + item.productId()));

                var material = new WorkOrderMaterial();
                material.setCompanyId(companyId);
                material.setWorkOrderId(workOrder.getId());
                material.setProductId(item.productId());
                material.setQuantity(item.quantity());
                material.setUnitCost(product.getCostPrice());
                materials.add(materialRepository.save(material));
            }
        }

        return new WorkOrderResponse(workOrder, materials);
    }

    @Transactional
    public WorkOrderResponse start(Long id) {
        var response = get(id);
        var workOrder = response.workOrder();

        if (workOrder.getStatus() != WorkOrderStatus.SCHEDULED
                && workOrder.getStatus() != WorkOrderStatus.IN_TRANSIT) {
            throw new BusinessException("OS nÃ£o estÃ¡ em um status que permita iniciar");
        }

        workOrder.setStatus(WorkOrderStatus.IN_PROGRESS);
        workOrder.setStartedAt(OffsetDateTime.now(ZoneOffset.UTC));
        repository.save(workOrder);
        return get(id);
    }

    @Transactional
    public WorkOrderResponse complete(Long id) {
        var response = get(id);
        var workOrder = response.workOrder();

        if (workOrder.getStatus() == WorkOrderStatus.COMPLETED) {
            return response;
        }

        if (workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
            throw new BusinessException("OS cancelada nÃ£o pode ser concluÃ­da");
        }

        workOrder.setStatus(WorkOrderStatus.COMPLETED);
        workOrder.setCompletedAt(OffsetDateTime.now(ZoneOffset.UTC));
        repository.save(workOrder);

        var eventMaterials = response.materials().stream()
                .map(material -> new WorkOrderCompletedEvent.Material(
                        material.getProductId(),
                        material.getQuantity(),
                        material.getUnitCost()
                ))
                .toList();

        eventPublisher.publishEvent(new WorkOrderCompletedEvent(
                workOrder.getCompanyId(),
                workOrder.getId(),
                currentUser.userId(),
                eventMaterials
        ));

        return get(id);
    }
}
