package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface BankAccountRepository extends JpaRepository<BankAccount, UUID> {}
