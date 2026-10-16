# Proxy Vercel do PoolControl

Este diretório contém somente a configuração do proxy. O frontend Next.js e o
backend continuam executando no servidor de origem.

## Configurar

1. Publique o frontend pelo Cloudflare Tunnel e confirme que a URL HTTPS pública
   abre o sistema. O destino deve ser o frontend, não apenas a API Java.
2. Na raiz do repositório, execute o comando abaixo, substituindo o argumento pela
   URL real do túnel:

   ```bash
   node infra/vercel-proxy/configure.mjs URL_HTTPS_PUBLICA_DO_FRONTEND
   ```

3. Revise e versione o `infra/vercel-proxy/vercel.json` gerado.
4. Na Vercel, importe o repositório e defina **Root Directory** como
   `infra/vercel-proxy`. A configuração gerada seleciona **Other** e desativa
   instalação e build do sistema.
5. Publique e teste login, navegação, arquivos estáticos e operações de estoque
   pelo endereço `.vercel.app`.

Para preservar um endereço `.vercel.app` já utilizado, aplique a configuração no
projeto Vercel que possui esse endereço. Um novo projeto recebe outro endereço,
sujeito à disponibilidade do nome.

A rota `/` exibe a página de carregamento hospedada na Vercel. Ela verifica
`/login` e encaminha o navegador para `/inicio`, mantendo o domínio da Vercel.
Se o servidor não responder, oferece uma nova tentativa. Os demais caminhos,
inclusive `/_next/` e `/api/`, são encaminhados por rewrite para a mesma origem.
Os arquivos `poolcontrol-loading.css` e `poolcontrol-loading.js` são locais. O frontend no servidor deve ter sua conexão com o backend
configurada. Redirecionamentos absolutos e cookies com domínio explícito enviados
pela origem precisam ser compatíveis com o endereço público da Vercel.

Se o hostname do túnel mudar, execute o comando novamente e faça novo deploy.
A publicação depende do acesso à conta Vercel e da URL real do túnel.

Referência: https://vercel.com/docs/rewrites
