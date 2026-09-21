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
@Table(name = "movimentacoes_financeiras")
public class FinancialMovement extends BaseEntity {

  @Column(name = "conta_financeira_id", nullable = false)
  private UUID contaFinanceiraId;
  @Column(name = "conta_destino_id")
  private UUID contaDestinoId;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TransactionType tipo;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private MovementOrigin origem;
  @Column(name = "origem_id")
  private UUID origemId;
  @Column(name = "data_movimento", nullable = false)
  private LocalDate dataMovimento;
  @Column(nullable = false, precision = 19, scale = 4)
  private BigDecimal valor;
  @Column(nullable = false, length = 255)
  private String descricao;
  @Column(name = "categoria_financeira_id")
  private UUID categoriaFinanceiraId;
  @Column(name = "centro_custo_id")
  private UUID centroCustoId;
  @Column(nullable = false)
  private boolean conciliado = false;

}
