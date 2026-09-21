package br.com.poolcontrol.financeiro.domain;

import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "recebimentos")
public class Receipt extends BaseEntity {

  @Column(name = "conta_receber_id", nullable = false)
  private UUID contaReceberId;
  @Column(name = "parcela_receber_id")
  private UUID parcelaReceberId;
  @Column(name = "conta_financeira_id", nullable = false)
  private UUID contaFinanceiraId;
  @Column(name = "forma_pagamento_id")
  private UUID formaPagamentoId;
  @Column(name = "data_recebimento", nullable = false)
  private LocalDate dataRecebimento;
  @Column(name = "valor_principal", nullable = false, precision = 19, scale = 4)
  private BigDecimal valorPrincipal;
  @Column(name = "juros", nullable = false, precision = 19, scale = 4)
  private BigDecimal juros = BigDecimal.ZERO;
  @Column(name = "multa", nullable = false, precision = 19, scale = 4)
  private BigDecimal multa = BigDecimal.ZERO;
  @Column(name = "desconto", nullable = false, precision = 19, scale = 4)
  private BigDecimal desconto = BigDecimal.ZERO;
  @Column(name = "valor_total", nullable = false, precision = 19, scale = 4)
  private BigDecimal valorTotal;
  @Column(name = "estornado_em")
  private OffsetDateTime estornadoEm;
  @Column(name = "estornado_por")
  private UUID estornadoPor;
  @Column(name = "motivo_estorno", length = 255)
  private String motivoEstorno;

}
