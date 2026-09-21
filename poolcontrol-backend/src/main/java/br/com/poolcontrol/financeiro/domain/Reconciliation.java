package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="conciliacoes")
public class Reconciliation extends BaseEntity {

  @Column(name="extrato_id",nullable=false) private UUID extratoId;
  @Column(name="movimentacao_financeira_id") private UUID movimentacaoFinanceiraId;
  @Column(name="conciliado_em") private OffsetDateTime conciliadoEm;
  @Column(name="conciliado_por") private Long conciliadoPor;
  @Column(name="diferenca",nullable=false,precision=19,scale=4) private BigDecimal diferenca=BigDecimal.ZERO;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private ReconciliationStatus status=ReconciliationStatus.PENDENTE;
  @Column(columnDefinition="text") private String observacoes;

}
