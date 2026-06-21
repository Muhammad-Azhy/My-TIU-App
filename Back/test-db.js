import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  connectTimeout: 5000,
  connectionLimit: 5,
  prepareCacheLength: 0,
});

const prisma = new PrismaClient({ adapter });

console.log("Testing with user:", process.env.DB_USER, "host:", process.env.DB_HOST, "db:", process.env.DB_NAME);

try {
  const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
  console.log("SUCCESS:", result);
} catch (err) {
  console.error("FAIL:", err.message);
  const cause = err.meta?.driverAdapterError?.cause;
  if (cause) console.error("Root cause:", cause.cause || cause.message || cause);
} finally {
  await prisma.$disconnect();
}
