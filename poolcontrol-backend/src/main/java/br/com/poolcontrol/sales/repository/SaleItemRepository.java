package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
    List<SaleItem> findAllByCompanyIdAndSaleId(Long companyId, Long saleId);
}
