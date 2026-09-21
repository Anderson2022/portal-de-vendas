package br.com.poolcontrol.financeiro.service;

import br.com.poolcontrol.financeiro.api.dto.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service("financeiroReportingService")
@RequiredArgsConstructor
public class ReportingService {
  private final EntityManager em;

  public DashboardResponse dashboard(Long empresaId, LocalDate inicio, LocalDate fim) {
    BigDecimal pagar = sum(
        "select coalesce(sum(valor_aberto),0) from contas_pagar where empresa_id=:e and excluido_em is null and status in ('ABERTO','PARCIAL','VENCIDO')",
        empresaId);
    BigDecimal receber = sum(
        "select coalesce(sum(valor_aberto),0) from contas_receber where empresa_id=:e and excluido_em is null and status in ('ABERTO','PARCIAL','VENCIDO')",
        empresaId);
    BigDecimal saldo = sum(
        "select coalesce(sum(saldo_atual),0) from contas_financeiras where empresa_id=:e and excluido_em is null and ativo=true",
        empresaId);
    BigDecimal entradas = sumPeriodo(
        "select coalesce(sum(valor),0) from movimentacoes_financeiras where empresa_id=:e and tipo='ENTRADA' and data_movimento between :i and :f and excluido_em is null",
        empresaId, inicio, fim);
    BigDecimal saidas = sumPeriodo(
        "select coalesce(sum(valor),0) from movimentacoes_financeiras where empresa_id=:e and tipo='SAIDA' and data_movimento between :i and :f and excluido_em is null",
        empresaId, inicio, fim);
    return new DashboardResponse(pagar, receber, saldo, entradas, saidas, entradas.subtract(saidas));
  }

  @SuppressWarnings("unchecked")
  public List<DreLinha> dre(Long empresaId, LocalDate inicio, LocalDate fim) {
    var rows = em.createNativeQuery(
        "select grupo, conta, coalesce(sum(valor),0) valor from vw_dre_financeira where empresa_id=:e and data_movimento between :i and :f group by grupo,conta order by grupo,conta")
        .setParameter("e", empresaId).setParameter("i", inicio).setParameter("f", fim).getResultList();
    return rows.stream().map(r -> {
      Object[] a = (Object[]) r;
      return new DreLinha(String.valueOf(a[0]), String.valueOf(a[1]), new BigDecimal(String.valueOf(a[2])));
    }).toList();
  }

  private BigDecimal sum(String sql, Long e) {
    return new BigDecimal(String.valueOf(em.createNativeQuery(sql).setParameter("e", e).getSingleResult()));
  }

  private BigDecimal sumPeriodo(String sql, Long e, LocalDate i, LocalDate f) {
    return new BigDecimal(String.valueOf(
        em.createNativeQuery(sql).setParameter("e", e).setParameter("i", i).setParameter("f", f).getSingleResult()));
  }
}
