package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="categorias_financeiras")
public class FinancialCategory extends BaseEntity {

  @Column(nullable=false,length=30) private String codigo;
  @Column(nullable=false,length=150) private String nome;
  @Column(columnDefinition="text") private String descricao;
  @Column(name="tipo_fluxo",nullable=false,length=15) private String tipoFluxo;
  @Column(name="categoria_pai_id") private UUID categoriaPaiId;
  @Column(nullable=false) private boolean ativo=true;

}
