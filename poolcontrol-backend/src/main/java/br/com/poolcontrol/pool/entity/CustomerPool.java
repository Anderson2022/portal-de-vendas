package br.com.poolcontrol.pool.entity;

import br.com.poolcontrol.shared.domain.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "customer_pools")
public class CustomerPool extends TenantEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(nullable = false, length = 160)
    private String model;

    @Column(name = "length_m", precision = 10, scale = 2)
    private BigDecimal lengthM;

    @Column(name = "width_m", precision = 10, scale = 2)
    private BigDecimal widthM;

    @Column(name = "depth_m", precision = 10, scale = 2)
    private BigDecimal depthM;

    @Column(name = "volume_liters", precision = 14, scale = 2)
    private BigDecimal volumeLiters;

    @Column(length = 160)
    private String motor;

    @Column(name = "filter_model", length = 160)
    private String filterModel;

    @Column(name = "warranty_until")
    private LocalDate warrantyUntil;

    @Column(length = 1000)
    private String notes;
}
