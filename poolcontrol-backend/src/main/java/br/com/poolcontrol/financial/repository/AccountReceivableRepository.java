package br.com.poolcontrol.financial.repository;



import br.com.poolcontrol.financial.entity.AccountReceivable;
import br.com.poolcontrol.financial.entity.FinancialStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AccountReceivableRepository extends JpaRepository<AccountReceivable, Long> {
    List<AccountReceivable> findAllByCompanyIdOrderByDueDateAsc(Long companyId);
    Optional<AccountReceivable> findByIdAndCompanyId(Long id, Long companyId);
    boolean existsByCompanyIdAndSourceTypeAndSourceId(Long companyId, String sourceType, Long sourceId);

    @Query("select coalesce(sum(a.amount), 0) from AccountReceivable a where a.companyId = :companyId and a.status = :status")
    BigDecimal sumByStatus(@Param("companyId") Long companyId, @Param("status") FinancialStatus status);
}
