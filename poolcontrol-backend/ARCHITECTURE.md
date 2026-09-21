# Arquitetura do PoolControl

## Direção

O PoolControl começa como monólito modular.

```text
Frontend
   |
   v
REST API
   |
   +-- Auth
   +-- Company/User
   +-- Customer
   +-- Catalog
   +-- Inventory
   +-- Sales
   +-- Commission
   +-- Financial
   +-- Pool
   +-- WorkOrder
   +-- Dashboard
   +-- Audit
   |
   v
PostgreSQL
```

## Regra de multiempresa

O token JWT contém:

```text
sub       = userId
companyId = companyId
roles
permissions
```

Toda consulta de negócio deve filtrar por `companyId`.

Não aceite `companyId` enviado pelo frontend para decidir o tenant.

## Regra de estoque

Saldo = soma das movimentações.

Não criar um endpoint do tipo:

```text
PUT /product/{id}/quantity
```

Use sempre movimento de estoque.

## Regra de venda

A venda salva um snapshot financeiro:

```text
valor total
custo histórico dos itens
custos adicionais
comissão
custo total
lucro
margem
```

Alterações posteriores no cadastro do produto não devem mudar uma venda histórica.

## Eventos atuais

Os eventos são síncronos.

```text
SaleCompletedEvent
  -> inventory
  -> commission
  -> financial
  -> audit

WorkOrderCompletedEvent
  -> inventory
  -> audit
```

Quando a escala justificar, estes eventos podem evoluir para outbox + processamento assíncrono.

## Banco

O V1 usa banco compartilhado com `company_id` em cada tabela de negócio.

Evoluções possíveis:

```text
1 banco / schema compartilhado
        ->
schema por empresa
        ->
banco por empresa
```

Não migrar para isolamento mais caro sem necessidade.
