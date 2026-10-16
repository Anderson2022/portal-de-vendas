import { writeFileSync } from "node:fs";

const input = process.argv[2];
let origin;

try {
  origin = new URL(input);
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    origin.hostname === "vercel.app" ||
    origin.hostname.endsWith(".vercel.app")
  ) {
    throw new Error("invalid origin");
  }
} catch {
  console.error(
    "Informe a origem HTTPS pública do frontend, sem caminho, credenciais ou parâmetros. O destino não pode ser outro endereço vercel.app.",
  );
  process.exit(1);
}

const config = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  framework: null,
  installCommand: "",
  buildCommand: "",
  outputDirectory: "public",
  rewrites: [
    {
      source: "/",
      destination: "/index.html",
    },
    {
      source: "/:path*",
      destination: `${origin.origin}/:path*`,
    },
  ],
};

writeFileSync(
  new URL("vercel.json", import.meta.url),
  `${JSON.stringify(config, null, 2)}\n`,
);
console.log("vercel.json criado. Revise o destino antes de publicar.");
