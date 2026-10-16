package br.com.poolcontrol.financeiro.contas;

import br.com.poolcontrol.financeiro.contas.fiscal.FiscalSettingsRequest;
import br.com.poolcontrol.financeiro.contas.integrations.IntegrationSettingsRequest;
import br.com.poolcontrol.financeiro.contas.notes.AccountNotesRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.UUID;

public record UpdateChartAccountRequest(
        @NotBlank @Size(max = 40) @Pattern(regexp = "[0-9]{1,9}(\\.[0-9]{1,9})*") String code,
        @NotBlank @Size(max = 180) String name,
        @NotBlank @Size(max = 20) String shortCode,
        UUID parentId,
        @NotNull Long groupId,
        Long subgroupId,
        @NotNull Long typeId,
        @NotNull Long natureId,
        boolean active,
        boolean acceptsEntries,
        boolean allowsCostCenter,
        boolean requiresHistory,
        @Valid @NotNull FiscalSettingsRequest fiscal,
        @Valid @NotNull IntegrationSettingsRequest integrations,
        @Valid @NotNull AccountNotesRequest notes) {
}
