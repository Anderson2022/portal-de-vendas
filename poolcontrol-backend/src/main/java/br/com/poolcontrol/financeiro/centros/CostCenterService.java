package br.com.poolcontrol.financeiro.centros;

import br.com.poolcontrol.financeiro.dimensoes.DimensionRules;
import br.com.poolcontrol.financeiro.dimensoes.DimensionHistory;
import br.com.poolcontrol.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CostCenterService {
    private final CostCenterRepository repository;
    private final DimensionRules rules;
    private final DimensionHistory history;

    @Transactional
    public UUID save(UUID id, CostCenterRequest request) {
        rules.lock();
        rules.code(request.code());
        rules.dates(request.startDate(), request.endDate());
        rules.hierarchy("centros_custos", "centro_pai_id", id, request.parentId());
        rules.choice(request.type(), "ADMINISTRATIVO OPERACIONAL COMERCIAL LOGISTICA PRODUCAO PROJETO UNIDADE OUTROS");
        rules.reference("users", request.responsibleId());
        try {
            var saved = repository.save(id, request);
            history.record("centros_custos", saved);
            return saved;
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um cadastro com este código na empresa.");
        }
    }
}
