import { cookies } from "next/headers";

const OWNER_KEY_COOKIE = "readlater_owner_key";

/**
 * Reads the ownerKey cookie. Cookie is set by middleware.ts on first request.
 * This function is read-only and never sets cookies (Server Component safe).
 *
 * Note: On the very first request, middleware may not have run yet, so we return
 * a fallback UUID. Middleware will set the persistent cookie on the next request.
 */
export async function getOwnerKey(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(OWNER_KEY_COOKIE);

  if (!existing?.value) {
    // Generate fallback ownerKey for this request
    // Middleware will set the persistent cookie on the next request
    return crypto.randomUUID();
  }

  return existing.value;
}
