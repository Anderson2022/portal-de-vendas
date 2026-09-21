package br.com.poolcontrol.financeiro.api.dto;
import java.math.BigDecimal;
public record DashboardResponse(BigDecimal contasPagarAbertas, BigDecimal contasReceberAbertas, BigDecimal saldoFinanceiro,
 BigDecimal entradasPeriodo, BigDecimal saidasPeriodo, BigDecimal resultadoPeriodo) {}
