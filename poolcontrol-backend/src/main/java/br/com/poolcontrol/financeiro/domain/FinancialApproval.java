package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="aprovacoes_financeiras")
public class FinancialApproval extends BaseEntity {

  @Column(name="tipo_documento",nullable=false,length=30) private String tipoDocumento;
  @Column(name="documento_id",nullable=false) private UUID documentoId;
  @Column(name="regra_id") private UUID regraId;
  @Column(name="nivel",nullable=false) private Integer nivel=1;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private ApprovalStatus status=ApprovalStatus.PENDENTE;
  @Column(name="solicitado_por") private UUID solicitadoPor;
  @Column(name="aprovado_por") private UUID aprovadoPor;
  @Column(name="decidido_em") private OffsetDateTime decididoEm;
  @Column(columnDefinition="text") private String observacoes;

}
