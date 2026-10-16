package br.com.poolcontrol.financeiro.unidades;

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
public class UnitService {
    private final UnitRepository repository;
    private final DimensionRules rules;
    private final DimensionHistory history;

    @Transactional
    public Long save(Long id, UnitRequest request) {
        rules.lock();
        rules.code(request.code());
        rules.dates(request.startDate(), request.endDate());
        rules.hierarchy("filiais", "unidade_pai_id", id, request.parentId());
        rules.choice(request.type(), "MATRIZ FILIAL LOJA DEPOSITO OPERACAO");
        rules.reference("users", request.responsibleId());
        rules.reference("centros_custos", request.defaultCostCenterId());
        rules.reference("contas_bancarias", request.defaultBankAccountId());
        try {
            var saved = repository.save(id, request);
            history.record("filiais", saved);
            return saved;
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um cadastro com este código na empresa.");
        }
    }
}
