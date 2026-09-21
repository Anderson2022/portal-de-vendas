package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {}
