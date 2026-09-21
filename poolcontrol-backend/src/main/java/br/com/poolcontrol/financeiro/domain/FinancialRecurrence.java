package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="recorrencias_financeiras")
public class FinancialRecurrence extends BaseEntity {
@Column(nullable=false,length=20) private String tipo;
@Column(nullable=false,length=255) private String descricao;
@Column(name="pessoa_id") private UUID pessoaId;
@Column(name="categoria_financeira_id") private UUID categoriaFinanceiraId;
@Column(name="plano_conta_id") private UUID planoContaId;
@Column(name="centro_custo_id") private UUID centroCustoId;
@Column(nullable=false,precision=19,scale=4) private BigDecimal valor;
@Column(nullable=false,length=20) private String periodicidade;
@Column(name="dia_vencimento",nullable=false) private Integer diaVencimento;
@Column(nullable=false) private LocalDate inicio;
@Column private LocalDate fim;
@Column(name="proxima_geracao") private LocalDate proximaGeracao;
@Column(nullable=false) private boolean ativo=true;
}
