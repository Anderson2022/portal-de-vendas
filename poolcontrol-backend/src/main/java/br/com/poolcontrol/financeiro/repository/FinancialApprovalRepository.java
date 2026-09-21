package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialApprovalRepository extends JpaRepository<FinancialApproval, UUID> {}
