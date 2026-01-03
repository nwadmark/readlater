import { cookies } from "next/headers";

const OWNER_KEY_COOKIE = "readlater_owner_key";

/**
 * Reads the ownerKey cookie. Cookie is set by middleware.ts on first request.
 * This function is read-only and never sets cookies (Server Component safe).
 */
export async function getOwnerKey(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(OWNER_KEY_COOKIE);

  if (!existing?.value) {
    throw new Error("ownerKey cookie not found - middleware should have set it");
  }

  return existing.value;
}
