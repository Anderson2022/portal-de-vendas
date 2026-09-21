package br.com.poolcontrol.sales.repository;



import br.com.poolcontrol.sales.entity.SalePayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalePaymentRepository extends JpaRepository<SalePayment, Long> {
    List<SalePayment> findAllByCompanyIdAndSaleId(Long companyId, Long saleId);
}
