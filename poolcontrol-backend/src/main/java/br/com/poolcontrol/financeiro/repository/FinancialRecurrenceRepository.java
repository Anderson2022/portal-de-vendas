package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialRecurrence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialRecurrenceRepository extends JpaRepository<FinancialRecurrence, UUID> {}
