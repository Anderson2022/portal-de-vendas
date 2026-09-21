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