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

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, role: true, firstName: true },
      take: 10,
    });
    console.log("Users in DB:", users);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
