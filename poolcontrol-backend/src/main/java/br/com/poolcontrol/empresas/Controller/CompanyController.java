package br.com.poolcontrol.empresas.Controller;



import br.com.poolcontrol.empresas.entity.Company;
import br.com.poolcontrol.empresas.repository.CompanyRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository repository;
    private final CurrentUserService currentUser;

    @GetMapping("/me")
    public Company me() {
        return repository.findById(currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("Empresa nÃ£o encontrada"));
    }
}
