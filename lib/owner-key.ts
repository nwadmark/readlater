import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const OWNER_KEY_COOKIE = "readlater_owner_key";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10; // 10 years

/**
 * Gets or creates an ownerKey for the current browser.
 * This provides soft isolation without requiring login.
 */
export async function getOwnerKey(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(OWNER_KEY_COOKIE);

  if (existing?.value) {
    return existing.value;
  }

  // Generate new UUID for this browser
  const newOwnerKey = randomUUID();

  // Set cookie with long expiration
  cookieStore.set(OWNER_KEY_COOKIE, newOwnerKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return newOwnerKey;
}
