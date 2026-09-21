package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.CashRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface CashRegisterRepository extends JpaRepository<CashRegister, UUID> {}
