package br.com.poolcontrol.financeiro.service;
import br.com.poolcontrol.financeiro.api.dto.TransferenciaRequest;
import br.com.poolcontrol.financeiro.domain.FinancialMovement;
import br.com.poolcontrol.financeiro.domain.enums.*;
import br.com.poolcontrol.financeiro.exception.BusinessException;
import br.com.poolcontrol.financeiro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class TransferService {
 private final FinancialAccountRepository accountRepository; private final FinancialMovementRepository movementRepository;
 @Transactional public void transfer(TransferenciaRequest r){ if(r.contaOrigemId().equals(r.contaDestinoId())) throw new BusinessException("Conta de origem e destino devem ser diferentes"); var o=accountRepository.findById(r.contaOrigemId()).orElseThrow(()->new BusinessException("Conta de origem não encontrada")); var d=accountRepository.findById(r.contaDestinoId()).orElseThrow(()->new BusinessException("Conta de destino não encontrada")); o.setSaldoAtual(o.getSaldoAtual().subtract(r.valor())); d.setSaldoAtual(d.getSaldoAtual().add(r.valor())); accountRepository.save(o); accountRepository.save(d); var mv=new FinancialMovement(); mv.setEmpresaId(r.empresaId()); mv.setContaFinanceiraId(o.getId()); mv.setContaDestinoId(d.getId()); mv.setTipo(TransactionType.TRANSFERENCIA); mv.setOrigem(MovementOrigin.TRANSFERENCIA); mv.setDataMovimento(r.data()); mv.setValor(r.valor()); mv.setDescricao(r.descricao()); movementRepository.save(mv); }
}
