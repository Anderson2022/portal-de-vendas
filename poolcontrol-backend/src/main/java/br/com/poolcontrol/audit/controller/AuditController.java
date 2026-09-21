package br.com.poolcontrol.audit.controller;



import br.com.poolcontrol.audit.entity.AuditLog;
import br.com.poolcontrol.audit.repository.AuditLogRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository repository;
    private final CurrentUserService currentUser;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_AUDIT_VIEW')")
    public List<AuditLog> latest() {
        return repository.findTop100ByCompanyIdOrderByCreatedAtDesc(currentUser.companyId());
    }
}
