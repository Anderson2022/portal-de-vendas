package br.com.poolcontrol.supplier.service;



import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.supplier.dto.SupplierRequest;
import br.com.poolcontrol.supplier.entity.Supplier;
import br.com.poolcontrol.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository repository;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<Supplier> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId());
    }

    @Transactional
    public Supplier create(SupplierRequest request) {
        var supplier = new Supplier();
        supplier.setCompanyId(currentUser.companyId());
        supplier.setName(request.name());
        supplier.setDocumentNumber(request.documentNumber());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        return repository.save(supplier);
    }
}
