package br.com.poolcontrol.financial.service;



import br.com.poolcontrol.financial.entity.AccountReceivable;
import br.com.poolcontrol.financial.repository.AccountReceivableRepository;
import br.com.poolcontrol.sales.event.SaleCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SaleFinancialListener {

    private final AccountReceivableRepository repository;

    @EventListener
    public void on(SaleCompletedEvent event) {
        if (repository.existsByCompanyIdAndSourceTypeAndSourceId(event.companyId(), "SALE", event.saleId())) {
            return;
        }

        int installment = 1;
        for (var payment : event.payments()) {
            var receivable = new AccountReceivable();
            receivable.setCompanyId(event.companyId());
            receivable.setCustomerId(event.customerId());
            receivable.setSourceType("SALE");
            receivable.setSourceId(event.saleId());
            receivable.setDescription("Venda " + event.saleId() + " - parcela " + installment++);
            receivable.setAmount(payment.amount());
            receivable.setDueDate(payment.dueDate());
            receivable.setPaymentMethod(payment.paymentMethod());
            repository.save(receivable);
        }
    }
}
