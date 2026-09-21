package br.com.poolcontrol.financial.service;



import br.com.poolcontrol.financial.dto.PayableRequest;
import br.com.poolcontrol.financial.dto.FinancialSummary;
import br.com.poolcontrol.financial.entity.AccountPayable;
import br.com.poolcontrol.financial.entity.AccountReceivable;
import br.com.poolcontrol.financial.entity.FinancialStatus;
import br.com.poolcontrol.financial.repository.AccountPayableRepository;
import br.com.poolcontrol.financial.repository.AccountReceivableRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialService {

    private final AccountReceivableRepository receivableRepository;
    private final AccountPayableRepository payableRepository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<AccountReceivable> receivables() {
        return receivableRepository.findAllByCompanyIdOrderByDueDateAsc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public List<AccountPayable> payables() {
        return payableRepository.findAllByCompanyIdOrderByDueDateAsc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public FinancialSummary summary() {
        var companyId = currentUser.companyId();
        var receivablePending = receivableRepository.sumByStatus(companyId, FinancialStatus.PENDING);
        var receivablePaid = receivableRepository.sumByStatus(companyId, FinancialStatus.PAID);
        var payablePending = payableRepository.sumByStatus(companyId, FinancialStatus.PENDING);
        var payablePaid = payableRepository.sumByStatus(companyId, FinancialStatus.PAID);

        return new FinancialSummary(
                receivablePending,
                receivablePaid,
                payablePending,
                payablePaid,
                receivablePaid.subtract(payablePaid)
        );
    }

    @Transactional
    public AccountPayable createPayable(PayableRequest request) {
        var payable = new AccountPayable();
        payable.setCompanyId(currentUser.companyId());
        payable.setSupplierId(request.supplierId());
        payable.setDescription(request.description());
        payable.setAmount(request.amount());
        payable.setDueDate(request.dueDate());
        return payableRepository.save(payable);
    }

    @Transactional
    public AccountReceivable payReceivable(Long id) {
        var item = receivableRepository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("Conta a receber nÃ£o encontrada"));
        item.setStatus(FinancialStatus.PAID);
        item.setPaidAt(OffsetDateTime.now(ZoneOffset.UTC));
        return receivableRepository.save(item);
    }

    @Transactional
    public AccountPayable payPayable(Long id) {
        var item = payableRepository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("Conta a pagar nÃ£o encontrada"));
        item.setStatus(FinancialStatus.PAID);
        item.setPaidAt(OffsetDateTime.now(ZoneOffset.UTC));
        return payableRepository.save(item);
    }
}
