package br.com.poolcontrol.financeiro.domain;
import br.com.poolcontrol.financeiro.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Getter @Setter @Entity @Table(name="anexos_financeiros")
public class FinancialAttachment extends BaseEntity {
@Column(nullable=false,length=50) private String entidade;
@Column(name="entidade_id",nullable=false) private UUID entidadeId;
@Column(name="nome_arquivo",nullable=false,length=255) private String nomeArquivo;
@Column(name="mime_type",length=120) private String mimeType;
@Column(nullable=false,columnDefinition="text") private String url;
@Column(name="tamanho_bytes") private Long tamanhoBytes;
@Column(name="criado_por") private UUID criadoPor;
}
