package br.com.poolcontrol.financeiro.contas.integrations;

import jakarta.validation.constraints.Size;
import java.util.UUID;

public record IntegrationSettingsRequest(
        Long branchId,
        UUID bankAccountId,
        UUID defaultCostCenterId,
        Long defaultProjectId,
        Long externalIntegrationId,
        Long externalAccountId,
        @Size(max = 100) String externalCode,
        boolean autoSync) {
}
