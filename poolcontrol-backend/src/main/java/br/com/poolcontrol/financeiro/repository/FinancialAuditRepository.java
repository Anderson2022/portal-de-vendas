package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialAuditRepository extends JpaRepository<AuditLog, UUID> {}
