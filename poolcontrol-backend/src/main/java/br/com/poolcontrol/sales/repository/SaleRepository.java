package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.Sale;
import br.com.poolcontrol.sales.entity.SaleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);
    Optional<Sale> findByIdAndCompanyId(Long id, Long companyId);

    long countByCompanyIdAndStatus(Long companyId, SaleStatus status);

    @Query("select coalesce(sum(s.totalSale), 0) from Sale s where s.companyId = :companyId and s.status = :status")
    BigDecimal sumSalesByStatus(@Param("companyId") Long companyId, @Param("status") SaleStatus status);

    @Query("select coalesce(sum(s.profit), 0) from Sale s where s.companyId = :companyId and s.status = :status")
    BigDecimal sumProfitByStatus(@Param("companyId") Long companyId, @Param("status") SaleStatus status);

    @Query("select coalesce(avg(s.marginPercent), 0) from Sale s where s.companyId = :companyId and s.status = :status")
    BigDecimal averageMarginByStatus(@Param("companyId") Long companyId, @Param("status") SaleStatus status);
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select e from Sale e where e.id = :id and e.companyId = :companyId")
    Optional<Sale> findLocked(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("companyId") Long companyId);
}
