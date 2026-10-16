package br.com.poolcontrol.financeiro.naturezas;

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
public class FinancialNatureService {
    private final FinancialNatureRepository repository;
    private final DimensionRules rules;
    private final DimensionHistory history;

    @Transactional
    public UUID save(UUID id, FinancialNatureRequest request) {
        rules.lock();
        rules.code(request.code());
        rules.dates(request.startDate(), request.endDate());
        rules.hierarchy("naturezas_financeiras", "natureza_pai_id", id, request.parentId());
        rules.choice(request.type(), "RECEITA DESPESA TRANSFERENCIA AJUSTE INVESTIMENTO FINANCIAMENTO");
        rules.choice(request.group(), "OPERACIONAL ADMINISTRATIVO COMERCIAL FINANCEIRO INVESTIMENTO FINANCIAMENTO OUTROS");
        rules.choice(request.movement(), "ENTRADA SAIDA AMBOS");
        if ("TRANSFERENCIA".equals(request.type()) && (request.affectsDre() || request.affectsResult() || !"AMBOS".equals(request.movement()))) {
            throw new BusinessException("Transferência deve usar ambos os movimentos e não impactar DRE ou resultado.");
        }
        try {
            var saved = repository.save(id, request);
            history.record("naturezas_financeiras", saved);
            return saved;
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um cadastro com este código na empresa.");
        }
    }
}
