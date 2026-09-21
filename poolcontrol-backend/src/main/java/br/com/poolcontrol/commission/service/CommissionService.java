package br.com.poolcontrol.commission.service;



import br.com.poolcontrol.commission.entity.Commission;
import br.com.poolcontrol.commission.entity.CommissionStatus;
import br.com.poolcontrol.commission.repository.CommissionRepository;
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
public class CommissionService {

    private final CommissionRepository repository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<Commission> list() {
        return repository.findAllByCompanyIdOrderByCreatedAtDesc(currentUser.companyId());
    }

    @Transactional
    public Commission pay(Long id) {
        var commission = repository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("ComissÃ£o nÃ£o encontrada"));
        commission.setStatus(CommissionStatus.PAID);
        commission.setPaidAt(OffsetDateTime.now(ZoneOffset.UTC));
        return repository.save(commission);
    }
}
