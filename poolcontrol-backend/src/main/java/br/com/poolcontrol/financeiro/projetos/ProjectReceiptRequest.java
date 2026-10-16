package br.com.poolcontrol.financeiro.projetos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
public record ProjectReceiptRequest(@NotNull @Positive Long receivableId) {}
