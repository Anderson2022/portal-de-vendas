package br.com.poolcontrol.inventory.repository;



import br.com.poolcontrol.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findAllByCompanyIdAndProductIdOrderByCreatedAtDesc(Long companyId, Long productId);

    @Query(value = """
            select coalesce(sum(quantidade_fisica), 0)
            from estoques_saldos
            where empresa_id = :companyId and produto_id = :productId
            """, nativeQuery = true)
    BigDecimal physicalBalance(@Param("companyId") Long companyId, @Param("productId") Long productId);

    @Query(value = """
            select coalesce(sum(quantidade_reservada), 0)
            from estoques_saldos
            where empresa_id = :companyId and produto_id = :productId
            """, nativeQuery = true)
    BigDecimal reservedBalance(@Param("companyId") Long companyId, @Param("productId") Long productId);
}
