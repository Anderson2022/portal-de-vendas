package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.ReceivableInstallment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ReceivableInstallmentRepository extends JpaRepository<ReceivableInstallment, UUID> {}
