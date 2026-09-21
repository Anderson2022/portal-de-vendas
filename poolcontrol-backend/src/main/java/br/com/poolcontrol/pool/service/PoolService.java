package br.com.poolcontrol.pool.service;



import br.com.poolcontrol.customer.repository.CustomerRepository;
import br.com.poolcontrol.pool.dto.PoolRequest;
import br.com.poolcontrol.pool.entity.CustomerPool;
import br.com.poolcontrol.pool.repository.CustomerPoolRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PoolService {

    private final CustomerPoolRepository repository;
    private final CustomerRepository customerRepository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<CustomerPool> list() {
        return repository.findAllByCompanyIdOrderByCreatedAtDesc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public List<CustomerPool> listByCustomer(Long customerId) {
        return repository.findAllByCompanyIdAndCustomerIdOrderByCreatedAtDesc(currentUser.companyId(), customerId);
    }

    @Transactional
    public CustomerPool create(PoolRequest request) {
        var companyId = currentUser.companyId();
        customerRepository.findByIdAndCompanyId(request.customerId(), companyId)
                .orElseThrow(() -> new NotFoundException("Cliente nÃ£o encontrado"));

        var pool = new CustomerPool();
        pool.setCompanyId(companyId);
        pool.setCustomerId(request.customerId());
        pool.setModel(request.model());
        pool.setLengthM(request.lengthM());
        pool.setWidthM(request.widthM());
        pool.setDepthM(request.depthM());
        pool.setVolumeLiters(request.volumeLiters());
        pool.setMotor(request.motor());
        pool.setFilterModel(request.filter());
        pool.setWarrantyUntil(request.warrantyUntil());
        pool.setNotes(request.notes());
        return repository.save(pool);
    }
}
