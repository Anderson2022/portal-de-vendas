package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.Payable;
import br.com.poolcontrol.financeiro.domain.enums.FinancialStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
public interface PayableQueryRepository extends JpaRepository<Payable, UUID> {
  List<Payable> findByEmpresaIdAndStatusAndDataVencimentoBetween(UUID empresaId, FinancialStatus status, LocalDate inicio, LocalDate fim);
}
