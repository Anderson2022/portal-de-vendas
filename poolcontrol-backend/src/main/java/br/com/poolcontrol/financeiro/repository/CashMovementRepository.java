package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.CashMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface CashMovementRepository extends JpaRepository<CashMovement, UUID> {}
