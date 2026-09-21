package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);
    Optional<Quote> findByIdAndCompanyId(Long id, Long companyId);
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select e from Quote e where e.id = :id and e.companyId = :companyId")
    Optional<Quote> findLocked(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("companyId") Long companyId);
}
