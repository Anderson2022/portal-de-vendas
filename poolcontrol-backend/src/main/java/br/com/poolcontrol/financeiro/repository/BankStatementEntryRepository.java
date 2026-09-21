package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.BankStatementEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface BankStatementEntryRepository extends JpaRepository<BankStatementEntry, UUID> {}
