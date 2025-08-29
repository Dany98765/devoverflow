"use server";

import { signOut } from "@/auth";
import ROUTES from "@/routes";

export async function logoutAction() {
  await signOut({ redirectTo: ROUTES.AUTH });
}
