package br.com.poolcontrol.financeiro.api.dto;
import br.com.poolcontrol.financeiro.domain.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record ApprovalDecisionRequest(Long empresaId,@NotNull ApprovalStatus decisao,@NotNull Long usuarioId,String observacoes) {}
