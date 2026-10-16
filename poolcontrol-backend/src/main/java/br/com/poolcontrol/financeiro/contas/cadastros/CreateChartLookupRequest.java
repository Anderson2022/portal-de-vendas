package br.com.poolcontrol.financeiro.contas.cadastros;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateChartLookupRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        Long parentId) {
}
