"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendOrigin } from "../backend/client";

const value = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

type LoginResponse = {
  accessToken: string;
  expiresAt: string;
};

export async function login(fd: FormData) {
  const email = value(fd, "login");
  const password = value(fd, "password");

  if (!email || !password) {
    redirect("/login?erro=credenciais");
  }

  let response: Response;

  try {
    response = await fetch(
      `${backendOrigin()}/api/v1/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),

        signal: AbortSignal.timeout(20000),
      }
    );
  } catch {
    redirect("/login?erro=conexao");
  }

  if (!response.ok) {
    redirect("/login?erro=credenciais");
  }

  const data = (await response.json()) as LoginResponse;

  const jar = await cookies();

  jar.set(
    "pool_access_token",
    data.accessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(data.expiresAt),
    }
  );

  jar.delete("pc_user");

  redirect("/inicio");
}