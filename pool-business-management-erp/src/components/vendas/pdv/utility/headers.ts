export const headers: Record<string, string[]> = {
  pedidos: ["Pedido", "Cliente", "Situação", "Total", "Pagamento"],
  produtos: ["Produto", "Código", "Categoria", "Preço", "Estoque"],
  clientes: ["Nome", "Telefone", "E-mail", "Histórico", "Status"],
  usuarios: ["Usuário", "E-mail", "Papel", "Status", "Permissões"],
  financeiro: ["Lançamento", "Descrição", "Status", "Valor", "Forma"],
  promocoes: ["Cupom", "Benefício", "Status", "Validade", "Regra"],
};
