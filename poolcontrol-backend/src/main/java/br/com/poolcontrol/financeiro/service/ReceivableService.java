package br.com.poolcontrol.financeiro.service;
import br.com.poolcontrol.financeiro.api.dto.*;
import br.com.poolcontrol.financeiro.domain.*;
import br.com.poolcontrol.financeiro.domain.enums.*;
import br.com.poolcontrol.financeiro.exception.BusinessException;
import br.com.poolcontrol.financeiro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;
@Service @RequiredArgsConstructor
public class ReceivableService {
 private final ReceivableRepository receivableRepository; private final ReceiptRepository receiptRepository;
 private final FinancialMovementRepository movementRepository; private final FinancialAccountRepository accountRepository;
 @Transactional public Receivable create(TituloFinanceiroRequest r){
   var p=new Receivable(); p.setEmpresaId(r.empresaId()); p.setClienteId(r.pessoaId()); p.setVendaId(r.origemId()); p.setCategoriaFinanceiraId(r.categoriaFinanceiraId()); p.setPlanoContaId(r.planoContaId()); p.setCentroCustoId(r.centroCustoId()); p.setNumeroDocumento(r.numeroDocumento()); p.setDescricao(r.descricao()); p.setDataEmissao(r.dataEmissao()); p.setDataCompetencia(r.dataCompetencia()); p.setDataVencimento(r.dataVencimento()); p.setValorOriginal(r.valorOriginal()); p.setValorAberto(r.valorOriginal()); p.setJuros(nvl(r.juros())); p.setMulta(nvl(r.multa())); p.setDesconto(nvl(r.desconto())); p.setRecorrente(r.recorrente()); p.setObservacoes(r.observacoes()); return receivableRepository.save(p);
 }
 @Transactional public Receipt receive(UUID id, LiquidacaoRequest r){
   var p=receivableRepository.findById(id).orElseThrow(()->new BusinessException("Conta a receber não encontrada")); if(!p.getEmpresaId().equals(r.empresaId())) throw new BusinessException("Conta não pertence à empresa informada"); if(r.valorPrincipal().compareTo(p.getValorAberto())>0) throw new BusinessException("Valor principal maior que o saldo aberto");
   var total=r.valorPrincipal().add(nvl(r.juros())).add(nvl(r.multa())).subtract(nvl(r.desconto())); var rc=new Receipt(); rc.setEmpresaId(r.empresaId()); rc.setContaReceberId(id); rc.setParcelaReceberId(r.parcelaId()); rc.setContaFinanceiraId(r.contaFinanceiraId()); rc.setFormaPagamentoId(r.formaPagamentoId()); rc.setDataRecebimento(r.data()); rc.setValorPrincipal(r.valorPrincipal()); rc.setJuros(nvl(r.juros())); rc.setMulta(nvl(r.multa())); rc.setDesconto(nvl(r.desconto())); rc.setValorTotal(total); receiptRepository.save(rc);
   p.setValorAberto(p.getValorAberto().subtract(r.valorPrincipal())); p.setStatus(p.getValorAberto().signum()==0?FinancialStatus.PAGO:FinancialStatus.PARCIAL); receivableRepository.save(p);
   var acc=accountRepository.findById(r.contaFinanceiraId()).orElseThrow(()->new BusinessException("Conta financeira não encontrada")); acc.setSaldoAtual(acc.getSaldoAtual().add(total)); accountRepository.save(acc);
   var mv=new FinancialMovement(); mv.setEmpresaId(r.empresaId()); mv.setContaFinanceiraId(r.contaFinanceiraId()); mv.setTipo(TransactionType.ENTRADA); mv.setOrigem(MovementOrigin.RECEBIMENTO); mv.setOrigemId(rc.getId()); mv.setDataMovimento(r.data()); mv.setValor(total); mv.setDescricao("Recebimento: "+p.getDescricao()); mv.setCategoriaFinanceiraId(p.getCategoriaFinanceiraId()); mv.setCentroCustoId(p.getCentroCustoId()); movementRepository.save(mv); return rc;
 }
 private BigDecimal nvl(BigDecimal v){ return v==null?BigDecimal.ZERO:v; }
}
