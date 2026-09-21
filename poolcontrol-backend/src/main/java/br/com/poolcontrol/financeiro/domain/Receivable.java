package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="contas_receber")
public class Receivable extends BaseEntity {

  @Column(name="cliente_id") private UUID clienteId;
  @Column(name="venda_id") private UUID vendaId;
  @Column(name="categoria_financeira_id") private UUID categoriaFinanceiraId;
  @Column(name="plano_conta_id") private UUID planoContaId;
  @Column(name="centro_custo_id") private UUID centroCustoId;
  @Column(name="numero_documento",length=80) private String numeroDocumento;
  @Column(nullable=false,length=255) private String descricao;
  @Column(name="data_emissao",nullable=false) private LocalDate dataEmissao;
  @Column(name="data_competencia",nullable=false) private LocalDate dataCompetencia;
  @Column(name="data_vencimento",nullable=false) private LocalDate dataVencimento;
  @Column(name="valor_original",nullable=false,precision=19,scale=4) private BigDecimal valorOriginal;
  @Column(name="valor_aberto",nullable=false,precision=19,scale=4) private BigDecimal valorAberto;
  @Column(name="juros",nullable=false,precision=19,scale=4) private BigDecimal juros=BigDecimal.ZERO;
  @Column(name="multa",nullable=false,precision=19,scale=4) private BigDecimal multa=BigDecimal.ZERO;
  @Column(name="desconto",nullable=false,precision=19,scale=4) private BigDecimal desconto=BigDecimal.ZERO;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private FinancialStatus status=FinancialStatus.ABERTO;
  @Column(nullable=false) private boolean recorrente=false;
  @Column(name="observacoes",columnDefinition="text") private String observacoes;

}
