package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="regras_aprovacao")
public class ApprovalRule extends BaseEntity {

  @Column(nullable=false,length=150) private String nome;
  @Column(name="tipo_documento",nullable=false,length=30) private String tipoDocumento;
  @Column(name="valor_minimo",nullable=false,precision=19,scale=4) private BigDecimal valorMinimo=BigDecimal.ZERO;
  @Column(name="valor_maximo",precision=19,scale=4) private BigDecimal valorMaximo;
  @Column(name="papel_aprovador",nullable=false,length=60) private String papelAprovador;
  @Column(name="nivel",nullable=false) private Integer nivel=1;
  @Column(nullable=false) private boolean ativo=true;

}
