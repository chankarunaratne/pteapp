"use server";

import { cookies } from "next/headers";

/**
 * Simulates user login by setting a session cookie.
 */
export async function login() {
  const cookieStore = await cookies();
  cookieStore.set("pb_session", "mock-token", {
    path: "/",
    httpOnly: false, // Accessible from client-side script for immediate UI updates
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax",
  });
}

/**
 * Simulates user logout by deleting the session cookie.
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("pb_session");
}

/**
 * Checks if the user is authenticated on the server side.
 */
export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has("pb_session");
}
