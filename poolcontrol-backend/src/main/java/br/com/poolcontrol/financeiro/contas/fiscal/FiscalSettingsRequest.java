package br.com.poolcontrol.financeiro.contas.fiscal;

import jakarta.validation.constraints.Size;
import java.util.UUID;

public record FiscalSettingsRequest(
        Long referenceAccountId,
        Long spedClassificationId,
        @Size(max = 60) String spedCode,
        Long statementId,
        Long statementGroupId,
        UUID closingAccountId,
        Long fiscalNatureId,
        Long resultTypeId,
        boolean manualEntries,
        boolean compensation) {
}
