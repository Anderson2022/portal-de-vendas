package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="centros_custos")
public class CostCenter extends BaseEntity {

  @Column(nullable=false,length=30) private String codigo;
  @Column(nullable=false,length=150) private String nome;
  @Column(name="centro_pai_id") private UUID centroPaiId;
  @Column(nullable=false) private boolean ativo=true;

}
