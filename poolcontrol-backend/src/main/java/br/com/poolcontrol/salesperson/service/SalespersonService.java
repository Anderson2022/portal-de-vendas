package br.com.poolcontrol.salesperson.service;



import br.com.poolcontrol.salesperson.dto.SalespersonRequest;
import br.com.poolcontrol.salesperson.entity.Salesperson;
import br.com.poolcontrol.salesperson.repository.SalespersonRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalespersonService {

    private final SalespersonRepository repository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<Salesperson> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId());
    }

    @Transactional
    public Salesperson create(SalespersonRequest request) {
        var seller = new Salesperson();
        seller.setCompanyId(currentUser.companyId());
        seller.setUserId(request.userId());
        seller.setName(request.name());
        seller.setEmail(request.email());
        seller.setPhone(request.phone());
        seller.setDefaultCommissionRate(request.defaultCommissionRate());
        seller.setMonthlyTarget(request.monthlyTarget());
        return repository.save(seller);
    }
}
