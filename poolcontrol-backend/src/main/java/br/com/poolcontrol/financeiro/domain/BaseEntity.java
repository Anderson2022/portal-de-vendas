package br.com.poolcontrol.financeiro.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;
@Getter @Setter @MappedSuperclass
public abstract class BaseEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  @Column(name="empresa_id", nullable=false) private UUID empresaId;
  @Column(name="criado_em", nullable=false, updatable=false) private OffsetDateTime criadoEm;
  @Column(name="atualizado_em", nullable=false) private OffsetDateTime atualizadoEm;
  @Column(name="excluido_em") private OffsetDateTime excluidoEm;
  @PrePersist void prePersist(){ var now=OffsetDateTime.now(); criadoEm=now; atualizadoEm=now; }
  @PreUpdate void preUpdate(){ atualizadoEm=OffsetDateTime.now(); }
}
