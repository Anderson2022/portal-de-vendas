package br.com.poolcontrol.inventory.service;

import br.com.poolcontrol.inventory.dto.InventoryProcessRequest;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InventoryProcessService {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    public List<Map<String, Object>> list() {
        return jdbc.sql(
                "SELECT i.id,i.numero,i.tipo,i.status,i.inventario_cego,i.dupla_contagem,i.criado_em,d.name deposito FROM inventarios i JOIN depositos d ON d.id=i.deposito_id WHERE i.empresa_id=:company ORDER BY i.id DESC")
                .param("company", currentUser.companyId()).query().listOfRows();
    }

    public List<Map<String, Object>> locations(Long warehouseId) {
        return jdbc.sql(
                "SELECT id,codigo,concat_ws(' / ',nullif(prateleira,''),nullif(linha,''),nullif(coluna,''),nullif(posicao,''),coalesce(descricao,codigo)) name FROM localizacoes_estoque WHERE empresa_id=:company AND deposito_id=:warehouse AND ativo ORDER BY codigo")
                .param("company", currentUser.companyId()).param("warehouse", warehouseId).query().listOfRows();
    }

    public Map<String, Object> get(Long id) {
        var header = jdbc.sql(
                "SELECT id,numero,tipo,status,deposito_id,inventario_cego,dupla_contagem,bloqueia_movimentacoes,observacao FROM inventarios WHERE id=:id AND empresa_id=:company")
                .param("id", id).param("company", currentUser.companyId()).query().singleRow();
        var items = jdbc.sql(
                "SELECT ii.id,ii.produto_id,p.name produto,ii.saldo_sistema,ii.quantidade_aprovada,ii.divergencia,ii.status_item,ii.unidade_medida_id,u.sigla unidade,(SELECT max(numero_contagem) FROM inventario_contagens c WHERE c.inventario_item_id=ii.id) numero_contagem FROM inventario_itens ii JOIN produtos p ON p.id=ii.produto_id LEFT JOIN unidades_medida u ON u.id=ii.unidade_medida_id WHERE ii.inventario_id=:id ORDER BY p.name")
                .param("id", id).query().listOfRows();
        return Map.of("inventory", header, "items", items);
    }

    @Transactional
    public Map<String, Object> create(InventoryProcessRequest.Create request) {
        long company = currentUser.companyId(), user = currentUser.userId();
        boolean warehouse = jdbc
                .sql("SELECT EXISTS(SELECT 1 FROM depositos WHERE id=:id AND empresa_id=:company AND active)")
                .param("id", request.warehouseId()).param("company", company).query(Boolean.class).single();
        if (!warehouse)
            throw new BusinessException("Depósito inválido.");
        long id = jdbc.sql("SELECT nextval('inventarios_id_seq')").query(Long.class).single();
        String number = "INV-" + Year.now().getValue() + "-" + String.format("%05d", id);
        jdbc.sql(
                "INSERT INTO inventarios(id,empresa_id,numero,tipo,deposito_id,status,inventario_cego,dupla_contagem,bloqueia_movimentacoes,data_abertura,responsavel_id,observacao) VALUES (:id,:company,:number,:type,:warehouse,'EM_CONTAGEM',:blind,:doubleCount,:block,now(),:user,:notes)")
                .param("id", id).param("company", company).param("number", number).param("type", request.type())
                .param("warehouse", request.warehouseId()).param("blind", request.blind())
                .param("doubleCount", request.doubleCount()).param("block", request.blockMovements())
                .param("user", user).param("notes", request.notes()).update();
        Set<Long> scope = resolveScope(request, company);
        if (scope.isEmpty())
            throw new BusinessException("O escopo do inventário não possui produtos.");
        for (Long productId : scope) {
            var products = jdbc.sql("SELECT id,unit_id FROM produtos WHERE id=:id AND empresa_id=:company AND active")
                    .param("id", productId).param("company", company).query().listOfRows();
            if (products.isEmpty())
                throw new BusinessException("Produto inválido no inventário.");
            var product = products.getFirst();
            BigDecimal balance = jdbc.sql(
                    "SELECT coalesce(sum(quantidade_fisica),0) FROM estoques_saldos WHERE empresa_id=:company AND produto_id=:product AND deposito_id=:warehouse")
                    .param("company", company).param("product", productId).param("warehouse", request.warehouseId())
                    .query(BigDecimal.class).single();
            jdbc.sql(
                    "INSERT INTO inventario_itens(inventario_id,produto_id,deposito_id,localizacao_id,lote,unidade_medida_id,saldo_sistema) VALUES (:inventory,:product,:warehouse,:location,:lot,:unit,:balance)")
                    .param("inventory", id).param("product", productId).param("warehouse", request.warehouseId())
                    .param("location", request.locationId()).param("lot", request.lot())
                    .param("unit", product.get("unit_id")).param("balance", balance).update();
        }
        event(id, "EM_CONTAGEM", "Inventário aberto e saldo fotografado.");
        return Map.of("id", id, "number", number, "status", "EM_CONTAGEM");
    }

    @Transactional
    public Map<String, Object> count(Long id, Long itemId, InventoryProcessRequest.Count request) {
        var inventory = jdbc.sql(
                "SELECT dupla_contagem FROM inventarios WHERE id=:id AND empresa_id=:company AND status NOT IN ('CONCLUIDO','CANCELADO')")
                .param("id", id).param("company", currentUser.companyId()).query(Boolean.class).optional()
                .orElseThrow(() -> new BusinessException("Inventário não está disponível para contagem."));
        int number = jdbc.sql(
                "SELECT coalesce(max(numero_contagem),0)+1 FROM inventario_contagens WHERE inventario_item_id=:item AND EXISTS(SELECT 1 FROM inventario_itens WHERE id=:item AND inventario_id=:inventory)")
                .param("item", itemId).param("inventory", id).query(Integer.class).single();
        jdbc.sql(
                "INSERT INTO inventario_contagens(inventario_item_id,numero_contagem,quantidade,usuario_id,observacao) VALUES (:item,:number,:quantity,:user,:notes)")
                .param("item", itemId).param("number", number).param("quantity", request.quantity())
                .param("user", currentUser.userId()).param("notes", request.notes()).update();
        BigDecimal expected = jdbc.sql("SELECT saldo_sistema FROM inventario_itens WHERE id=:item")
                .param("item", itemId).query(BigDecimal.class).single();
        BigDecimal difference = request.quantity().subtract(expected);
        String itemStatus = inventory && number < 2 && difference.signum() != 0 ? "AGUARDANDO_RECONTAGEM"
                : difference.signum() == 0 ? "CORRETO" : "DIVERGENTE";
        jdbc.sql(
                "UPDATE inventario_itens SET quantidade_aprovada=:quantity,divergencia=:difference,status_item=:status WHERE id=:item")
                .param("quantity", request.quantity()).param("difference", difference).param("status", itemStatus)
                .param("item", itemId).update();
        String status = itemStatus.equals("AGUARDANDO_RECONTAGEM") ? "AGUARDANDO_RECONTAGEM" : "EM_ANALISE";
        jdbc.sql("UPDATE inventarios SET status=:status,data_contagem=now(),atualizado_em=now() WHERE id=:id")
                .param("status", status).param("id", id).update();
        event(id, status, "Contagem " + number + " registrada.");
        return get(id);
    }

    @Transactional
    public Map<String, Object> approve(Long id, InventoryProcessRequest.Approve request) {
        var items = jdbc.sql(
                "SELECT ii.id,ii.produto_id,ii.deposito_id,ii.divergencia,p.cost_price FROM inventario_itens ii JOIN produtos p ON p.id=ii.produto_id WHERE ii.inventario_id=:id AND ii.quantidade_aprovada IS NOT NULL")
                .param("id", id).query().listOfRows();
        if (items.isEmpty())
            throw new BusinessException("Nenhum item foi contado.");
        for (var item : items) {
            BigDecimal difference = (BigDecimal) item.get("divergencia");
            if (difference.signum() != 0)
                jdbc.sql(
                        "INSERT INTO stock_movements(empresa_id,product_id,warehouse_id,type,quantity,unit_cost,total_cost,reference_type,reference_id,created_by,notes,created_at,updated_at) VALUES (:company,:product,:warehouse,'ADJUSTMENT',:quantity,:cost,:total,'INVENTORY',:inventory,:user,:notes,now(),now())")
                        .param("company", currentUser.companyId()).param("product", item.get("produto_id"))
                        .param("warehouse", item.get("deposito_id")).param("quantity", difference)
                        .param("cost", item.get("cost_price"))
                        .param("total", difference.abs().multiply((BigDecimal) item.get("cost_price")))
                        .param("inventory", id).param("user", currentUser.userId())
                        .param("notes", request.reason() + " - " + request.notes()).update();
        }
        jdbc.sql(
                "UPDATE inventarios SET status='CONCLUIDO',data_encerramento=now(),atualizado_em=now() WHERE id=:id AND empresa_id=:company")
                .param("id", id).param("company", currentUser.companyId()).update();
        event(id, "CONCLUIDO", "Divergências aprovadas e ajustes registrados.");
        return get(id);
    }

    @Transactional
    public Map<String, Object> cancel(Long id, InventoryProcessRequest.Cancel request) {
        int updated = jdbc.sql(
                "UPDATE inventarios SET status='CANCELADO',bloqueia_movimentacoes=false,data_encerramento=now(),atualizado_em=now(),observacao=concat_ws(E'\\n',observacao,:reason) WHERE id=:id AND empresa_id=:company AND status NOT IN ('CONCLUIDO','CANCELADO')")
                .param("id", id).param("company", currentUser.companyId())
                .param("reason", "Cancelamento: " + request.reason().trim()).update();
        if (updated == 0)
            throw new BusinessException("Somente um inventário em andamento pode ser cancelado.");
        event(id, "CANCELADO", "Inventário cancelado. Motivo: " + request.reason().trim());
        return get(id);
    }

    private Set<Long> resolveScope(InventoryProcessRequest.Create request, long company) {
        if ("CATEGORIA".equals(request.type())) {
            if (request.categoryId() == null)
                throw new BusinessException("Selecione uma categoria.");
            return new LinkedHashSet<>(jdbc
                    .sql("SELECT id FROM produtos WHERE empresa_id=:company AND category_id=:category AND active")
                    .param("company", company).param("category", request.categoryId()).query(Long.class).list());
        }
        if ("GERAL".equals(request.type()) || "LOCALIZACAO".equals(request.type())) {
            if ("LOCALIZACAO".equals(request.type()) && request.locationId() == null)
                throw new BusinessException("Selecione uma localização.");
            return new LinkedHashSet<>(jdbc.sql(
                    "SELECT DISTINCT p.id FROM produtos p LEFT JOIN stock_movements m ON m.product_id=p.id AND m.warehouse_id=:warehouse WHERE p.empresa_id=:company AND p.active AND (p.default_warehouse_id=:warehouse OR m.id IS NOT NULL)")
                    .param("warehouse", request.warehouseId()).param("company", company).query(Long.class).list());
        }
        Set<Long> selected = new LinkedHashSet<>(request.productIds() == null ? List.of() : request.productIds());
        if ("LOTE".equals(request.type()) && (selected.isEmpty() || request.lot() == null || request.lot().isBlank()))
            throw new BusinessException("Selecione o produto e informe o lote.");
        return selected;
    }

    private void event(long id, String status, String description) {
        jdbc.sql(
                "INSERT INTO inventario_eventos(inventario_id,status,usuario_id,descricao) VALUES (:id,:status,:user,:description)")
                .param("id", id).param("status", status).param("user", currentUser.userId())
                .param("description", description).update();
    }
}
