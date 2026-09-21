package br.com.poolcontrol.empresas.repository;



import br.com.poolcontrol.empresas.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findFirstByTradeNameIgnoreCase(String tradeName);
}
