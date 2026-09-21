package br.com.poolcontrol.financeiro.api.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
public record LiquidacaoRequest(@NotNull UUID empresaId, UUID parcelaId, @NotNull UUID contaFinanceiraId, UUID formaPagamentoId,
 @NotNull LocalDate data, @NotNull @DecimalMin("0.01") BigDecimal valorPrincipal,
 @DecimalMin("0.00") BigDecimal juros, @DecimalMin("0.00") BigDecimal multa, @DecimalMin("0.00") BigDecimal desconto) {}
