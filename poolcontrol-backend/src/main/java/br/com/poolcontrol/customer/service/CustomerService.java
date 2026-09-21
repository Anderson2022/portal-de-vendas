package br.com.poolcontrol.customer.service;



import br.com.poolcontrol.customer.dto.CustomerRequest;
import br.com.poolcontrol.customer.entity.Customer;
import br.com.poolcontrol.customer.repository.CustomerRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<Customer> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public Customer get(Long id) {
        return repository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("Cliente nÃ£o encontrado"));
    }

    @Transactional
    public Customer create(CustomerRequest request) {
        var customer = new Customer();
        customer.setCompanyId(currentUser.companyId());
        apply(customer, request);
        return repository.save(customer);
    }

    @Transactional
    public Customer update(Long id, CustomerRequest request) {
        var customer = get(id);
        apply(customer, request);
        return repository.save(customer);
    }

    private void apply(Customer customer, CustomerRequest request) {
        customer.setName(request.name());
        customer.setDocumentNumber(request.documentNumber());
        customer.setPhone(request.phone());
        customer.setWhatsapp(request.whatsapp());
        customer.setEmail(request.email());
        customer.setAddress(request.address());
        customer.setCity(request.city());
        customer.setState(request.state());
        customer.setSource(request.source());
        customer.setSalespersonId(request.salespersonId());
    }
}
