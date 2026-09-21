package br.com.poolcontrol.supplier.entity;



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
@Table(name = "fornecedores")
public class Supplier extends TenantEntity {

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "document_number", length = 20)
    private String documentNumber;

    @Column(length = 30)
    private String phone;

    @Column(length = 180)
    private String email;

    @Column(nullable = false)
    private boolean active = true;
}
