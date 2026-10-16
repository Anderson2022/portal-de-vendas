package br.com.poolcontrol.financeiro.contas.cadastros;

import br.com.poolcontrol.shared.exception.NotFoundException;
import java.util.List;

public record ChartLookupDefinition(
        String key, String table, String code, String name, String scope,
        String active, boolean creatable, String parentColumn, String parentKey) {
    private static ChartLookupDefinition catalog(String key, String table) {
        return new ChartLookupDefinition(key, table, "codigo", "nome", "empresa_id = :company",
                "ativo", true, null, null);
    }

    public static final List<ChartLookupDefinition> ALL = List.of(
            new ChartLookupDefinition("parentAccount", "plano_contas", "codigo", "nome",
                    "empresa_id = :company AND excluido_em IS NULL", "ativo", false, "conta_pai_id", null),
            catalog("accountGroup", "grupos_contabeis"),
            new ChartLookupDefinition("accountSubgroup", "subgrupos_contabeis", "codigo", "nome",
                    "empresa_id = :company", "ativo", true, "grupo_id", "accountGroup"),
            new ChartLookupDefinition("accountType", "tipos_conta_contabil", "codigo", "nome",
                    "TRUE", "ativo", false, null, null),
            new ChartLookupDefinition("accountNature", "naturezas_contabeis", "codigo", "nome",
                    "TRUE", "ativo", false, null, null),
            catalog("referenceAccount", "contas_referenciais"),
            catalog("spedClassification", "classificacoes_sped"),
            catalog("statement", "demonstrativos_contabeis"),
            new ChartLookupDefinition("statementGroup", "grupos_demonstrativo", "codigo", "nome",
                    "empresa_id = :company", "ativo", true, "demonstrativo_id", "statement"),
            new ChartLookupDefinition("closingAccount", "plano_contas", "codigo", "nome",
                    "empresa_id = :company AND excluido_em IS NULL", "ativo", false, null, null),
            catalog("fiscalNature", "naturezas_fiscais"),
            catalog("resultType", "tipos_resultado"),
            new ChartLookupDefinition("company", "empresas", "id::text", "trade_name",
                    "id = :company", "TRUE", false, null, null),
            catalog("branch", "filiais"),
            new ChartLookupDefinition("bankAccount", "contas_bancarias", "COALESCE(conta, '')",
                    "concat_ws(' / ', banco, agencia, conta)", "empresa_id = :company AND excluido_em IS NULL",
                    "TRUE", false, null, null),
            new ChartLookupDefinition("defaultCostCenter", "centros_custos", "codigo", "nome",
                    "empresa_id = :company AND excluido_em IS NULL", "ativo", false, null, null),
            catalog("defaultProject", "projetos_financeiros"),
            catalog("externalIntegration", "integracoes_externas"),
            new ChartLookupDefinition("externalAccount", "contas_externas", "codigo", "nome",
                    "empresa_id = :company", "ativo", true, "integracao_id", "externalIntegration"),
            new ChartLookupDefinition("responsibleUser", "users", "id::text", "name",
                    "empresa_id = :company", "active", false, null, null));

    public static ChartLookupDefinition find(String key) {
        return ALL.stream().filter(item -> item.key().equals(key)).findFirst()
                .orElseThrow(() -> new NotFoundException("Cadastro não encontrado."));
    }
}
