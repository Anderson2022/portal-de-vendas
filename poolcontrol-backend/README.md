# PoolControl Backend

Backend inicial do **PoolControl**, um ERP SaaS vertical para empresas de piscinas.

## Stack

- Java 21 LTS
- Spring Boot 4.1.1
- Spring Security + JWT (HS256)
- Spring Data JPA
- PostgreSQL
- Flyway
- Spring Modulith 2.1.1
- Lombok
- Docker / Docker Compose
- Redis e MinIO preparados no ambiente local para evolução

## Arquitetura

O projeto usa **monólito modular** e organização `package by feature`.

```text
br.com.poolcontrol
├── auth
├── company
├── user
├── customer
├── catalog
├── supplier
├── salesperson
├── inventory
├── sales
├── commission
├── financial
├── pool
├── workorder
├── dashboard
├── audit
├── config
└── shared
```

A ideia é manter um único deploy no início, sem misturar as regras de cada domínio. No futuro, módulos podem ser extraídos se houver necessidade real.

## Multiempresa

O sistema nasce como SaaS multiempresa.

Entidades de negócio herdam de `TenantEntity` e possuem `company_id`.

O `companyId` é obtido do JWT autenticado. O frontend não decide qual empresa está sendo consultada.

## Perfis criados automaticamente

Na primeira inicialização são criados:

- `ADMIN`
- `GERENTE`
- `VENDEDOR`
- `FINANCEIRO`
- `ESTOQUISTA`
- `TECNICO`

As autorizações usam permissões como:

- `SALE_CREATE`
- `SALE_COMPLETE`
- `STOCK_MOVE`
- `FINANCIAL_VIEW`
- `USER_CREATE`
- `WORK_ORDER_EXECUTE`

## Usuário inicial

Com o bootstrap habilitado:

```text
E-mail: admin@poolcontrol.local
Senha:  Admin@123
```

**Troque esses dados em qualquer ambiente que não seja desenvolvimento.**

## Rodando o banco

```bash
docker compose up -d postgres redis minio
```

PostgreSQL:

```text
Host: localhost
Porta: 5432
Banco: poolcontrol
Usuário: poolcontrol
Senha: poolcontrol
```

## Rodando a API

Requisitos:

- Java 21+
- Maven 3.9+

```bash
mvn spring-boot:run
```

API:

```text
http://localhost:8080
```

Health:

```text
GET http://localhost:8080/actuator/health
```

## Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@poolcontrol.local",
  "password": "Admin@123"
}
```

A resposta contém `accessToken`.

Nas próximas chamadas:

```http
Authorization: Bearer <TOKEN>
```

## Módulos e endpoints

### Autenticação

```text
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Empresa

```text
GET /api/v1/company/me
```

### Usuários e perfis

```text
GET  /api/v1/users
POST /api/v1/users
PUT  /api/v1/users/{id}
PUT  /api/v1/users/{id}/password
GET  /api/v1/roles
```

### Clientes

```text
GET  /api/v1/customers
GET  /api/v1/customers/{id}
POST /api/v1/customers
PUT  /api/v1/customers/{id}
```

### Produtos

```text
GET  /api/v1/products
GET  /api/v1/products/{id}
POST /api/v1/products
PUT  /api/v1/products/{id}

GET  /api/v1/product-categories
POST /api/v1/product-categories
```

### Fornecedores

```text
GET  /api/v1/suppliers
POST /api/v1/suppliers
```

### Vendedores

```text
GET  /api/v1/salespeople
POST /api/v1/salespeople
```

### Estoque

```text
GET  /api/v1/inventory
GET  /api/v1/inventory/{productId}
GET  /api/v1/inventory/{productId}/history
POST /api/v1/inventory/movements
```

O saldo não é simplesmente editado.

Toda alteração vira uma movimentação:

```text
ENTRY
EXIT
RESERVATION
RELEASE
RETURN
ADJUSTMENT
```

Isso preserva rastreabilidade.

### Orçamentos

```text
GET   /api/v1/quotes
GET   /api/v1/quotes/{id}
POST  /api/v1/quotes
PATCH /api/v1/quotes/{id}/status?status=SENT
```

Status:

```text
DRAFT
SENT
NEGOTIATION
APPROVED
REJECTED
EXPIRED
```

### Vendas

```text
GET  /api/v1/sales
GET  /api/v1/sales/{id}
POST /api/v1/sales
POST /api/v1/sales/{id}/complete
```

Cada venda mantém:

```text
subtotal
desconto
valor total
custo dos produtos
custos adicionais
comissão
custo total
lucro
margem
```

Custos adicionais aceitos:

```text
FREIGHT
INSTALLATION
TAX
CARD_FEE
LABOR
MATERIAL
OTHER
```

A comissão é calculada automaticamente usando a taxa padrão do vendedor e entra no custo geral da venda.

## Fluxo de conclusão de venda

```text
Venda
  │
  └─ Concluir
       │
       ├─ baixa produtos do estoque
       ├─ registra comissão do vendedor
       ├─ gera contas a receber
       └─ registra auditoria
```

Os listeners são síncronos no V1. Se uma parte crítica falhar, a transação da conclusão é revertida.

## Financeiro

```text
GET  /api/v1/financial/summary
GET  /api/v1/financial/receivables
GET  /api/v1/financial/payables
POST /api/v1/financial/payables
POST /api/v1/financial/receivables/{id}/pay
POST /api/v1/financial/payables/{id}/pay
```

Venda e caixa são tratados separadamente.

Uma venda parcelada gera títulos individuais em contas a receber.

## Comissões

```text
GET  /api/v1/commissions
POST /api/v1/commissions/{id}/pay
```

## Piscinas

```text
GET  /api/v1/pools
GET  /api/v1/pools?customerId={uuid}
POST /api/v1/pools
```

Exemplos de dados:

- modelo
- comprimento
- largura
- profundidade
- volume em litros
- motor
- filtro
- garantia

## Ordens de serviço

```text
GET  /api/v1/work-orders
GET  /api/v1/work-orders/{id}
POST /api/v1/work-orders
POST /api/v1/work-orders/{id}/start
POST /api/v1/work-orders/{id}/complete
```

Ao concluir uma OS, os materiais utilizados são baixados do estoque.

## Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/salespeople
```

Resumo inclui:

- faturamento
- lucro
- margem média
- quantidade de vendas
- contas a receber
- contas a pagar
- estoque crítico
- estoque baixo
- orçamentos em aberto

## Relatórios

```text
GET /api/v1/reports/profitability
```

Retorna lucratividade por venda e totais de receita, custo, lucro e margem.

## Auditoria

```text
GET /api/v1/audit
```

O starter já registra conclusão de vendas e ordens de serviço.

A evolução recomendada é adicionar auditoria de alterações de preço, descontos, estoque, permissões e financeiro.

## Exemplo de venda

```json
{
  "customerId": "UUID_DO_CLIENTE",
  "salespersonId": "UUID_DO_VENDEDOR",
  "discount": 500.00,
  "items": [
    {
      "productId": "UUID_DA_PISCINA",
      "description": "Piscina Lebron 6m",
      "quantity": 1,
      "unitPrice": 18990.00
    },
    {
      "productId": "UUID_DO_MOTOR",
      "description": "Motor 1/3 CV",
      "quantity": 1,
      "unitPrice": 700.00
    }
  ],
  "costs": [
    {
      "type": "FREIGHT",
      "description": "Frete",
      "amount": 850.00
    },
    {
      "type": "INSTALLATION",
      "description": "Equipe de instalação",
      "amount": 1200.00
    },
    {
      "type": "TAX",
      "description": "Impostos",
      "amount": 950.00
    }
  ],
  "payments": [
    {
      "amount": 19190.00,
      "dueDate": "2026-09-15",
      "paymentMethod": "PIX"
    }
  ]
}
```

O custo de produto é obtido do cadastro no momento da criação da venda. Portanto, a venda preserva o `unitCost` histórico mesmo se o preço de custo do produto mudar depois.

## Configurações de ambiente

Veja `.env.example`.

Principais variáveis:

```text
DB_URL
DB_USER
DB_PASSWORD
JWT_SECRET
BOOTSTRAP_ENABLED
BOOTSTRAP_COMPANY
BOOTSTRAP_EMAIL
BOOTSTRAP_PASSWORD
CORS_ALLOWED_ORIGINS
```

Em produção:

```text
BOOTSTRAP_ENABLED=false
```

e defina uma chave JWT forte.

## O que está pronto no starter

- [x] Estrutura modular
- [x] Multiempresa
- [x] JWT
- [x] Perfis e permissões
- [x] Usuários
- [x] Clientes
- [x] Produtos e categorias
- [x] Fornecedores
- [x] Vendedores
- [x] Estoque por movimentação
- [x] Orçamentos
- [x] Vendas
- [x] Custo geral da venda
- [x] Comissão automática
- [x] Contas a receber
- [x] Contas a pagar
- [x] Piscinas por cliente
- [x] Ordens de serviço
- [x] Consumo de material da OS
- [x] Dashboard inicial
- [x] Auditoria inicial
- [x] Flyway
- [x] Docker Compose

## Próximas evoluções recomendadas

1. refresh token e revogação de sessão;
2. redefinição de senha e confirmação de e-mail;
3. regras avançadas de comissão por margem/categoria;
4. compras e recebimento de fornecedor;
5. múltiplos depósitos;
6. reserva de estoque por pedido;
7. geração de PDF de orçamento/contrato;
8. integração WhatsApp;
9. armazenamento de fotos/contratos no MinIO/S3;
10. NF-e/NFS-e;
11. gateway de pagamento;
12. manutenção recorrente;
13. agenda/rotas dos técnicos;
14. testes de integração com Testcontainers;
15. observabilidade e logs estruturados.

## Observação

Este pacote é um **backend inicial funcional e arquitetural**, não um ERP final de produção.

Antes de comercializar, trate especialmente:

- LGPD;
- backups;
- observabilidade;
- testes;
- idempotência;
- conciliação financeira;
- segurança de segredos;
- recuperação de senha;
- upload seguro;
- regras fiscais.
