package br.com.poolcontrol.financeiro.api.dto;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record ReconciliationRequest(Long empresaId,@NotNull UUID extratoId,@NotNull UUID movimentacaoId,Long usuarioId,String observacoes) {}
