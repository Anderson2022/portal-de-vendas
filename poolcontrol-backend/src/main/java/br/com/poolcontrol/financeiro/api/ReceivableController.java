package br.com.poolcontrol.financeiro.api;
import br.com.poolcontrol.financeiro.api.dto.*; import br.com.poolcontrol.financeiro.domain.*; import br.com.poolcontrol.financeiro.repository.ReceivableRepository; import br.com.poolcontrol.financeiro.service.ReceivableService;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/financeiro/contas-receber") @RequiredArgsConstructor
public class ReceivableController { private final ReceivableService service; private final ReceivableRepository repo;
 @PostMapping public Receivable create(@Valid @RequestBody TituloFinanceiroRequest r){return service.create(r);} @GetMapping public List<Receivable> list(){return repo.findAll();} @GetMapping("/{id}") public Receivable get(@PathVariable UUID id){return repo.findById(id).orElseThrow();} @PostMapping("/{id}/receber") public Receipt receive(@PathVariable UUID id,@Valid @RequestBody LiquidacaoRequest r){return service.receive(id,r);} }
