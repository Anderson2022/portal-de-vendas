package br.com.poolcontrol.commission.service;



import br.com.poolcontrol.commission.entity.Commission;
import br.com.poolcontrol.commission.repository.CommissionRepository;
import br.com.poolcontrol.sales.event.SaleCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CommissionSaleListener {

    private final CommissionRepository repository;

    @EventListener
    public void on(SaleCompletedEvent event) {
        if (event.salespersonId() == null
                || event.commissionAmount() == null
                || event.commissionAmount().compareTo(BigDecimal.ZERO) <= 0
                || repository.existsByCompanyIdAndSaleId(event.companyId(), event.saleId())) {
            return;
        }

        var commission = new Commission();
        commission.setCompanyId(event.companyId());
        commission.setSaleId(event.saleId());
        commission.setSalespersonId(event.salespersonId());
        commission.setBaseAmount(event.totalSale());
        commission.setRate(event.commissionRate());
        commission.setAmount(event.commissionAmount());
        repository.save(commission);
    }
}
