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
import java.time.OffsetDateTime;
import java.util.UUID;
@Service @RequiredArgsConstructor
public class PayableService {
 private final PayableRepository payableRepository; private final PaymentRepository paymentRepository;
 private final FinancialMovementRepository movementRepository; private final FinancialAccountRepository accountRepository;
 @Transactional public Payable create(TituloFinanceiroRequest r){
   var p=new Payable(); p.setEmpresaId(r.empresaId()); p.setFornecedorId(r.pessoaId()); p.setCompraId(r.origemId()); p.setCategoriaFinanceiraId(r.categoriaFinanceiraId()); p.setPlanoContaId(r.planoContaId()); p.setCentroCustoId(r.centroCustoId()); p.setNumeroDocumento(r.numeroDocumento()); p.setDescricao(r.descricao()); p.setDataEmissao(r.dataEmissao()); p.setDataCompetencia(r.dataCompetencia()); p.setDataVencimento(r.dataVencimento()); p.setValorOriginal(r.valorOriginal()); p.setValorAberto(r.valorOriginal()); p.setJuros(nvl(r.juros())); p.setMulta(nvl(r.multa())); p.setDesconto(nvl(r.desconto())); p.setRecorrente(r.recorrente()); p.setObservacoes(r.observacoes()); return payableRepository.save(p);
 }
 @Transactional public Payment pay(UUID id, LiquidacaoRequest r){
   var p=payableRepository.findById(id).orElseThrow(()->new BusinessException("Conta a pagar não encontrada"));
   if(!p.getEmpresaId().equals(r.empresaId())) throw new BusinessException("Conta não pertence à empresa informada");
   if(r.valorPrincipal().compareTo(p.getValorAberto())>0) throw new BusinessException("Valor principal maior que o saldo aberto");
   var total=r.valorPrincipal().add(nvl(r.juros())).add(nvl(r.multa())).subtract(nvl(r.desconto()));
   var pg=new Payment(); pg.setEmpresaId(r.empresaId()); pg.setContaPagarId(id); pg.setParcelaPagarId(r.parcelaId()); pg.setContaFinanceiraId(r.contaFinanceiraId()); pg.setFormaPagamentoId(r.formaPagamentoId()); pg.setDataPagamento(r.data()); pg.setValorPrincipal(r.valorPrincipal()); pg.setJuros(nvl(r.juros())); pg.setMulta(nvl(r.multa())); pg.setDesconto(nvl(r.desconto())); pg.setValorTotal(total); paymentRepository.save(pg);
   p.setValorAberto(p.getValorAberto().subtract(r.valorPrincipal())); p.setStatus(p.getValorAberto().signum()==0?FinancialStatus.PAGO:FinancialStatus.PARCIAL); payableRepository.save(p);
   var acc=accountRepository.findById(r.contaFinanceiraId()).orElseThrow(()->new BusinessException("Conta financeira não encontrada")); acc.setSaldoAtual(acc.getSaldoAtual().subtract(total)); accountRepository.save(acc);
   var mv=new FinancialMovement(); mv.setEmpresaId(r.empresaId()); mv.setContaFinanceiraId(r.contaFinanceiraId()); mv.setTipo(TransactionType.SAIDA); mv.setOrigem(MovementOrigin.PAGAMENTO); mv.setOrigemId(pg.getId()); mv.setDataMovimento(r.data()); mv.setValor(total); mv.setDescricao("Pagamento: "+p.getDescricao()); mv.setCategoriaFinanceiraId(p.getCategoriaFinanceiraId()); mv.setCentroCustoId(p.getCentroCustoId()); movementRepository.save(mv); return pg;
 }
 private BigDecimal nvl(BigDecimal v){ return v==null?BigDecimal.ZERO:v; }
}
