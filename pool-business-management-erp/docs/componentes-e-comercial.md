# Componentes e integração PoolControl

## Organização

- `src/components/ui/`: botão, cartão, campos, modal, títulos e indicadores em arquivos separados.
- `src/components/commercial/`: formulário, cliente, itens, pagamento, resumo, filtros, cartões e conversão separados.
- `src/components/dialogs/`, `charts/`, `header/` e `pools/`: componentes específicos por responsabilidade.
- `src/lib/commercial/domain.ts`: tipos, cálculo em centavos e validação dos formulários.
- `src/lib/backend/client.ts`: sessão JWT e chamadas autenticadas ao backend.
- `src/lib/backend/data.ts`: adaptação das respostas da API para as telas.
- `src/lib/backend/commercial.ts`: criação, edição e conversão comercial pela API.
- `src/lib/commercial/actions.ts`: ações de servidor e atualização das páginas.

## Fluxo comercial

Nova venda → novo orçamento → salvar → conferir proposta → Gerar venda → pagamento → pedido.

Também existe venda direta em `/vendas/pedidos/novo`. Propostas convertidas não podem ser editadas nem convertidas novamente. Produtos de catálogo usam o custo cadastrado no backend; itens personalizados permitem informar custo interno.

O backend realiza a conversão em uma transação: cria a venda e seus itens, movimenta estoque dos produtos e gera o recebível. A opção de pagamento recebido baixa o título. O bloqueio do orçamento e o vínculo único com a venda impedem conversão duplicada. O formulário trabalha com pagamento único, sem parcelamento.

## Ambiente local

- Frontend: http://127.0.0.1:3000
- API: http://127.0.0.1:8081
- PostgreSQL: `127.0.0.1:5433`, banco `PoolControl`, usuário `pool_local`.
- Login inicial do backend: `admin@poolcontrol.local` / `Admin@123`.
- `.env`: `BACKEND_URL=http://127.0.0.1:8081`.

O projeto Java fica em `../poolcontrol-backend`. As migrações Flyway V1 e V2 são aplicadas pelo backend. O frontend não acessa diretamente o banco em tempo de execução; os arquivos antigos de demonstração em `src/db` e `migrations` não são usados pelo fluxo atual.

Para reiniciar, com PostgreSQL ativo:

1. Compile o backend com `mvn.cmd -B -ntp -f ../poolcontrol-backend/pom.xml -DskipTests package`.
2. Execute `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/start-backend.ps1` (não inicie outra instância se a porta 8081 já estiver em uso).
3. Execute `npm.cmd run dev`.

O iniciador guarda o segredo JWT local em `.local/backend-secret.txt`, fora do versionamento. A porta 8081 evita conflito com o serviço já existente na porta 8080.

## Verificações

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run test:commercial`
- `npm.cmd run test:commercial:browser`

O teste de navegador requer Microsoft Edge e os servidores locais ativos. Cria registros próprios no PoolControl local, verifica login, orçamento, edição, conversão, estoque, recebível, bloqueio de conversão duplicada, páginas e layout mobile. Remove os registros de teste ao terminar. Capturas ficam em `artifacts/`.
