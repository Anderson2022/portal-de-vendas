"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const jar = await cookies();

  jar.delete("pool_access_token");
  jar.delete("pc_user");

  redirect("/login");
}