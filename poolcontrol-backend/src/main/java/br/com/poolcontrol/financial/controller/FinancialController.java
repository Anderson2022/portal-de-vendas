package br.com.poolcontrol.financial.controller;
import br.com.poolcontrol.financial.dto.FinancialSummary;
import br.com.poolcontrol.financial.dto.PayableRequest;



import br.com.poolcontrol.financial.service.FinancialService;
import br.com.poolcontrol.financial.entity.AccountPayable;
import br.com.poolcontrol.financial.entity.AccountReceivable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/financial")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService service;

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public FinancialSummary summary() {
        return service.summary();
    }

    @GetMapping("/receivables")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<AccountReceivable> receivables() {
        return service.receivables();
    }

    @GetMapping("/payables")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_VIEW')")
    public List<AccountPayable> payables() {
        return service.payables();
    }

    @PostMapping("/payables")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public AccountPayable createPayable(@Valid @RequestBody PayableRequest request) {
        return service.createPayable(request);
    }

    @PostMapping("/receivables/{id}/pay")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public AccountReceivable payReceivable(@PathVariable Long id) {
        return service.payReceivable(id);
    }

    @PostMapping("/payables/{id}/pay")
    @PreAuthorize("hasAuthority('PERM_FINANCIAL_CREATE')")
    public AccountPayable payPayable(@PathVariable Long id) {
        return service.payPayable(id);
    }
}
