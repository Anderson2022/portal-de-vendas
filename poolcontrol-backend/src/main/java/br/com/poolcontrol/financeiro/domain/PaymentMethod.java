package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="formas_pagamento")
public class PaymentMethod extends BaseEntity {

  @Column(nullable=false,length=30) private String codigo;
  @Column(nullable=false,length=120) private String nome;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private DocumentType tipo;
  @Column(name="taxa_percentual",nullable=false,precision=9,scale=4) private BigDecimal taxaPercentual=BigDecimal.ZERO;
  @Column(name="taxa_fixa",nullable=false,precision=19,scale=4) private BigDecimal taxaFixa=BigDecimal.ZERO;
  @Column(name="dias_compensacao",nullable=false) private Integer diasCompensacao=0;
  @Column(nullable=false) private boolean ativo=true;

}
