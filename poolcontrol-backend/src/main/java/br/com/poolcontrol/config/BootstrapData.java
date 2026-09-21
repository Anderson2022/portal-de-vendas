package br.com.poolcontrol.config;

import br.com.poolcontrol.empresas.entity.Company;
import br.com.poolcontrol.empresas.repository.CompanyRepository;
import br.com.poolcontrol.user.entity.Role;
import br.com.poolcontrol.user.entity.User;
import br.com.poolcontrol.user.repository.RoleRepository;
import br.com.poolcontrol.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class BootstrapData implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${poolcontrol.bootstrap.enabled:true}")
    private boolean enabled;

    @Value("${poolcontrol.bootstrap.company-name:Piscinas Azul LTDA}")
    private String companyName;

    @Value("${poolcontrol.bootstrap.admin-email:admin@poolcontrol.local}")
    private String adminEmail;

    @Value("${poolcontrol.bootstrap.admin-password:Admin@123}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled || userRepository.existsByEmailIgnoreCase(adminEmail)) {
            return;
        }

        Company company = companyRepository.findFirstByTradeNameIgnoreCase(companyName)
                .orElseGet(() -> {
                    var created = new Company();
                    created.setLegalName(companyName);
                    created.setTradeName(companyName);
                    created.setEmail(adminEmail);
                    return companyRepository.save(created);
                });

        Map<String, Set<String>> roleDefinitions = Map.of(
                "ADMIN", PermissionCatalog.ALL,
                "GERENTE", PermissionCatalog.MANAGER,
                "VENDEDOR", PermissionCatalog.SELLER,
                "FINANCEIRO", PermissionCatalog.FINANCIAL,
                "ESTOQUISTA", PermissionCatalog.STOCK,
                "TECNICO", PermissionCatalog.TECHNICIAN);

        Set<Role> roles = new HashSet<>();

        for (var definition : roleDefinitions.entrySet()) {
            Role role = roleRepository.findByCompanyIdAndName(company.getId(), definition.getKey())
                    .orElseGet(() -> {
                        var created = new Role();
                        created.setCompanyId(company.getId());
                        created.setName(definition.getKey());
                        created.setPermissions(new HashSet<>(definition.getValue()));
                        return roleRepository.save(created);
                    });

            if ("ADMIN".equals(role.getName())) {
                roles.add(role);
            }
        }

        var admin = new User();
        admin.setCompanyId(company.getId());
        admin.setName("Administrador");
        admin.setEmail(adminEmail.toLowerCase());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRoles(roles);
        admin.setActive(true);

        userRepository.save(admin);
    }
}
