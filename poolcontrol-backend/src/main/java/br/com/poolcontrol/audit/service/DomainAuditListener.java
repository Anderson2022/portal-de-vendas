package br.com.poolcontrol.audit.service;



import br.com.poolcontrol.audit.entity.AuditLog;
import br.com.poolcontrol.audit.repository.AuditLogRepository;
import br.com.poolcontrol.sales.event.SaleCompletedEvent;
import br.com.poolcontrol.workorder.event.WorkOrderCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DomainAuditListener {

    private final AuditLogRepository repository;

    @EventListener
    public void onSaleCompleted(SaleCompletedEvent event) {
        var log = new AuditLog();
        log.setCompanyId(event.companyId());
        log.setUserId(event.completedBy());
        log.setModule("SALES");
        log.setAction("COMPLETE");
        log.setEntityType("SALE");
        log.setEntityId(event.saleId());
        log.setDetails("Venda concluÃ­da. Valor: " + event.totalSale());
        repository.save(log);
    }

    @EventListener
    public void onWorkOrderCompleted(WorkOrderCompletedEvent event) {
        var log = new AuditLog();
        log.setCompanyId(event.companyId());
        log.setUserId(event.completedBy());
        log.setModule("WORK_ORDER");
        log.setAction("COMPLETE");
        log.setEntityType("WORK_ORDER");
        log.setEntityId(event.workOrderId());
        log.setDetails("Ordem de serviÃ§o concluÃ­da");
        repository.save(log);
    }
}
