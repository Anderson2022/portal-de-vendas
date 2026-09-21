package br.com.poolcontrol.audit.entity;



import br.com.poolcontrol.shared.domain.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog extends TenantEntity {

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 60)
    private String module;

    @Column(nullable = false, length = 60)
    private String action;

    @Column(name = "entity_type", length = 80)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(length = 1500)
    private String details;
}
