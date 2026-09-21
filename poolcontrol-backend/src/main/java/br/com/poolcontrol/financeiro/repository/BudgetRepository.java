package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface BudgetRepository extends JpaRepository<Budget, UUID> {}
