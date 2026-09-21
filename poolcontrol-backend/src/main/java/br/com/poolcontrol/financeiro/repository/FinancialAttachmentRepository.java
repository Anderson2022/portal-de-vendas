package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.FinancialAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface FinancialAttachmentRepository extends JpaRepository<FinancialAttachment, UUID> {}
