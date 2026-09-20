function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32 && !secret.includes("change_in_prod") && !secret.includes("generate_a_random")) {
    return secret;
  }
  if (isProduction()) {
    throw new Error("SESSION_SECRET must be a 32+ character random string in production.");
  }
  return "dev-only-session-secret-do-not-use-in-production";
}

export function getAdminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv && fromEnv !== "admin123" && !fromEnv.includes("ChooseAStrong")) {
    return fromEnv;
  }
  return null;
}

export function assertAdminPasswordConfigured(): string {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }
  return password;
}
