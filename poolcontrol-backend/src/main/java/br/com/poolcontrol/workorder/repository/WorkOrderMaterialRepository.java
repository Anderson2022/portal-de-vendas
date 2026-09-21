package br.com.poolcontrol.workorder.repository;
import br.com.poolcontrol.workorder.entity.WorkOrder;



import br.com.poolcontrol.workorder.entity.WorkOrderMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderMaterialRepository extends JpaRepository<WorkOrderMaterial, Long> {
    List<WorkOrderMaterial> findAllByCompanyIdAndWorkOrderId(Long companyId, Long workOrderId);
}
