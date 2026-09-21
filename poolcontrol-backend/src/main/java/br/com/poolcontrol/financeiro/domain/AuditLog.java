package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity(name="FinancialAuditLog") @Table(name="auditoria_financeira")
public class AuditLog extends BaseEntity {

  @Column(name="usuario_id") private Long usuarioId;
  @Column(nullable=false,length=80) private String entidade;
  @Column(name="entidade_id",nullable=false) private UUID entidadeId;
  @Column(nullable=false,length=30) private String acao;
  @Column(name="dados_anteriores",columnDefinition="jsonb") private String dadosAnteriores;
  @Column(name="dados_novos",columnDefinition="jsonb") private String dadosNovos;
  @Column(name="ip_origem",length=64) private String ipOrigem;

}
