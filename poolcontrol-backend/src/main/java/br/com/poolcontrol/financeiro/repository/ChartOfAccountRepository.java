package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.ChartOfAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ChartOfAccountRepository extends JpaRepository<ChartOfAccount, UUID> {}
