package br.com.poolcontrol.inventory.controller;

import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/inventory/structure")
@RequiredArgsConstructor
public class StockStructureController {
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    @GetMapping("/sites")
    public List<Map<String, Object>> sites() {
        return jdbc.sql(
                "SELECT id,codigo code,nome name,cidade,uf,descricao description,ativo active FROM unidades_estoque WHERE empresa_id=:company AND ativo ORDER BY nome")
                .param("company", currentUser.companyId()).query().listOfRows();
    }

    @PostMapping("/sites")
    public Map<String, Object> createSite(@RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "INSERT INTO unidades_estoque(empresa_id,codigo,nome,cidade,uf,descricao,ativo) VALUES(:company,coalesce(nullif(upper(trim(:code)),''),'UNI-'||lpad(nextval('unidades_estoque_id_seq')::text,4,'0')),trim(:name),nullif(trim(:city),''),nullif(upper(trim(:uf)),''),nullif(trim(:description),''),:active) RETURNING id,codigo code,nome name,cidade,uf,descricao description,ativo active")
                .param("company", currentUser.companyId()).param("code", text(b, "code")).param("name", text(b, "name"))
                .param("city", text(b, "city")).param("uf", text(b, "uf")).param("description", text(b, "description"))
                .param("active", bool(b, "active", true)).query().singleRow();
    }

    @PutMapping("/sites/{id}")
    public Map<String, Object> updateSite(@PathVariable Long id, @RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "UPDATE unidades_estoque SET codigo=upper(trim(:code)),nome=trim(:name),cidade=nullif(trim(:city),''),uf=nullif(upper(trim(:uf)),''),descricao=nullif(trim(:description),''),ativo=:active,atualizado_em=now() WHERE id=:id AND empresa_id=:company RETURNING id,codigo code,nome name,cidade,uf,descricao description,ativo active")
                .param("id", id).param("company", currentUser.companyId()).param("code", text(b, "code"))
                .param("name", text(b, "name")).param("city", text(b, "city")).param("uf", text(b, "uf"))
                .param("description", text(b, "description")).param("active", bool(b, "active", true)).query()
                .singleRow();
    }

    @GetMapping("/warehouses")
    public List<Map<String, Object>> warehouses(@RequestParam(required = false) Long siteId) {
        return jdbc.sql(
                "SELECT d.id,d.code,d.name,d.unidade_estoque_id site_id,u.nome site_name FROM depositos d LEFT JOIN unidades_estoque u ON u.id=d.unidade_estoque_id WHERE d.empresa_id=:company AND d.active AND (CAST(:site AS BIGINT) IS NULL OR d.unidade_estoque_id=:site) ORDER BY d.name")
                .param("company", currentUser.companyId()).param("site", siteId).query().listOfRows();
    }

    @PostMapping("/warehouses")
    public Map<String, Object> createWarehouse(@RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "INSERT INTO depositos(empresa_id,unidade_estoque_id,code,name,description,tipo,active,created_at,updated_at) VALUES(:company,:site,coalesce(nullif(upper(trim(:code)),''),'DEP-'||lpad(nextval('depositos_id_seq')::text,4,'0')),:name,:description,:type,true,now(),now()) RETURNING id,code,name")
                .param("company", currentUser.companyId()).param("site", Long.valueOf(String.valueOf(b.get("siteId"))))
                .param("code", b.get("code")).param("name", b.get("name")).param("description", b.get("description"))
                .param("type", b.getOrDefault("type", "ESTOQUE")).query().singleRow();
    }

    @PutMapping("/warehouses/{id}")
    public Map<String, Object> updateWarehouse(@PathVariable Long id, @RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "UPDATE depositos SET unidade_estoque_id=:site,code=upper(:code),name=:name,description=coalesce(nullif(:description,''),description),tipo=coalesce(nullif(:type,''),tipo),updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id,code,name")
                .param("id", id).param("company", currentUser.companyId())
                .param("site", Long.valueOf(String.valueOf(b.get("siteId")))).param("code", b.get("code"))
                .param("name", b.get("name")).param("description", String.valueOf(b.getOrDefault("description", "")))
                .param("type", String.valueOf(b.getOrDefault("type", ""))).query().singleRow();
    }

    @GetMapping("/locations")
    public List<Map<String, Object>> locations(@RequestParam Long warehouseId) {
        return jdbc.sql(
                "WITH RECURSIVE arvore AS (SELECT l.*,l.codigo::text caminho,0 profundidade FROM localizacoes_estoque l WHERE l.localizacao_pai_id IS NULL AND l.deposito_id=:warehouse AND l.empresa_id=:company UNION ALL SELECT f.*,a.caminho||' > '||f.codigo,a.profundidade+1 FROM localizacoes_estoque f JOIN arvore a ON a.id=f.localizacao_pai_id) SELECT id,codigo code,coalesce(nome,descricao,codigo) name,tipo,localizacao_pai_id parent_id,caminho path,profundidade depth,permite_armazenagem storage_allowed,permite_picking picking_allowed,bloqueada blocked,ativo active,capacidade capacity,observacao notes FROM arvore WHERE ativo ORDER BY caminho")
                .param("company", currentUser.companyId()).param("warehouse", warehouseId).query().listOfRows();
    }

    @GetMapping("/balances")
    public List<Map<String, Object>> balances(@RequestParam(required = false) Long siteId,
            @RequestParam(required = false) Long warehouseId, @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) String product) {
        return jdbc.sql(
                "SELECT es.id,p.id product_id,p.name product,p.sku,u.id site_id,u.nome site,d.id warehouse_id,d.name warehouse,l.id location_id,coalesce(l.codigo,'Sem localização') location,es.quantidade_fisica physical,es.quantidade_reservada reserved,es.quantidade_bloqueada blocked,(es.quantidade_fisica-es.quantidade_reservada-es.quantidade_bloqueada) available,es.quantidade_em_transito in_transit FROM estoques_saldos es JOIN produtos p ON p.id=es.produto_id LEFT JOIN depositos d ON d.id=es.deposito_id LEFT JOIN unidades_estoque u ON u.id=d.unidade_estoque_id LEFT JOIN localizacoes_estoque l ON l.id=es.localizacao_id WHERE es.empresa_id=:company AND (CAST(:site AS BIGINT) IS NULL OR u.id=:site) AND (CAST(:warehouse AS BIGINT) IS NULL OR d.id=:warehouse) AND (CAST(:location AS BIGINT) IS NULL OR l.id=:location) AND (CAST(:product AS VARCHAR) IS NULL OR lower(p.name||' '||coalesce(p.sku,'')) LIKE lower('%'||:product||'%')) ORDER BY p.name,u.nome,d.name,l.codigo")
                .param("company", currentUser.companyId()).param("site", siteId).param("warehouse", warehouseId)
                .param("location", locationId)
                .param("product", product == null || product.isBlank() ? null : product.trim()).query().listOfRows();
    }

    @PostMapping("/locations")
    public Map<String, Object> createLocation(@RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "INSERT INTO localizacoes_estoque(empresa_id,deposito_id,localizacao_pai_id,tipo,codigo,nome,descricao,prateleira,coluna,linha,posicao,permite_armazenagem,permite_picking,bloqueada,capacidade,observacao) VALUES(:company,:warehouse,:parent,:type,coalesce(nullif(upper(trim(:code)),''),'LOC-'||lpad(nextval('localizacoes_estoque_id_seq')::text,4,'0')),:name,:name,:shelf,:column,:row,:position,true,true,false,:capacity,:notes) RETURNING id,codigo code,nome name")
                .param("company", currentUser.companyId())
                .param("warehouse", Long.valueOf(String.valueOf(b.get("warehouseId"))))
                .param("parent",
                        b.get("parentId") == null || String.valueOf(b.get("parentId")).isBlank() ? null
                                : Long.valueOf(String.valueOf(b.get("parentId"))))
                .param("type", b.getOrDefault("type", "POSICAO")).param("code", b.get("code"))
                .param("name", b.get("name")).param("shelf", b.get("shelf")).param("column", b.get("column"))
                .param("row", b.get("row")).param("position", b.get("position")).param("capacity", b.get("capacity"))
                .param("notes", b.get("notes")).query().singleRow();
    }

    @PutMapping("/locations/{id}")
    public Map<String, Object> updateLocation(@PathVariable Long id, @RequestBody Map<String, Object> b) {
        return jdbc.sql(
                "UPDATE localizacoes_estoque SET deposito_id=:warehouse,localizacao_pai_id=:parent,tipo=coalesce(nullif(:type,''),tipo),codigo=upper(:code),nome=:name,descricao=:name,prateleira=coalesce(nullif(:shelf,''),prateleira),coluna=coalesce(nullif(:column,''),coluna),linha=coalesce(nullif(:row,''),linha),posicao=coalesce(nullif(:position,''),posicao),observacao=coalesce(nullif(:notes,''),observacao),atualizado_em=now() WHERE id=:id AND empresa_id=:company RETURNING id,codigo code,nome name")
                .param("id", id).param("company", currentUser.companyId())
                .param("warehouse", Long.valueOf(String.valueOf(b.get("warehouseId"))))
                .param("parent",
                        b.get("parentId") == null || String.valueOf(b.get("parentId")).isBlank() ? null
                                : Long.valueOf(String.valueOf(b.get("parentId"))))
                .param("type", String.valueOf(b.getOrDefault("type", ""))).param("code", b.get("code"))
                .param("name", b.get("name")).param("shelf", String.valueOf(b.getOrDefault("shelf", "")))
                .param("column", String.valueOf(b.getOrDefault("column", "")))
                .param("row", String.valueOf(b.getOrDefault("row", "")))
                .param("position", String.valueOf(b.getOrDefault("position", "")))
                .param("notes", String.valueOf(b.getOrDefault("notes", ""))).query().singleRow();
    }

    private String text(Map<String, Object> b, String key) {
        return b.get(key) == null ? "" : String.valueOf(b.get(key));
    }

    private boolean bool(Map<String, Object> b, String key, boolean fallback) {
        return b.get(key) == null ? fallback : Boolean.parseBoolean(String.valueOf(b.get(key)));
    }
}
