package br.com.poolcontrol.dashboard.controller;

import br.com.poolcontrol.dashboard.dto.DashboardSummary;
import br.com.poolcontrol.dashboard.entity.SalespersonRanking;

import br.com.poolcontrol.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('PERM_DASHBOARD_VIEW')")
    public DashboardSummary summary() {
        return service.summary();
    }

    @GetMapping("/salespeople")
    @PreAuthorize("hasAuthority('PERM_DASHBOARD_VIEW')")
    public List<SalespersonRanking> ranking() {
        return service.ranking();
    }
}
