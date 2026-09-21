package br.com.poolcontrol.salesperson.repository;



import br.com.poolcontrol.salesperson.entity.Salesperson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalespersonRepository extends JpaRepository<Salesperson, Long> {
    List<Salesperson> findAllByCompanyIdOrderByNameAsc(Long companyId);
    Optional<Salesperson> findByIdAndCompanyId(Long id, Long companyId);
}
