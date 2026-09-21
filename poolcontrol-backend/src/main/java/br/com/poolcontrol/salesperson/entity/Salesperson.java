package br.com.poolcontrol.salesperson.entity;



import br.com.poolcontrol.shared.domain.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "salespeople")
public class Salesperson extends TenantEntity {

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 180)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "default_commission_rate", nullable = false, precision = 7, scale = 4)
    private BigDecimal defaultCommissionRate = BigDecimal.ZERO;

    @Column(name = "monthly_target", nullable = false, precision = 14, scale = 2)
    private BigDecimal monthlyTarget = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean active = true;
}
