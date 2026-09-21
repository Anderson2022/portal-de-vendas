package br.com.poolcontrol.supplier.repository;



import br.com.poolcontrol.supplier.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findAllByCompanyIdOrderByNameAsc(Long companyId);
}
