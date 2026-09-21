package br.com.poolcontrol.catalog.repository;



import br.com.poolcontrol.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByCompanyIdOrderByNameAsc(Long companyId);
    Optional<Product> findByIdAndCompanyId(Long id, Long companyId);
}
