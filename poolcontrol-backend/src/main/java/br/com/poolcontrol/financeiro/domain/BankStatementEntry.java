package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="extratos_bancarios")
public class BankStatementEntry extends BaseEntity {

  @Column(name="conta_financeira_id",nullable=false) private UUID contaFinanceiraId;
  @Column(name="identificador_externo",length=120) private String identificadorExterno;
  @Column(name="data_lancamento",nullable=false) private LocalDate dataLancamento;
  @Column(name="descricao",nullable=false,length=255) private String descricao;
  @Column(nullable=false,precision=19,scale=4) private BigDecimal valor;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private TransactionType tipo;
  @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private ReconciliationStatus status=ReconciliationStatus.PENDENTE;
  @Column(name="hash_importacao",length=128) private String hashImportacao;

}
