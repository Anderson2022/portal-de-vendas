package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface BudgetItemRepository extends JpaRepository<BudgetItem, UUID> {}
