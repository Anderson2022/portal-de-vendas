package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="orcamento_itens")
public class BudgetItem extends BaseEntity {
@Column(name="orcamento_id",nullable=false) private UUID orcamentoId;
@Column(name="plano_conta_id") private UUID planoContaId;
@Column(name="centro_custo_id") private UUID centroCustoId;
@Column(nullable=false) private Integer mes;
@Column(name="valor_previsto",nullable=false,precision=19,scale=4) private BigDecimal valorPrevisto;
}
