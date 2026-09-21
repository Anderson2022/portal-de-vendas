package br.com.poolcontrol.financeiro.api.dto;
import br.com.poolcontrol.financeiro.domain.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record ApprovalDecisionRequest(@NotNull UUID empresaId,@NotNull ApprovalStatus decisao,@NotNull UUID usuarioId,String observacoes) {}
