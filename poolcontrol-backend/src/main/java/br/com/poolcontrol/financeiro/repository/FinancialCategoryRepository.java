package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialCategoryRepository extends JpaRepository<FinancialCategory, UUID> {}
