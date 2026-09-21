package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="movimentacoes_caixa")
public class CashMovement extends BaseEntity {
@Column(name="caixa_id",nullable=false) private UUID caixaId;
@Column(name="movimentacao_financeira_id") private UUID movimentacaoFinanceiraId;
@Column(nullable=false,length=20) private String tipo;
@Column(nullable=false,precision=19,scale=4) private BigDecimal valor;
@Column(nullable=false,length=255) private String descricao;
@Column(name="ocorrido_em",nullable=false) private OffsetDateTime ocorridoEm=OffsetDateTime.now();
@Column(name="usuario_id") private Long usuarioId;
}
