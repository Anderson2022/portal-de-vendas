package br.com.poolcontrol.financeiro.projetos;

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
public class ProjectService {
    private final ProjectRepository repository;
    private final DimensionRules rules;
    private final DimensionHistory history;

    @Transactional
    public Long save(Long id, ProjectRequest request) {
        rules.lock();
        rules.code(request.code());
        rules.choice(request.type(), "INSTALACAO OBRA CONTRATO INTERNO");
        rules.reference("users", request.responsibleId());
        rules.choice(request.status(), "PLANEJADO EM_ANDAMENTO CONCLUIDO CANCELADO");
        rules.reference("customers", request.customerId());
        rules.reference("filiais", request.unitId());
        rules.reference("centros_custos", request.costCenterId());
        rules.dates(request.startDate(), request.expectedEndDate());
        rules.dates(request.startDate(), request.actualEndDate());
        if ("CONCLUIDO".equals(request.status()) && request.actualEndDate() == null) {
            throw new BusinessException("Informe a data real de conclusão.");
        }
        try {
            var saved = repository.save(id, request);
            history.record("projetos_financeiros", saved);
            return saved;
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um cadastro com este código na empresa.");
        }
    }
}
