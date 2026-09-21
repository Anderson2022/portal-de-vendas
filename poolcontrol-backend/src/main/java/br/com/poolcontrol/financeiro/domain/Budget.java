package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="orcamentos_financeiros")
public class Budget extends BaseEntity {

  @Column(nullable=false,length=150) private String nome;
  @Column(name="ano",nullable=false) private Integer ano;
  @Column(name="mes_inicio",nullable=false) private Integer mesInicio;
  @Column(name="mes_fim",nullable=false) private Integer mesFim;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private BudgetStatus status=BudgetStatus.RASCUNHO;
  @Column(columnDefinition="text") private String observacoes;

}
