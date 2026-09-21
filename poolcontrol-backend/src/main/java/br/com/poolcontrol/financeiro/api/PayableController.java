package br.com.poolcontrol.financeiro.api;
import br.com.poolcontrol.financeiro.api.dto.*; import br.com.poolcontrol.financeiro.domain.*; import br.com.poolcontrol.financeiro.repository.PayableRepository; import br.com.poolcontrol.financeiro.service.PayableService;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/financeiro/contas-pagar") @RequiredArgsConstructor
public class PayableController { private final PayableService service; private final PayableRepository repo;
 @PostMapping public Payable create(@Valid @RequestBody TituloFinanceiroRequest r){return service.create(r);} @GetMapping public List<Payable> list(){return repo.findAll();} @GetMapping("/{id}") public Payable get(@PathVariable UUID id){return repo.findById(id).orElseThrow();} @PostMapping("/{id}/pagar") public Payment pay(@PathVariable UUID id,@Valid @RequestBody LiquidacaoRequest r){return service.pay(id,r);} }
