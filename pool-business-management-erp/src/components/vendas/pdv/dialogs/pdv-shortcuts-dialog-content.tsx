import { Keyboard } from "lucide-react";

export function PdvShortcutsDialogContent() {
  return (
    <>
      <h2>
        <Keyboard size={24} /> Atalhos do teclado
      </h2>
      <div className="shortcut-grid">
        {[
          ["F1", "Abrir atalhos", "Exibe este painel"],
          ["F8", "Abrir pagamento", "Vai para a tela de pagamento"],
          ["F2", "Focar no scanner", "Posiciona o cursor no leitor"],
          ["F9", "Confirmar pagamento", "Conclui o pagamento informado"],
          ["F3", "Finalizar venda", "Conclui a venda atual"],
          ["Ctrl + L", "Limpar venda", "Use o botão Limpar na venda"],
          ["F4", "Aplicar desconto", "Abra o botão de desconto"],
          ["ESC", "Fechar janela", "Fecha o modal atual"],
          ["F5", "Pedidos Delivery", "Acesse pelo menu superior"],
          ["Enter", "Confirmar", "Confirma a ação selecionada"],
        ].map(([key, name, desc]) => (
          <div key={key}>
            <kbd>{key}</kbd>
            <span>
              <strong>{name}</strong>
              <small>{desc}</small>
            </span>
          </div>
        ))}
      </div>
      <p className="modal-note">
        Use os atalhos para agilizar o atendimento no caixa.
      </p>
    </>
  );
}
