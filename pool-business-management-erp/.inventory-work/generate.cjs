const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'files');
const java='src/main/java/br/com/poolcontrol/';
function put(p,s){p=path.join(root,p);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}
function cls(p,s){put(java+p+'.java',s);}
const original=path.resolve(__dirname,'../../poolcontrol-backend');
function modify(p,fn){put(p,fn(fs.readFileSync(path.join(original,p),'utf8')));}
let sql=`
CREATE TABLE warehouses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id),
 name varchar(140) NOT NULL, code varchar(40) NOT NULL, type varchar(20) NOT NULL CHECK(type IN ('MATRIX','STORE','DEPOT','VEHICLE','TECHNICIAN','SITE')),
 active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(company_id,code), UNIQUE(company_id,id)
);
INSERT INTO warehouses(company_id,name,code,type) SELECT id,'Depósito principal','MATRIZ','MATRIX' FROM companies;
CREATE TABLE product_brands(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL REFERENCES companies(id),name varchar(100) NOT NULL,active boolean NOT NULL DEFAULT true,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(company_id,name),UNIQUE(company_id,id));
ALTER TABLE products ADD CONSTRAINT uq_products_tenant UNIQUE(company_id,id);
ALTER TABLE suppliers ADD CONSTRAINT uq_suppliers_tenant UNIQUE(company_id,id);
ALTER TABLE product_categories ADD CONSTRAINT uq_categories_tenant UNIQUE(company_id,id);
ALTER TABLE products
 ADD COLUMN internal_code varchar(60), ADD COLUMN manufacturer_reference varchar(100), ADD COLUMN brand_id uuid,
 ADD COLUMN average_cost numeric(18,6) NOT NULL DEFAULT 0, ADD COLUMN last_cost numeric(18,6) NOT NULL DEFAULT 0,
 ADD COLUMN replacement_cost numeric(18,6) NOT NULL DEFAULT 0, ADD COLUMN minimum_price numeric(14,2) NOT NULL DEFAULT 0,
 ADD COLUMN minimum_margin numeric(8,4) NOT NULL DEFAULT 0, ADD COLUMN promotional_price numeric(14,2),
 ADD COLUMN maximum_stock numeric(14,3) NOT NULL DEFAULT 0, ADD COLUMN reorder_point numeric(14,3) NOT NULL DEFAULT 0,
 ADD COLUMN default_warehouse_id uuid, ADD COLUMN batch_tracked boolean NOT NULL DEFAULT false, ADD COLUMN serial_tracked boolean NOT NULL DEFAULT false,
 ADD FOREIGN KEY(company_id,brand_id) REFERENCES product_brands(company_id,id),
 ADD FOREIGN KEY(company_id,default_warehouse_id) REFERENCES warehouses(company_id,id),
 ADD FOREIGN KEY(company_id,category_id) REFERENCES product_categories(company_id,id),
 ADD CHECK(average_cost>=0 AND last_cost>=0 AND replacement_cost>=0 AND minimum_price>=0 AND minimum_margin>=0 AND minimum_margin<=100 AND maximum_stock>=0 AND reorder_point>=0 AND (promotional_price IS NULL OR promotional_price>=0));
UPDATE products p SET average_cost=cost_price,last_cost=cost_price,replacement_cost=cost_price,default_warehouse_id=w.id FROM warehouses w WHERE w.company_id=p.company_id AND w.code='MATRIZ';
CREATE UNIQUE INDEX uq_product_internal_code ON products(company_id,internal_code) WHERE internal_code IS NOT NULL;
CREATE INDEX ix_product_stock_filter ON products(company_id,category_id,active);
ALTER TABLE stock_movements ALTER COLUMN type TYPE varchar(32), ALTER COLUMN unit_cost TYPE numeric(18,6), ALTER COLUMN total_cost TYPE numeric(20,6);
ALTER TABLE stock_movements ADD COLUMN physical_delta numeric(14,3) NOT NULL DEFAULT 0, ADD COLUMN reserved_delta numeric(14,3) NOT NULL DEFAULT 0, ADD COLUMN balance_after numeric(14,3) NOT NULL DEFAULT 0, ADD COLUMN reserved_after numeric(14,3) NOT NULL DEFAULT 0, ADD COLUMN sequence_no bigserial, ADD COLUMN batch_id uuid, ADD COLUMN serial_id uuid;
UPDATE stock_movements m SET warehouse_id=w.id FROM warehouses w WHERE w.company_id=m.company_id AND w.code='MATRIZ' AND m.warehouse_id IS NULL;
-- Preserve legacy warehouse identifiers where they already exist in movements.
INSERT INTO warehouses(id,company_id,name,code,type) SELECT DISTINCT warehouse_id,company_id,'Depósito migrado',warehouse_id::text,'DEPOT' FROM stock_movements m WHERE NOT EXISTS(SELECT 1 FROM warehouses w WHERE w.id=m.warehouse_id);
UPDATE stock_movements SET physical_delta=CASE WHEN type IN ('RESERVATION','RELEASE') THEN 0 ELSE quantity END,reserved_delta=CASE WHEN type IN ('RESERVATION','RELEASE') THEN quantity ELSE 0 END;
UPDATE stock_movements SET type=CASE type WHEN 'ENTRY' THEN 'ENTRY_PURCHASE' WHEN 'RETURN' THEN 'ENTRY_RETURN' WHEN 'EXIT' THEN CASE WHEN reference_type='WORK_ORDER' THEN 'EXIT_WORK_ORDER' ELSE 'EXIT_SALE' END WHEN 'RELEASE' THEN 'RESERVATION_RELEASE' WHEN 'ADJUSTMENT' THEN CASE WHEN quantity<0 THEN 'EXIT_ADJUSTMENT' ELSE 'ENTRY_ADJUSTMENT' END ELSE type END,quantity=abs(quantity);
WITH totals AS (SELECT id,sum(physical_delta) OVER(PARTITION BY company_id,product_id,warehouse_id ORDER BY created_at,sequence_no) p,sum(reserved_delta) OVER(PARTITION BY company_id,product_id,warehouse_id ORDER BY created_at,sequence_no) r FROM stock_movements)
UPDATE stock_movements m SET balance_after=t.p,reserved_after=t.r FROM totals t WHERE t.id=m.id;
ALTER TABLE stock_movements ALTER COLUMN warehouse_id SET NOT NULL, ADD FOREIGN KEY(company_id,warehouse_id) REFERENCES warehouses(company_id,id), ADD FOREIGN KEY(company_id,product_id) REFERENCES products(company_id,id), ADD CONSTRAINT uq_movement_tenant UNIQUE(company_id,id), ADD CHECK(quantity>0);
CREATE TABLE stock_balances(company_id uuid NOT NULL,product_id uuid NOT NULL,warehouse_id uuid NOT NULL,physical_quantity numeric(14,3) NOT NULL DEFAULT 0,reserved_quantity numeric(14,3) NOT NULL DEFAULT 0,available_quantity numeric(14,3) GENERATED ALWAYS AS(physical_quantity-reserved_quantity) STORED,updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(company_id,product_id,warehouse_id),FOREIGN KEY(company_id,product_id) REFERENCES products(company_id,id),FOREIGN KEY(company_id,warehouse_id) REFERENCES warehouses(company_id,id),CHECK(physical_quantity>=0 AND reserved_quantity>=0 AND physical_quantity>=reserved_quantity));
INSERT INTO stock_balances(company_id,product_id,warehouse_id,physical_quantity,reserved_quantity) SELECT company_id,product_id,warehouse_id,sum(physical_delta),sum(reserved_delta) FROM stock_movements GROUP BY company_id,product_id,warehouse_id;
CREATE TABLE stock_cost_history(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL,product_id uuid NOT NULL,old_average_cost numeric(18,6) NOT NULL,new_average_cost numeric(18,6) NOT NULL,last_cost numeric(18,6) NOT NULL,movement_id uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),FOREIGN KEY(company_id,product_id) REFERENCES products(company_id,id),FOREIGN KEY(company_id,movement_id) REFERENCES stock_movements(company_id,id));
`;
const common=`id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL REFERENCES companies(id),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),`;
const prod=`FOREIGN KEY(company_id,product_id) REFERENCES products(company_id,id)`;
const wh=`FOREIGN KEY(company_id,warehouse_id) REFERENCES warehouses(company_id,id)`;
function table(name,body){sql+=`CREATE TABLE ${name}(${common}${body},UNIQUE(company_id,id));\n`;}
table('product_batches',`product_id uuid NOT NULL,warehouse_id uuid NOT NULL,batch_number varchar(100) NOT NULL,manufacturing_date date,expiration_date date,quantity numeric(14,3) NOT NULL DEFAULT 0 CHECK(quantity>=0),${prod},${wh},UNIQUE(company_id,product_id,warehouse_id,batch_number),CHECK(manufacturing_date IS NULL OR expiration_date IS NULL OR expiration_date>=manufacturing_date)`);
table('product_serial_numbers',`product_id uuid NOT NULL,warehouse_id uuid NOT NULL,serial_number varchar(140) NOT NULL,status varchar(20) NOT NULL CHECK(status IN ('AVAILABLE','RESERVED','SOLD','INSTALLED','RETURNED','DEFECTIVE')),reference_type varchar(40),reference_id uuid,customer_id uuid,work_order_id uuid,warranty_until date,${prod},${wh},UNIQUE(company_id,serial_number)`);
sql+=`ALTER TABLE stock_movements ADD FOREIGN KEY(company_id,batch_id) REFERENCES product_batches(company_id,id),ADD FOREIGN KEY(company_id,serial_id) REFERENCES product_serial_numbers(company_id,id);\n`;
table('stock_reservations',`product_id uuid NOT NULL,warehouse_id uuid NOT NULL,quantity numeric(14,3) NOT NULL CHECK(quantity>0),reference_type varchar(40) NOT NULL,reference_id uuid NOT NULL,status varchar(20) NOT NULL CHECK(status IN ('ACTIVE','CONSUMED','RELEASED','CANCELLED')),released_at timestamptz,batch_id uuid,serial_id uuid,${prod},${wh},FOREIGN KEY(company_id,batch_id) REFERENCES product_batches(company_id,id),FOREIGN KEY(company_id,serial_id) REFERENCES product_serial_numbers(company_id,id)`);
sql+=`INSERT INTO stock_reservations(company_id,product_id,warehouse_id,quantity,reference_type,reference_id,status) SELECT company_id,product_id,warehouse_id,reserved_quantity,'MIGRATION',gen_random_uuid(),'ACTIVE' FROM stock_balances WHERE reserved_quantity>0;\n`;
table('stock_transfers',`origin_warehouse_id uuid NOT NULL,destination_warehouse_id uuid NOT NULL,status varchar(20) NOT NULL CHECK(status IN ('CREATED','SEPARATING','IN_TRANSIT','RECEIVED','CANCELLED')),notes varchar(1000),created_by uuid NOT NULL REFERENCES users(id),shipped_at timestamptz,received_at timestamptz,CHECK(origin_warehouse_id<>destination_warehouse_id),FOREIGN KEY(company_id,origin_warehouse_id) REFERENCES warehouses(company_id,id),FOREIGN KEY(company_id,destination_warehouse_id) REFERENCES warehouses(company_id,id)`);
table('stock_transfer_items',`transfer_id uuid NOT NULL,product_id uuid NOT NULL,quantity numeric(14,3) NOT NULL CHECK(quantity>0),unit_cost numeric(18,6) NOT NULL DEFAULT 0,batch_id uuid,serial_id uuid,FOREIGN KEY(company_id,transfer_id) REFERENCES stock_transfers(company_id,id),${prod},FOREIGN KEY(company_id,batch_id) REFERENCES product_batches(company_id,id),FOREIGN KEY(company_id,serial_id) REFERENCES product_serial_numbers(company_id,id)`);
table('inventory_counts',`warehouse_id uuid NOT NULL,status varchar(24) NOT NULL CHECK(status IN ('OPEN','COUNTING','WAITING_APPROVAL','APPROVED','CANCELLED')),blind_count boolean NOT NULL,created_by uuid NOT NULL REFERENCES users(id),approved_by uuid REFERENCES users(id),approved_at timestamptz,${wh}`);
sql+=`CREATE UNIQUE INDEX uq_active_count ON inventory_counts(company_id,warehouse_id) WHERE status IN ('OPEN','COUNTING','WAITING_APPROVAL');\n`;
table('inventory_count_items',`count_id uuid NOT NULL,product_id uuid NOT NULL,system_quantity numeric(14,3) NOT NULL,counted_quantity numeric(14,3) CHECK(counted_quantity>=0),difference_quantity numeric(14,3) GENERATED ALWAYS AS(counted_quantity-system_quantity) STORED,notes varchar(500),FOREIGN KEY(company_id,count_id) REFERENCES inventory_counts(company_id,id),${prod},UNIQUE(company_id,count_id,product_id)`);
table('product_kits',`product_id uuid NOT NULL,${prod},UNIQUE(company_id,product_id)`);
table('product_kit_items',`kit_id uuid NOT NULL,product_id uuid NOT NULL,quantity numeric(14,3) NOT NULL CHECK(quantity>0),FOREIGN KEY(company_id,kit_id) REFERENCES product_kits(company_id,id),${prod},UNIQUE(company_id,kit_id,product_id)`);
table('purchases',`supplier_id uuid NOT NULL,document_number varchar(100),warehouse_id uuid NOT NULL,purchase_date date NOT NULL,status varchar(24) NOT NULL CHECK(status IN ('DRAFT','ORDERED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED')),discount numeric(14,2) NOT NULL DEFAULT 0 CHECK(discount>=0),freight numeric(14,2) NOT NULL DEFAULT 0 CHECK(freight>=0),additional_expenses numeric(14,2) NOT NULL DEFAULT 0 CHECK(additional_expenses>=0),total numeric(14,2) NOT NULL CHECK(total>=0),FOREIGN KEY(company_id,supplier_id) REFERENCES suppliers(company_id,id),${wh}`);
table('purchase_items',`purchase_id uuid NOT NULL,product_id uuid NOT NULL,quantity numeric(14,3) NOT NULL CHECK(quantity>0),received_quantity numeric(14,3) NOT NULL DEFAULT 0,unit_cost numeric(18,6) NOT NULL CHECK(unit_cost>=0),effective_unit_cost numeric(18,6) NOT NULL CHECK(effective_unit_cost>=0),allocated_total numeric(20,6) NOT NULL,FOREIGN KEY(company_id,purchase_id) REFERENCES purchases(company_id,id),${prod},CHECK(received_quantity>=0 AND received_quantity<=quantity)`);
for(const [t,fields] of Object.entries({stock_movements:['company_id,product_id,warehouse_id,created_at,sequence_no','company_id,type,created_at','company_id,reference_id'],stock_balances:['company_id,warehouse_id'],stock_reservations:['company_id,reference_id,status'],stock_transfers:['company_id,status,created_at'],inventory_counts:['company_id,status'],product_batches:['company_id,batch_number','company_id,expiration_date'],product_serial_numbers:['company_id,reference_id','company_id,warehouse_id,status'],stock_cost_history:['company_id,product_id,created_at'],purchases:['company_id,supplier_id,status'],purchase_items:['company_id,purchase_id'],stock_transfer_items:['company_id,transfer_id'],product_kit_items:['company_id,kit_id']}))fields.forEach((f,i)=>sql+=`CREATE INDEX ix_${t}_${i} ON ${t}(${f});\n`);
sql+=`CREATE FUNCTION prevent_stock_history_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Histórico de estoque é imutável; gere movimentação inversa ou ajuste'; END $$;
CREATE TRIGGER immutable_stock_movements BEFORE UPDATE OR DELETE ON stock_movements FOR EACH ROW EXECUTE FUNCTION prevent_stock_history_mutation();
CREATE TRIGGER immutable_stock_cost_history BEFORE UPDATE OR DELETE ON stock_cost_history FOR EACH ROW EXECUTE FUNCTION prevent_stock_history_mutation();
INSERT INTO role_permissions(role_id,permission) SELECT r.id,p FROM roles r CROSS JOIN unnest(ARRAY['STOCK_ENTRY','STOCK_EXIT','STOCK_TRANSFER','STOCK_RESERVE','STOCK_INVENTORY','STOCK_APPROVE_INVENTORY','STOCK_ADJUST','STOCK_VIEW_COST','STOCK_CHANGE_COST','STOCK_REPORTS']) p WHERE r.name IN ('ADMIN','GERENTE') ON CONFLICT DO NOTHING;
INSERT INTO role_permissions(role_id,permission) SELECT r.id,p FROM roles r CROSS JOIN unnest(ARRAY['STOCK_ENTRY','STOCK_EXIT','STOCK_TRANSFER','STOCK_RESERVE','STOCK_INVENTORY','STOCK_VIEW_COST','STOCK_REPORTS']) p WHERE r.name='ESTOQUISTA' ON CONFLICT DO NOTHING;
`;
put('src/main/resources/db/migration/V3__advanced_inventory.sql',sql);
