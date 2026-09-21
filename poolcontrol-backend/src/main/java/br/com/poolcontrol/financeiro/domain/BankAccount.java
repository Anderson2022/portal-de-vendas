package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="contas_bancarias")
public class BankAccount extends BaseEntity {

  @Column(name="conta_financeira_id",nullable=false) private UUID contaFinanceiraId;
  @Column(name="codigo_banco",length=10) private String codigoBanco;
  @Column(length=150) private String banco;
  @Column(length=20) private String agencia;
  @Column(length=30) private String conta;
  @Column(name="digito_conta",length=5) private String digitoConta;
  @Column(name="tipo_conta",length=30) private String tipoConta;
  @Column(length=18) private String pix;
  @Column(name="titular_nome",length=180) private String titularNome;
  @Column(name="titular_documento",length=20) private String titularDocumento;

}
