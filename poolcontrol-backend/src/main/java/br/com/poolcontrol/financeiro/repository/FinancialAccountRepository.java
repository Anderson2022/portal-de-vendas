package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, UUID> {}
