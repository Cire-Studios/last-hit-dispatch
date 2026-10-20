const SESSION_COOKIE = "lh_playtest_admin";
const CHALLENGE_COOKIE = "lh_playtest_admin_challenge";
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const CHALLENGE_TTL_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

interface SessionPayload {
  kind: "session";
  email: string;
  expiresAt: number;
}

interface ChallengePayload {
  kind: "challenge";
  email: string;
  nonce: string;
  codeDigest: string;
  requestedAt: number;
  expiresAt: number;
  attempts: number;
}

export interface AdminSession {
  email: string;
}

export function localAdminBypassIsEnabled() {
  return (
    process.env.NODE_ENV !== "production" && process.env.PLAYTEST_ADMIN_LOCAL_BYPASS === "true"
  );
}

export function adminAuthIsConfigured() {
  if (localAdminBypassIsEnabled()) return Boolean(process.env.PLAYTEST_ADMIN_EMAIL);
  return Boolean(
    process.env.PLAYTEST_ADMIN_EMAIL &&
    process.env.PLAYTEST_ADMIN_SESSION_SECRET &&
    process.env.RESEND_API_KEY &&
    process.env.PLAYTEST_EMAIL_FROM,
  );
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  if (new URL(origin).origin !== new URL(request.url).origin) {
    throw new AdminAuthError(403, "This request could not be verified.");
  }
}

export async function readAdminSession(request: Request): Promise<AdminSession | null> {
  if (localAdminBypassIsEnabled()) return { email: requiredAdminEmail() };
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const payload = await verifyToken<SessionPayload>(token);
  if (!payload || payload.kind !== "session" || payload.expiresAt <= Date.now()) return null;
  if (!(await safeEqual(payload.email, requiredAdminEmail()))) return null;
  return { email: payload.email };
}

export async function createAdminLoginChallenge(request: Request, email: string) {
  const normalizedEmail = normalizeEmail(email);
  const expectedEmail = requiredAdminEmail();
  if (!(await safeEqual(normalizedEmail, expectedEmail))) {
    return {
      shouldSend: false,
      code: null,
      waitSeconds: RESEND_COOLDOWN_SECONDS,
      cookie: clearCookie(CHALLENGE_COOKIE, request),
    };
  }

  const now = Date.now();
  const existing = await verifyToken<ChallengePayload>(readCookie(request, CHALLENGE_COOKIE) ?? "");
  if (
    existing?.kind === "challenge" &&
    existing.email === normalizedEmail &&
    existing.expiresAt > now &&
    now - existing.requestedAt < RESEND_COOLDOWN_SECONDS * 1000
  ) {
    return {
      shouldSend: false,
      code: null,
      waitSeconds: Math.ceil(
        (RESEND_COOLDOWN_SECONDS * 1000 - (now - existing.requestedAt)) / 1000,
      ),
      cookie: null,
    };
  }

  const { randomBytes, randomInt, createHmac } = await import("node:crypto");
  const code = randomInt(100_000, 1_000_000).toString();
  const nonce = randomBytes(18).toString("base64url");
  const codeDigest = createHmac("sha256", requiredSecret())
    .update(`${nonce}:${code}`, "utf8")
    .digest("base64url");
  const payload: ChallengePayload = {
    kind: "challenge",
    email: normalizedEmail,
    nonce,
    codeDigest,
    requestedAt: now,
    expiresAt: now + CHALLENGE_TTL_SECONDS * 1000,
    attempts: 0,
  };

  return {
    shouldSend: true,
    code,
    waitSeconds: RESEND_COOLDOWN_SECONDS,
    cookie: cookie(CHALLENGE_COOKIE, await signToken(payload), request, CHALLENGE_TTL_SECONDS),
  };
}

export async function verifyAdminLoginCode(request: Request, email: string, code: string) {
  const token = readCookie(request, CHALLENGE_COOKIE);
  const challenge = token ? await verifyToken<ChallengePayload>(token) : null;
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();

  if (
    !challenge ||
    challenge.kind !== "challenge" ||
    challenge.expiresAt <= now ||
    !(await safeEqual(challenge.email, normalizedEmail))
  ) {
    throw new AdminAuthError(401, "That code has expired. Request a new one.", [
      clearCookie(CHALLENGE_COOKIE, request),
    ]);
  }

  const { createHmac } = await import("node:crypto");
  const providedDigest = createHmac("sha256", requiredSecret())
    .update(`${challenge.nonce}:${code}`, "utf8")
    .digest("base64url");
  if (!(await safeEqual(challenge.codeDigest, providedDigest))) {
    const attempts = challenge.attempts + 1;
    const challengeCookie =
      attempts >= 5
        ? clearCookie(CHALLENGE_COOKIE, request)
        : cookie(
            CHALLENGE_COOKIE,
            await signToken({ ...challenge, attempts }),
            request,
            Math.max(1, Math.floor((challenge.expiresAt - now) / 1000)),
          );
    throw new AdminAuthError(
      401,
      attempts >= 5 ? "Too many attempts. Request a new code." : "That code doesn’t match.",
      [challengeCookie],
    );
  }

  const session: SessionPayload = {
    kind: "session",
    email: normalizedEmail,
    expiresAt: now + SESSION_TTL_SECONDS * 1000,
  };
  return [
    cookie(SESSION_COOKIE, await signToken(session), request, SESSION_TTL_SECONDS),
    clearCookie(CHALLENGE_COOKIE, request),
  ];
}

export function clearAdminCookies(request: Request) {
  return [clearCookie(SESSION_COOKIE, request), clearCookie(CHALLENGE_COOKIE, request)];
}

export class AdminAuthError extends Error {
  constructor(
    public status: number,
    message: string,
    public cookies: string[] = [],
  ) {
    super(message);
  }
}

async function signToken(payload: SessionPayload | ChallengePayload) {
  const { createHmac } = await import("node:crypto");
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", requiredSecret())
    .update(encoded, "utf8")
    .digest("base64url");
  return `${encoded}.${signature}`;
}

async function verifyToken<T>(token: string): Promise<T | null> {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;
  const { createHmac } = await import("node:crypto");
  const expected = createHmac("sha256", requiredSecret())
    .update(encoded, "utf8")
    .digest("base64url");
  if (!(await safeEqual(signature, expected))) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

async function safeEqual(left: string, right: string) {
  const { createHash, timingSafeEqual } = await import("node:crypto");
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(digest(left), digest(right));
}

function requiredAdminEmail() {
  const value = process.env.PLAYTEST_ADMIN_EMAIL;
  if (!value) throw new AdminAuthError(503, "Admin access is not configured.");
  return normalizeEmail(value);
}

function requiredSecret() {
  const value = process.env.PLAYTEST_ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new AdminAuthError(503, "Admin access is not configured.");
  return value;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function cookie(name: string, value: string, request: Request, maxAge: number) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function clearCookie(name: string, request: Request) {
  return cookie(name, "", request, 0);
}
