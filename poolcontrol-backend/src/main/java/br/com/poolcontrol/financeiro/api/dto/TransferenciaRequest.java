package br.com.poolcontrol.financeiro.api.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
public record TransferenciaRequest(Long empresaId,@NotNull UUID contaOrigemId,@NotNull UUID contaDestinoId,
 @NotNull LocalDate data,@NotNull @DecimalMin("0.01") BigDecimal valor,@NotBlank String descricao) {}
