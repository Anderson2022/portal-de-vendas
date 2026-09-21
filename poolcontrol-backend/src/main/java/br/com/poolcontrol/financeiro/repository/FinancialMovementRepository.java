package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialMovementRepository extends JpaRepository<FinancialMovement, UUID> {}
