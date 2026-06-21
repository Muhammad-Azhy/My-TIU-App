import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  prepareCacheLength: 0,
});

const prisma = new PrismaClient({ adapter });

async function testLoginQuery() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@mytiu.edu" },
      include: {
        student: { include: { department: true } },
        lecturer: { include: { department: true } },
      },
    });
    console.log("User found:", user ? "Yes" : "No");
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginQuery();
