package br.com.poolcontrol.commission.repository;



import br.com.poolcontrol.commission.entity.Commission;
import br.com.poolcontrol.commission.entity.CommissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);
    Optional<Commission> findByIdAndCompanyId(Long id, Long companyId);
    boolean existsByCompanyIdAndSaleId(Long companyId, Long saleId);

    @Query("select coalesce(sum(c.amount), 0) from Commission c where c.companyId = :companyId and c.status = :status")
    BigDecimal sumByStatus(@Param("companyId") Long companyId, @Param("status") CommissionStatus status);
}
