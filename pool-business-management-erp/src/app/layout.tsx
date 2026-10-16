import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrument = localFont({
  src: [
    {
      path: "./fonts/instrument-serif-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/instrument-serif-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-instrument",
});

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "PoolControl — Gestão que flui",
  description:
    "ERP vertical para empresas de piscinas: vendas com margem real, comissões, estoque, financeiro e ordens de serviço.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${instrument.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
