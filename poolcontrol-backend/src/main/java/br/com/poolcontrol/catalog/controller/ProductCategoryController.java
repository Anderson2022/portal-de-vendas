package br.com.poolcontrol.catalog.controller;
import br.com.poolcontrol.catalog.dto.ProductCategoryRequest;
import br.com.poolcontrol.catalog.entity.Product;



import br.com.poolcontrol.catalog.entity.ProductCategory;
import br.com.poolcontrol.catalog.repository.ProductCategoryRepository;
import br.com.poolcontrol.shared.security.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product-categories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryRepository repository;
    private final CurrentUserService currentUser;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_PRODUCT_VIEW')")
    public List<ProductCategory> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_PRODUCT_MANAGE')")
    public ProductCategory create(@Valid @RequestBody ProductCategoryRequest request) {
        var category = new ProductCategory();
        category.setCompanyId(currentUser.companyId());
        category.setName(request.name());
        return repository.save(category);
    }
}
