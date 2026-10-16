import { Users, ShoppingCart, Bike, BarChart3, Settings } from "lucide-react";
export const toolGroups = [
  {
    title: "Cadastros",
    icon: Users,
    tone: "blue",
    items: [
      ["Clientes", "Cadastrar e consultar", "clientes"],
      ["Produtos", "Cadastro e preços", "produtos"],
      ["Categorias", "Organizar produtos", "produtos"],
      ["Tabela de preços", "Gerenciar valores", "produtos"],
      ["Usuários", "Permissões e acessos", "usuarios"],
    ],
  },
  {
    title: "Vendas e Operação",
    icon: ShoppingCart,
    tone: "green",
    items: [
      ["Lançamento (PDV)", "Vendas no balcão", "lancamento"],
      ["Mesas", "Controle de mesas", "mesas"],
      ["Delivery", "Pedidos e entregas", "delivery"],
      ["Serviços", "Agendamentos", "servicos"],
      ["Supermercado", "Leitura de código de barras", "supermercado"],
    ],
  },
  {
    title: "Pedidos e Entregas",
    icon: Bike,
    tone: "purple",
    items: [
      ["Pedidos", "Acompanhar e gerenciar", "pedidos"],
      ["Mapa de entregas", "Localização em tempo real", "entregas"],
      ["Motoboys", "Gestão de entregadores", "entregas"],
      ["Rotas", "Otimização de rotas", "entregas"],
      ["Configuração de taxas", "Bairros e valores", "configuracoes"],
    ],
  },
  {
    title: "Relatórios e Dashboards",
    icon: BarChart3,
    tone: "amber",
    items: [
      ["Vendas", "Por período e formas de pgto", "relatorios"],
      ["Produtos", "Mais e menos vendidos", "relatorios"],
      ["Clientes", "Histórico de compras", "relatorios"],
      ["Desempenho dos motoboys", "Entregas e avaliações", "relatorios"],
      ["Dashboard geral", "Indicadores em tempo real", "relatorios"],
    ],
  },
  {
    title: "Financeiro e Configurações",
    icon: Settings,
    tone: "cyan",
    items: [
      ["Contas a receber", "Vendas e cartões", "financeiro"],
      ["Contas a pagar", "Despesas e fornecedores", "financeiro"],
      ["Formas de pagamento", "PIX, cartão, dinheiro, vale", "configuracoes"],
      ["Impressoras", "NFC-e, cupom e comandas", "configuracoes"],
      ["Configurações gerais", "Ajustes do sistema", "configuracoes"],
    ],
  },
] as const;
