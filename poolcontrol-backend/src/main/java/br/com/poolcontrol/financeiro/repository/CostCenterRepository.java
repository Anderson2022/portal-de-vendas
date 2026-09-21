package br.com.poolcontrol.financeiro.repository;
import br.com.poolcontrol.financeiro.domain.CostCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface CostCenterRepository extends JpaRepository<CostCenter, UUID> {}
