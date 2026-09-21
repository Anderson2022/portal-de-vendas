package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import br.com.poolcontrol.financeiro.domain.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="plano_contas")
public class ChartOfAccount extends BaseEntity {

  @Column(nullable=false,length=40) private String codigo;
  @Column(nullable=false,length=180) private String nome;
  @Column(name="conta_pai_id") private UUID contaPaiId;
  @Column(nullable=false,length=20) private String natureza;
  @Column(name="tipo_dre",length=30) private String tipoDre;
  @Column(nullable=false) private boolean sintetica=false;
  @Column(nullable=false) private boolean ativo=true;

}
