package br.com.poolcontrol.workorder.repository;



import br.com.poolcontrol.workorder.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    List<WorkOrder> findAllByCompanyIdOrderByScheduledAtDesc(Long companyId);
    Optional<WorkOrder> findByIdAndCompanyId(Long id, Long companyId);
}
