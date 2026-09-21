package br.com.poolcontrol.empresas.entity;



import br.com.poolcontrol.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Company extends BaseEntity {
    @Column(name = "legal_name", nullable = false, length = 160)
    private String legalName;

    @Column(name = "trade_name", nullable = false, length = 160)
    private String tradeName;

    @Column(length = 18)
    private String cnpj;

    @Column(length = 160)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";
}
