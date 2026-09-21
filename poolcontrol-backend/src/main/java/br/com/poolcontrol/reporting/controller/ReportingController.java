package br.com.poolcontrol.reporting.controller;
import br.com.poolcontrol.reporting.entity.ProfitabilityReport;



import br.com.poolcontrol.reporting.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService service;

    @GetMapping("/profitability")
    @PreAuthorize("hasAuthority('PERM_DASHBOARD_VIEW')")
    public ProfitabilityReport profitability() {
        return service.profitability();
    }
}
