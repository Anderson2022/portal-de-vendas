package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="contas_financeiras")
public class FinancialAccount extends BaseEntity {

  @Column(nullable=false,length=40) private String codigo;
  @Column(nullable=false,length=150) private String nome;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AccountType tipo;
  @Column(name="saldo_inicial",nullable=false,precision=19,scale=4) private BigDecimal saldoInicial=BigDecimal.ZERO;
  @Column(name="saldo_atual",nullable=false,precision=19,scale=4) private BigDecimal saldoAtual=BigDecimal.ZERO;
  @Column(length=3,nullable=false) private String moeda="BRL";
  @Column(nullable=false) private boolean ativo=true;

}
