package br.com.poolcontrol.marcas.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "marcas",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_marcas_empresa_codigo",
                        columnNames = {"empresa_id", "codigo"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "endereco_id")
    private Long enderecoId;

    @Column(name = "codigo", length = 30)
    private String codigo;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "nome_reduzido", length = 80)
    private String nomeReduzido;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "site", length = 255)
    private String site;

    @Column(name = "contato", length = 255)
    private String contato;

    @Column(name = "codigo_externo", length = 100)
    private String codigoExterno;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @Column(name = "excluido_em")
    private LocalDateTime excluidoEm;

    @PrePersist
    public void prePersist() {
        LocalDateTime agora = LocalDateTime.now();

        if (criadoEm == null) {
            criadoEm = agora;
        }

        atualizadoEm = agora;

        if (ativo == null) {
            ativo = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}