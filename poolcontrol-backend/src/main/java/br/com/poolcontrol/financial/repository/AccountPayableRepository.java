package br.com.poolcontrol.financial.repository;



import br.com.poolcontrol.financial.entity.AccountPayable;
import br.com.poolcontrol.financial.entity.FinancialStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AccountPayableRepository extends JpaRepository<AccountPayable, Long> {
    List<AccountPayable> findAllByCompanyIdOrderByDueDateAsc(Long companyId);
    Optional<AccountPayable> findByIdAndCompanyId(Long id, Long companyId);

    @Query("select coalesce(sum(a.amount), 0) from AccountPayable a where a.companyId = :companyId and a.status = :status")
    BigDecimal sumByStatus(@Param("companyId") Long companyId, @Param("status") FinancialStatus status);
}
