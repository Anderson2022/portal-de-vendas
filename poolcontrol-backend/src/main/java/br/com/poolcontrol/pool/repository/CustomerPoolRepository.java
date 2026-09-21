package br.com.poolcontrol.pool.repository;



import br.com.poolcontrol.pool.entity.CustomerPool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerPoolRepository extends JpaRepository<CustomerPool, Long> {
    List<CustomerPool> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<CustomerPool> findAllByCompanyIdAndCustomerIdOrderByCreatedAtDesc(Long companyId, Long customerId);
    Optional<CustomerPool> findByIdAndCompanyId(Long id, Long companyId);
}
