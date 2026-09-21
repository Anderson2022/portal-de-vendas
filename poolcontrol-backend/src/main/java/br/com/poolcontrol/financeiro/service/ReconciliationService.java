package br.com.poolcontrol.financeiro.service;
import br.com.poolcontrol.financeiro.api.dto.ReconciliationRequest;
import br.com.poolcontrol.financeiro.domain.Reconciliation;
import br.com.poolcontrol.financeiro.domain.enums.ReconciliationStatus;
import br.com.poolcontrol.financeiro.exception.BusinessException;
import br.com.poolcontrol.financeiro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
@Service @RequiredArgsConstructor
public class ReconciliationService {
 private final BankStatementEntryRepository statementRepo; private final FinancialMovementRepository movementRepo; private final ReconciliationRepository reconciliationRepo;
 @Transactional public Reconciliation reconcile(ReconciliationRequest r){
   var st=statementRepo.findById(r.extratoId()).orElseThrow(()->new BusinessException("Lançamento de extrato não encontrado"));
   var mv=movementRepo.findById(r.movimentacaoId()).orElseThrow(()->new BusinessException("Movimentação financeira não encontrada"));
   if(!st.getEmpresaId().equals(r.empresaId()) || !mv.getEmpresaId().equals(r.empresaId())) throw new BusinessException("Registros pertencem a outra empresa");
   var diff=st.getValor().abs().subtract(mv.getValor().abs()).abs();
   var c=new Reconciliation(); c.setEmpresaId(r.empresaId()); c.setExtratoId(st.getId()); c.setMovimentacaoFinanceiraId(mv.getId()); c.setConciliadoEm(OffsetDateTime.now()); c.setConciliadoPor(r.usuarioId()); c.setDiferenca(diff); c.setStatus(diff.signum()==0?ReconciliationStatus.CONCILIADO:ReconciliationStatus.DIVERGENTE); c.setObservacoes(r.observacoes());
   st.setStatus(c.getStatus()); mv.setConciliado(c.getStatus()==ReconciliationStatus.CONCILIADO); statementRepo.save(st); movementRepo.save(mv); return reconciliationRepo.save(c);
 }
}
