# AGENTS.md — Regras do projeto PoolControl

## 1. Regra principal

Este projeto deve permanecer modular, componentizado e organizado por domínio.

Ao criar ou alterar funcionalidades, NÃO concentre grandes quantidades de código em um único arquivo.

Componentize durante a implementação, e não somente depois.

---

## 2. Componentização obrigatória

Sempre que implementar ou alterar uma tela:

1. A página deve apenas montar a tela e carregar os dados necessários.
2. O componente principal deve coordenar a funcionalidade.
3. Partes visualmente ou funcionalmente independentes devem ser componentes separados.
4. Formulários grandes devem ser divididos em seções.
5. Modais grandes devem ser divididos internamente em componentes.
6. Tabelas, filtros, cabeçalhos, totais, ações e formulários devem ficar separados quando tiverem responsabilidade própria.
7. Hooks devem conter lógica reutilizável de estado/comportamento.
8. Services/actions devem conter acesso a dados ou operações.
9. Types/interfaces compartilhados devem ficar em arquivo próprio quando fizer sentido.
10. Evite arquivos gigantes.

Estrutura desejada:

page
  -> componente principal
      -> subcomponentes
          -> componentes UI reutilizáveis

Exemplo:

components/
  estoque/
    entrada/
      stock-entry-button.tsx
      stock-entry-modal.tsx
      stock-entry-form.tsx
      stock-entry-tabs.tsx
      stock-entry-item-form.tsx
      stock-entry-item-table.tsx
      stock-entry-totals.tsx
      stock-entry-actions.tsx
      stock-entry-types.ts
      sections/
      tabs/

---

## 3. Organização por domínio

Organize arquivos pelo módulo funcional do sistema.

Exemplo:

src/
  components/
    estoque/
    clientes/
    financeiro/
    vendas/
    ordens-servico/

  lib/
    estoque/
    clientes/
    financeiro/
    vendas/
    ordens-servico/
    auth/
    backend/

Não crie arquivos centrais gigantes contendo ações de vários módulos.

EVITAR:

lib/actions.ts

PREFERIR:

lib/estoque/create-product.ts
lib/estoque/create-stock-movement.ts

lib/clientes/create-client.ts

lib/financeiro/mark-payable-paid.ts
lib/financeiro/mark-receivable-received.ts

Cada arquivo deve ter uma responsabilidade clara.

---

## 4. Uma responsabilidade por arquivo

Evite colocar diversas operações não relacionadas no mesmo arquivo.

Exemplo correto:

create-product.ts
create-stock-movement.ts
get-warehouses.ts

Exemplo incorreto:

inventory-actions.ts contendo dezenas de funções diferentes.

Arquivos barrel/index.ts só devem existir quando realmente facilitarem imports.
Não criar barrels globais que cresçam indefinidamente.

---

## 5. Não alterar o que não foi solicitado

Ao receber uma tarefa:

- altere somente os arquivos necessários;
- preserve o design existente;
- preserve classes CSS existentes sempre que possível;
- preserve contratos e nomes usados pelo restante do sistema;
- não renomeie pastas sem necessidade;
- não troque bibliotecas sem solicitação;
- não refatore módulos não relacionados;
- não recrie componentes que já existem;
- não invente endpoints do backend;
- não invente dados ou APIs inexistentes.

Antes de criar algo novo, verifique se já existe implementação reutilizável.

---

## 6. Frontend e backend

O projeto está sendo desenvolvido de forma incremental.

Não assumir que um campo visível no frontend já existe no backend.

Se o frontend possuir campos que o backend ainda não aceita:

- mantenha o componente preparado;
- não invente endpoints;
- não invente propriedades na API;
- informe de forma curta que a persistência depende do backend.

Não modificar backend quando a tarefa disser que é somente frontend.

---

## 7. Modais

Funcionalidades que foram definidas como modal devem continuar sendo modal.

Um modal grande pode funcionar como uma janela de ERP e ocupar grande parte da tela.

Não transformar automaticamente modal em página.

Modais complexos devem ser componentizados.

Exemplo:

stock-entry-modal.tsx
stock-entry-form.tsx
stock-entry-tabs.tsx
stock-entry-item-form.tsx
stock-entry-item-table.tsx
stock-entry-totals.tsx

---

# ECONOMIA DE TOKENS E TEMPO

## 8. Não fazer auditorias desnecessárias

NÃO faça automaticamente:

- auditoria completa do projeto;
- inventário de arquivos;
- relatório arquitetural;
- relatório de problemas;
- análise de centenas de arquivos;
- documentação extensa;
- plano de implementação;
- resumo longo;
- lista de melhorias futuras.

Faça isso somente quando eu pedir explicitamente.

Se a tarefa for alterar código, ALTERE O CÓDIGO.

---

## 9. Ler somente o necessário

Antes de modificar:

1. abra o arquivo solicitado;
2. identifique diretamente suas dependências;
3. abra somente os arquivos necessários para realizar a mudança.

Não percorra o repositório inteiro sem necessidade.

Não leia arquivos grandes que não estão relacionados à tarefa.

Use busca por nome/import/referência quando precisar localizar dependências.

---

## 10. Não repetir trabalho

Se uma estrutura já foi analisada anteriormente:

- reutilize o que já foi descoberto;
- não gere novamente inventários;
- não repita explicações;
- não repita a estrutura inteira do projeto.

Continue de onde o trabalho parou.

---

## 11. Execução antes de explicação

Prioridade:

1. entender o pedido;
2. localizar os arquivos envolvidos;
3. editar;
4. validar;
5. responder resumidamente.

Não gastar a maior parte da interação explicando o que pretende fazer.

Não responder apenas com plano quando for possível executar.

---

## 12. Validação eficiente

Depois de alterar código:

Execute somente as verificações relevantes para os arquivos alterados.

Preferir:

- TypeScript/typecheck direcionado;
- lint relevante;
- build quando realmente necessário;
- testes diretamente relacionados.

Não executar uma bateria completa de análises sem necessidade.

Se surgir erro, corrija-o antes de criar relatórios.

---

## 13. Respostas curtas

Depois de concluir uma tarefa, informe somente:

- o que foi alterado;
- quais arquivos principais foram modificados;
- se existe algum bloqueio real.

Não gerar explicações extensas sem solicitação.

Exemplo de resposta adequada:

"Concluído. Separei o modal de entrada em 8 componentes e atualizei os imports. TypeScript validado sem erros."

---

## 14. Não parar por problemas pequenos

Se encontrar:

- import incorreto;
- arquivo em pasta diferente;
- nome facilmente identificável;
- pequena incompatibilidade TypeScript;
- erro de lint simples;

corrija diretamente.

Não interrompa o trabalho para pedir confirmação quando a intenção estiver clara.

Pergunte somente quando existir uma decisão funcional importante que não possa ser inferida.

---

## 15. Preservar comportamento

Componentização NÃO significa reescrever a funcionalidade.

Ao componentizar:

- mantenha comportamento existente;
- mantenha estado;
- mantenha handlers;
- mantenha validações;
- mantenha CSS;
- mantenha integração existente;
- elimine código duplicado somente quando for seguro.

Primeiro preserve o funcionamento.
Depois melhore a organização.

---

## 16. Limite de tamanho

Considere dividir um componente quando:

- possuir várias responsabilidades;
- possuir várias seções independentes;
- possuir formulários grandes;
- possuir lógica reutilizável;
- ficar difícil de compreender ou manter.

Não dividir artificialmente componentes pequenos apenas para aumentar a quantidade de arquivos.

A componentização deve melhorar a manutenção.

---

## 17. Regra final

Quando eu pedir uma implementação, não faça:

"Vou analisar o projeto inteiro antes."

Faça:

"Vou localizar a implementação relacionada, alterar somente o necessário, componentizar durante a alteração e validar o resultado."

O objetivo é produzir código, não relatórios.

---

# 18. REGRA OBRIGATÓRIA PARA BANCO DE DADOS

O banco de dados também deve ser modular.

NÃO criar migrations gigantes contendo dezenas de tabelas diferentes.

Cada tabela nova deve possuir sua própria migration sempre que tecnicamente possível.

EVITAR:

V020__produtos_completo.sql

contendo:

- produto_identificacao
- produto_precos
- produto_fiscal
- produto_logistica
- produto_midia
- produto_especificacoes
- produto_variacoes_preco
- produto_componentes_kit
- triggers
- functions
- seeds
- backfill

PREFERIR:

db/migration/

  V020__create_produto_identificacao.sql
  V021__create_produto_precos.sql
  V022__create_produto_estoque_configuracao.sql
  V023__create_produto_fiscal.sql
  V024__create_produto_tecnico.sql
  V025__create_produto_logistica.sql
  V026__create_produto_midia.sql
  V027__create_tensoes_produto.sql
  V028__create_produto_especificacoes.sql
  V029__create_produto_variacoes_preco.sql
  V030__create_produto_componentes_kit.sql
  V031__seed_tensoes_produto.sql
  V032__create_sincronizar_detalhes_produto_function.sql
  V033__create_sincronizar_detalhes_produto_trigger.sql
  V034__backfill_detalhes_produto.sql

Uma migration deve representar UMA mudança de banco claramente identificável.

Exceção:

Índices e constraints diretamente ligados à criação da própria tabela
podem ficar no mesmo arquivo da tabela.

Exemplo permitido:

CREATE TABLE contas_pagar (...);

CREATE INDEX idx_contas_pagar_empresa
ON contas_pagar (empresa_id);

CREATE INDEX idx_contas_pagar_vencimento
ON contas_pagar (empresa_id, data_vencimento);

Não colocar tabelas não relacionadas no mesmo arquivo.

---

# 19. UM ARQUIVO POR ENTIDADE DE BANCO

Para entidades novas, separar arquivos por entidade.

Exemplo Java:

financeiro/
  contaspagar/
    ContaPagar.java
    ContaPagarRepository.java
    ContaPagarService.java
    ContaPagarController.java
    ContaPagarMapper.java
    dto/
      CriarContaPagarRequest.java
      AtualizarContaPagarRequest.java
      ContaPagarResponse.java

NÃO criar:

FinanceiroEntities.java

contendo:

ContaPagar
ContaReceber
Pagamento
Recebimento
MovimentacaoFinanceira

Cada entidade deve possuir seu próprio arquivo.

O mesmo vale para:

- enums;
- DTOs;
- repositories;
- services;
- controllers;
- mappers;
- validators.

---

# 20. NÃO AGRUPAR CADASTROS DIFERENTES

Um cadastro funcional deve possuir seu próprio módulo/pasta.

Exemplo:

components/
  financeiro/
    contas-pagar/
    contas-receber/
    categorias-financeiras/
    centros-custo/
    plano-contas/
    contas-financeiras/
    formas-pagamento/

NÃO criar:

components/financeiro/financial-registers.tsx

contendo todos os cadastros financeiros.

Cada cadastro deve ser independente.

---

# 21. COMPONENTIZAÇÃO DURANTE A IMPLEMENTAÇÃO

É PROIBIDO criar primeiro um componente gigante com intenção de
"componentizar depois".

A componentização deve acontecer enquanto a funcionalidade está sendo criada.

Antes de adicionar uma nova seção a um arquivo existente, verificar:

1. essa seção possui responsabilidade própria?
2. possui formulário próprio?
3. possui handlers próprios?
4. possui regras próprias?
5. pode ser reutilizada?
6. dificulta a leitura do componente principal?

Se qualquer resposta for SIM, criar componente separado.

---

# 22. PÁGINAS DEVEM SER FINAS

Arquivos de página devem ser pequenos.

Exemplo:

app/financeiro/contas-pagar/page.tsx

deve preferencialmente apenas:

- validar contexto necessário;
- carregar o componente principal;
- definir metadata quando aplicável.

Exemplo:

export default function ContasPagarPage() {
  return <AccountsPayableScreen />;
}

NÃO colocar na page:

- formulário completo;
- tabela completa;
- dezenas de useState;
- chamadas de API espalhadas;
- dialogs grandes;
- regras de negócio;
- centenas de linhas JSX.

---

# 23. ESTRUTURA OBRIGATÓRIA PARA TELAS GRANDES

Para telas complexas, seguir este padrão:

components/
  financeiro/
    contas-pagar/
      accounts-payable-screen.tsx
      accounts-payable-header.tsx
      accounts-payable-filters.tsx
      accounts-payable-table.tsx
      accounts-payable-columns.tsx
      accounts-payable-summary.tsx
      accounts-payable-actions.tsx

      form/
        payable-form.tsx
        payable-main-section.tsx
        payable-classification-section.tsx
        payable-payment-section.tsx
        payable-installments-section.tsx
        payable-recurrence-section.tsx
        payable-attachments-section.tsx
        payable-notes-section.tsx
        payable-form-actions.tsx

      dialogs/
        create-payable-dialog.tsx
        edit-payable-dialog.tsx
        pay-payable-dialog.tsx
        cancel-payable-dialog.tsx
        reverse-payment-dialog.tsx

      hooks/
        use-accounts-payable.ts
        use-payable-form.ts
        use-payable-filters.ts

      services/
        create-payable.ts
        update-payable.ts
        get-payables.ts
        get-payable.ts
        cancel-payable.ts
        pay-payable.ts

      schemas/
        payable-form-schema.ts

      types/
        payable.ts
        payable-filters.ts

Não é obrigatório criar arquivos vazios.

Criar somente os arquivos necessários para a funcionalidade implementada.

---

# 24. MODAIS GRANDES NÃO PODEM SER MONOLÍTICOS

Um modal complexo deve possuir um componente de estrutura e componentes internos.

Exemplo correto:

create-payable-dialog.tsx

  -> payable-form.tsx

      -> payable-main-section.tsx
      -> payable-classification-section.tsx
      -> payable-payment-section.tsx
      -> payable-installments-section.tsx
      -> payable-attachments-section.tsx

O arquivo do modal NÃO deve conter todo o formulário diretamente.

O modal é responsável principalmente por:

- abrir/fechar;
- título;
- descrição;
- container;
- ações gerais.

As seções do formulário devem ficar separadas.

---

# 25. LIMITES DE TAMANHO

Não existe limite absoluto quando houver justificativa técnica,
mas use estes valores como sinal obrigatório de revisão:

TSX:

- até 150 linhas: normal;
- 150 a 250 linhas: verificar possibilidade de divisão;
- acima de 250 linhas: deve justificar ou componentizar;
- acima de 400 linhas: NÃO permitido sem necessidade excepcional.

Hooks:

- preferencialmente até 150 linhas.

Services/actions:

- preferencialmente até 150 linhas.

DTOs/types:

- separar quando começarem a representar domínios diferentes.

SQL:

- uma tabela por migration;
- funções/triggers complexos em migrations próprias.

Não dividir artificialmente código coeso apenas para atingir números.

O objetivo é responsabilidade clara.

---

# 26. INDENTAÇÃO E FORMATAÇÃO SÃO OBRIGATÓRIAS

Todo código criado ou alterado deve sair formatado.

Não entregar código sem indentação.

Não entregar JSX comprimido.

Não entregar SQL em linhas gigantes.

Não entregar objetos TypeScript difíceis de ler.

Frontend:

usar a configuração Prettier existente no projeto.

Depois de alterar arquivos frontend, executar quando disponível:

npm run format

ou:

npx prettier --write <arquivos-alterados>

Depois executar lint/typecheck relevante.

Java:

usar o formatter já configurado no projeto.

Não introduzir um formatter novo sem necessidade.

SQL:

usar indentação consistente.

Exemplo correto:

CREATE TABLE contas_pagar (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    fornecedor_id BIGINT REFERENCES fornecedores(id),
    descricao VARCHAR(255) NOT NULL,
    valor_original NUMERIC(18, 2) NOT NULL,
    data_vencimento DATE NOT NULL
);

CREATE INDEX idx_contas_pagar_empresa_vencimento
    ON contas_pagar (
        empresa_id,
        data_vencimento
    );

Evitar:

CREATE TABLE contas_pagar (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL, fornecedor_id BIGINT, descricao VARCHAR(255), valor NUMERIC(18,2));


## 27. Formatação obrigatória

Todo código alterado deve ser entregue formatado e indentado.

Antes de finalizar:

- executar o formatter existente;
- corrigir imports;
- corrigir lint simples;
- validar TypeScript quando aplicável.

Não entregar código comprimido ou sem indentação.

---

## 28. Não criar arquivos gigantes

Não juntar várias responsabilidades em um único arquivo.

Evitar:

actions.ts
services.ts
types.ts
database.sql

quando esses arquivos começarem a concentrar funcionalidades diferentes.

Preferir arquivos separados por responsabilidade.

Exemplo:

create-payable.ts
update-payable.ts
cancel-payable.ts
pay-payable.ts

---

## 29. Banco de dados

Para novas migrations:

- uma tabela por arquivo sempre que possível;
- índices da própria tabela podem ficar junto;
- functions ficam em arquivos próprios;
- triggers ficam em arquivos próprios;
- seeds ficam em arquivos próprios;
- backfills ficam em arquivos próprios.

Não criar uma migration gigante com várias tabelas diferentes.

Nunca editar migration já aplicada em produção.
Criar uma nova migration para correções.

---

## 30. Regra final

Uma tarefa só está concluída quando o código estiver:

- funcionando;
- organizado;
- componentizado;
- indentado;
- formatado;
- separado por domínio.

Não concentrar código para economizar arquivos.