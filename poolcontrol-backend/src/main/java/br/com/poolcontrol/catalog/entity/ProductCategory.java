package br.com.poolcontrol.catalog.entity;



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
@Table(name = "categorias_produto")
public class ProductCategory extends TenantEntity {

    @Column(nullable = false, length = 100)
    private String name;
}
