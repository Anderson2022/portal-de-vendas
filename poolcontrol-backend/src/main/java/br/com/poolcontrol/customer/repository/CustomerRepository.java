package br.com.poolcontrol.customer.repository;



import br.com.poolcontrol.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findAllByCompanyIdOrderByNameAsc(Long companyId);
    Optional<Customer> findByIdAndCompanyId(Long id, Long companyId);
}
