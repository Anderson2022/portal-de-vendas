package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.SaleCost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleCostRepository extends JpaRepository<SaleCost, Long> {
    List<SaleCost> findAllByCompanyIdAndSaleId(Long companyId, Long saleId);
    void deleteAllByCompanyIdAndSaleId(Long companyId, Long saleId);
}
