import crypto from "crypto";

// 1. In-memory Rate Limiter
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

// 2. Timing-safe string comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const hashA = crypto.createHash("sha256").update(a).digest();
    const hashB = crypto.createHash("sha256").update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

// 3. Strict URL Validation
const PRIVATE_HOSTS = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.0\.0\.0|\[::1\]|169\.254\.|metadata\.google)/i;

export function isValidHttpUrl(string: string): boolean {
  let url: URL;
  try {
    url = new URL(string);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (PRIVATE_HOSTS.test(url.hostname)) return false;
  return true;
}

export function isSafePublicUrl(value: string): boolean {
  return isValidHttpUrl(value) && value.startsWith("https:");
}

export function isValidDefaultBannerUrl(value: string): boolean {
  if (value === "/banner.png") return true;
  return isValidHttpUrl(value);
}

const DATA_IMAGE_RE = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/i;
const MAX_BANNER_BYTES = 400 * 1024;

export function validateBannerImageUrl(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string" || !value.trim()) {
    return { ok: false, error: "Banner image is required" };
  }
  const raw = value.trim();
  if (raw.startsWith("data:")) {
    const match = raw.match(DATA_IMAGE_RE);
    if (!match) {
      return { ok: false, error: "Banner must be a JPEG, PNG, or WebP image" };
    }
    const b64 = match[2].replace(/\s/g, "");
    const bytes = Math.floor((b64.length * 3) / 4);
    if (bytes > MAX_BANNER_BYTES) {
      return { ok: false, error: "Banner image is too large. Compress to under 400KB." };
    }
    return { ok: true, value: raw };
  }
  if (!isValidHttpUrl(raw)) {
    return { ok: false, error: "Banner image URL is invalid" };
  }
  return { ok: true, value: raw };
}

export function decodeDataUrl(dataUrl: string): { contentType: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  try {
    return {
      contentType: match[1],
      buffer: Buffer.from(match[2], "base64"),
    };
  } catch {
    return null;
  }
}

// 4. Input Sanitization
export function sanitizeString(val: any, maxLength: number = 255): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  // RFC 5322 standard regex
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    email.trim()
  );
}
