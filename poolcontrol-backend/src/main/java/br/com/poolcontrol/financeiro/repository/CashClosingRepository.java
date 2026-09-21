package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.CashClosing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface CashClosingRepository extends JpaRepository<CashClosing, UUID> {}
