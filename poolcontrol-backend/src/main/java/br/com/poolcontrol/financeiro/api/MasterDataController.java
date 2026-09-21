package br.com.poolcontrol.financeiro.api;
import br.com.poolcontrol.financeiro.domain.*; import br.com.poolcontrol.financeiro.repository.*; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/financeiro/cadastros") @RequiredArgsConstructor
public class MasterDataController {
 private final FinancialCategoryRepository categories; private final ChartOfAccountRepository chart; private final CostCenterRepository centers; private final FinancialAccountRepository accounts; private final PaymentMethodRepository methods;
 @GetMapping("/categorias") List<FinancialCategory> categorias(){return categories.findAll();} @PostMapping("/categorias") FinancialCategory categoria(@RequestBody FinancialCategory v){return categories.save(v);}
 @GetMapping("/plano-contas") List<ChartOfAccount> plano(){return chart.findAll();} @PostMapping("/plano-contas") ChartOfAccount plano(@RequestBody ChartOfAccount v){return chart.save(v);}
 @GetMapping("/centros-custos") List<CostCenter> centros(){return centers.findAll();} @PostMapping("/centros-custos") CostCenter centro(@RequestBody CostCenter v){return centers.save(v);}
 @GetMapping("/contas-financeiras") List<FinancialAccount> contas(){return accounts.findAll();} @PostMapping("/contas-financeiras") FinancialAccount conta(@RequestBody FinancialAccount v){return accounts.save(v);}
 @GetMapping("/formas-pagamento") List<PaymentMethod> formas(){return methods.findAll();} @PostMapping("/formas-pagamento") PaymentMethod forma(@RequestBody PaymentMethod v){return methods.save(v);}
}
