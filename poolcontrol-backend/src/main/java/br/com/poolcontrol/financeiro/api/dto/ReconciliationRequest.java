package br.com.poolcontrol.financeiro.api.dto;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record ReconciliationRequest(@NotNull UUID empresaId,@NotNull UUID extratoId,@NotNull UUID movimentacaoId,UUID usuarioId,String observacoes) {}
