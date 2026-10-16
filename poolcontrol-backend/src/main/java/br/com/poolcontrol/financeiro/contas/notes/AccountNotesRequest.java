package br.com.poolcontrol.financeiro.contas.notes;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AccountNotesRequest(
        @Size(max = 10000) String notes,
        @Size(max = 10000) String entryInstructions,
        @Size(max = 10000) String accountingNotes,
        @Size(max = 10000) String fiscalNotes,
        Long responsibleUserId,
        LocalDate startDate,
        LocalDate endDate) {
}
