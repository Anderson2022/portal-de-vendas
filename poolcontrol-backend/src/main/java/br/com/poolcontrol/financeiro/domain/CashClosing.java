package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="fechamentos_caixa")
public class CashClosing extends BaseEntity {
@Column(name="caixa_id",nullable=false) private UUID caixaId;
@Column(name="saldo_sistema",nullable=false,precision=19,scale=4) private BigDecimal saldoSistema;
@Column(name="saldo_informado",nullable=false,precision=19,scale=4) private BigDecimal saldoInformado;
@Column(name="diferenca",nullable=false,precision=19,scale=4) private BigDecimal diferenca;
@Column(name="fechado_em",nullable=false) private OffsetDateTime fechadoEm=OffsetDateTime.now();
@Column(name="fechado_por") private UUID fechadoPor;
@Column(columnDefinition="text") private String observacoes;
}
