package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="caixas")
public class CashRegister extends BaseEntity {

  @Column(name="conta_financeira_id",nullable=false) private UUID contaFinanceiraId;
  @Column(nullable=false,length=120) private String nome;
  @Column(name="saldo_abertura",precision=19,scale=4) private BigDecimal saldoAbertura=BigDecimal.ZERO;
  @Column(name="saldo_fechamento",precision=19,scale=4) private BigDecimal saldoFechamento;
  @Column(name="aberto_em") private OffsetDateTime abertoEm;
  @Column(name="fechado_em") private OffsetDateTime fechadoEm;
  @Column(name="aberto_por") private UUID abertoPor;
  @Column(name="fechado_por") private UUID fechadoPor;
  @Column(nullable=false) private boolean aberto=false;

}
