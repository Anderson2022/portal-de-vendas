package br.com.poolcontrol.financeiro.api.dto;
import java.math.BigDecimal;
public record DreLinha(String grupo, String conta, BigDecimal valor) {}
