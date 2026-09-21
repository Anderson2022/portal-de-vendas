alter table quotes add column project varchar(180);
alter table quotes add column converted_sale_id BIGINT references sales(id);
alter table quotes alter column notes type varchar(5000);
alter table quote_items add column unit_cost numeric(14,2) not null default 0;
alter table sales add column project varchar(180);
alter table sales add column notes varchar(5000);
alter table sales add column quote_id BIGINT references quotes(id);
create unique index sales_quote_unique on sales(quote_id) where quote_id is not null;
