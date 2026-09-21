package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {}
