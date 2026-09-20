import { createHash } from "crypto";

function isPlaceholderSecret(secret: string) {
  return (
    secret.includes("change_in_prod") ||
    secret.includes("generate_a_random") ||
    secret.includes("your_")
  );
}

function derivedSessionSecret() {
  const material = [process.env.DATABASE_URL, process.env.ADMIN_PASSWORD, process.env.APP_URL]
    .filter(Boolean)
    .join("|");
  return createHash("sha256")
    .update(`twitterbanner.lol-session:${material || "twitterbanner"}`)
    .digest("hex");
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32 && !isPlaceholderSecret(secret)) {
    return secret;
  }
  return derivedSessionSecret();
}

export function getAdminPasswordFromEnv(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  return fromEnv || null;
}
