package br.com.poolcontrol.financeiro.api.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
public record TituloFinanceiroRequest(
 Long empresaId, Long pessoaId, Long origemId, UUID categoriaFinanceiraId, UUID planoContaId, UUID centroCustoId,
 @Size(max=80) String numeroDocumento, @NotBlank @Size(max=255) String descricao,
 @NotNull LocalDate dataEmissao, @NotNull LocalDate dataCompetencia, @NotNull LocalDate dataVencimento,
 @NotNull @DecimalMin(value="0.01") BigDecimal valorOriginal,
 @DecimalMin("0.00") BigDecimal juros, @DecimalMin("0.00") BigDecimal multa, @DecimalMin("0.00") BigDecimal desconto,
 boolean recorrente, String observacoes) {}
