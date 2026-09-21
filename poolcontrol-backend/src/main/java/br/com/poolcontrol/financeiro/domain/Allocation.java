package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="rateios")
public class Allocation extends BaseEntity {

  @Column(name="origem_tipo",nullable=false,length=30) private String origemTipo;
  @Column(name="origem_id",nullable=false) private UUID origemId;
  @Column(name="centro_custo_id") private UUID centroCustoId;
  @Column(name="plano_conta_id") private UUID planoContaId;
  @Column(name="percentual",precision=9,scale=4) private BigDecimal percentual;
  @Column(name="valor",precision=19,scale=4) private BigDecimal valor;

}
