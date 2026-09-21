package br.com.poolcontrol.customer.entity;



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
@Table(name = "customers")
public class Customer extends TenantEntity {

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "document_number", length = 20)
    private String documentNumber;

    @Column(length = 30)
    private String phone;

    @Column(length = 30)
    private String whatsapp;

    @Column(length = 180)
    private String email;

    @Column(length = 220)
    private String address;

    @Column(length = 120)
    private String city;

    @Column(length = 2)
    private String state;

    @Column(name = "source", length = 80)
    private String source;

    @Column(name = "salesperson_id")
    private Long salespersonId;

    @Column(nullable = false)
    private boolean active = true;
}
