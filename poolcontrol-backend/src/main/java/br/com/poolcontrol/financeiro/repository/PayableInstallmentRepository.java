package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.PayableInstallment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface PayableInstallmentRepository extends JpaRepository<PayableInstallment, UUID> {}
