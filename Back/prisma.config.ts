// Load `.env` from this package root (Prisma's loader does not always resolve `dotenv/config`).
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

/** Parse mysql:// URL for merge logic only — never log password values. */
function mysqlUrlDiagnostics(raw: string | undefined) {
  if (raw == null || raw === "") {
    return { defined: false as const, parseOk: false as const };
  }
  const trimmed = raw.trim();
  let user = "";
  let host = "";
  let database = "";
  let passwordPresent = false;
  let parseOk = false;
  try {
    const normalized = trimmed.replace(/^mysql:\/\//i, "http://");
    const u = new URL(normalized);
    user = decodeURIComponent(u.username || "");
    const pw = u.password ? decodeURIComponent(u.password) : "";
    passwordPresent = pw.length > 0;
    host = u.hostname || "";
    database = (u.pathname || "").replace(/^\//, "").split("?")[0] || "";
    parseOk = Boolean(host);
  } catch {
    parseOk = false;
  }
  return {
    defined: true as const,
    parseOk,
    user: user || "(empty)",
    host: host || "(empty)",
    database: database || "(empty)",
    passwordPresent,
  };
}

/**
 * Prisma CLI only reads this URL. The API uses `DB_*` in prismaClient.js.
 * If `DATABASE_URL` has no password but `DB_PASSWORD` is set, merge so migrate matches runtime.
 */
function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  const diag = mysqlUrlDiagnostics(raw);
  const dbUser = process.env.DB_USER?.trim() || "";
  const dbPass = process.env.DB_PASSWORD ?? "";
  const dbHost = process.env.DB_HOST?.trim() || "";
  const dbPort = (process.env.DB_PORT || "3306").trim();
  const dbName = process.env.DB_NAME?.trim() || "";

  const host = dbHost || (diag.parseOk ? diag.host : "") || "127.0.0.1";
  const name = dbName || (diag.parseOk ? diag.database : "") || "";
  const user = dbUser || (diag.parseOk ? diag.user : "") || "";

  const passwordMissingInUrl =
    Boolean(raw) && diag.parseOk && !diag.passwordPresent && dbPass.length > 0;

  if (passwordMissingInUrl && user && name) {
    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(dbPass)}@${host}:${dbPort}/${name}`;
  }

  if (!raw && user && name && dbPass.length > 0) {
    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(dbPass)}@${host}:${dbPort}/${name}`;
  }

  if (!raw && user && name && dbPass.length === 0) {
    return `mysql://${encodeURIComponent(user)}@${host}:${dbPort}/${name}`;
  }

  return raw || "";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
