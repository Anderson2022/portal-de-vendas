package br.com.poolcontrol.financeiro.contas;

import br.com.poolcontrol.financeiro.contas.fiscal.FiscalSettingsRepository;
import br.com.poolcontrol.financeiro.contas.integrations.IntegrationSettingsRepository;
import br.com.poolcontrol.financeiro.contas.notes.AccountNotesRepository;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChartAccountService {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;
    private final ChartAccountLinks links;
    private final ChartAccountHierarchy hierarchy;
    private final ChartAccountGeneralRepository general;
    private final FiscalSettingsRepository fiscal;
    private final IntegrationSettingsRepository integrations;
    private final AccountNotesRepository notes;

    @Transactional
    public UUID create(UpdateChartAccountRequest request) {
        serializeCompany();
        UUID id = UUID.randomUUID();
        save(id, request);
        return id;
    }

    @Transactional
    public void update(UUID id, UpdateChartAccountRequest request) {
        serializeCompany();
        String previous = lock(id);
        save(id, request);
        try {
            hierarchy.recodeDescendants(id, previous, request.code());
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("A alteração causaria códigos duplicados nas subcontas.");
        }
    }

    private void save(UUID id, UpdateChartAccountRequest request) {
        hierarchy.validate(id, request);
        try {
            general.save(id, request);
        } catch (DuplicateKeyException exception) {
            throw new BusinessException("Já existe um plano de contas com este código.");
        }
        fiscal.save(id, request.fiscal());
        integrations.save(id, request.integrations());
        notes.save(id, request.notes());
    }

    @Transactional
    public void delete(UUID id) {
        serializeCompany();
        lock(id);
        if (links.exists(id)) {
            throw new BusinessException("Não é possível excluir: existem registros ou subcontas vinculados ao plano de contas.");
        }
        jdbc.sql("""
                UPDATE plano_contas SET excluido_em = CURRENT_TIMESTAMP, atualizado_em = CURRENT_TIMESTAMP
                 WHERE id = :id AND empresa_id = :company AND excluido_em IS NULL
                """).param("id", id).param("company", currentUser.companyId()).update();
    }

    private String lock(UUID id) {
        return jdbc.sql("""
                SELECT codigo FROM plano_contas
                 WHERE id = :id AND empresa_id = :company AND excluido_em IS NULL FOR UPDATE
                """).param("id", id).param("company", currentUser.companyId()).query(String.class).optional()
                .orElseThrow(() -> new NotFoundException("Plano de contas não encontrado."));
    }

    private void serializeCompany() {
        jdbc.sql("SELECT pg_advisory_xact_lock(:company)").param("company", currentUser.companyId()).query().listOfRows();
    }
}
