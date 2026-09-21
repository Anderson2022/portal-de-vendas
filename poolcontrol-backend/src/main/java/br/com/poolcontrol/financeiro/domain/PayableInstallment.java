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
@Table(name = "parcelas_pagar")
public class PayableInstallment extends BaseEntity {

  @Column(name = "conta_pagar_id", nullable = false)
  private UUID contaPagarId;
  @Column(nullable = false)
  private Integer parcela;
  @Column(nullable = false)
  private Integer totalParcelas;
  @Column(name = "data_vencimento", nullable = false)
  private LocalDate dataVencimento;
  @Column(name = "valor_original", nullable = false, precision = 19, scale = 4)
  private BigDecimal valorOriginal;
  @Column(name = "valor_aberto", nullable = false, precision = 19, scale = 4)
  private BigDecimal valorAberto;
  @Column(name = "juros", nullable = false, precision = 19, scale = 4)
  private BigDecimal juros = BigDecimal.ZERO;
  @Column(name = "multa", nullable = false, precision = 19, scale = 4)
  private BigDecimal multa = BigDecimal.ZERO;
  @Column(name = "desconto", nullable = false, precision = 19, scale = 4)
  private BigDecimal desconto = BigDecimal.ZERO;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private InstallmentStatus status = InstallmentStatus.ABERTA;

}
