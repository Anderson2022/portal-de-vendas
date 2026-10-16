const title = document.getElementById("status-title");
const description = document.getElementById("status-description");
const retry = document.getElementById("retry");

async function connect() {
  document.body.dataset.state = "loading";
  retry.hidden = true;
  title.textContent = "Carregando seu sistema";
  description.textContent =
    "Estamos preparando seu acesso. Aguarde um instante.";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch("/login", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Sistema indisponível");
    window.location.replace("/inicio");
  } catch {
    document.body.dataset.state = "error";
    title.textContent = "Não foi possível conectar";
    description.textContent =
      "O sistema não respondeu agora. Aguarde um momento e tente novamente.";
    retry.hidden = false;
  } finally {
    clearTimeout(timeout);
  }
}

retry.addEventListener("click", connect);
connect();
