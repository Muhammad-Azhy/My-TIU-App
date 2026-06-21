import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  prepareCacheLength: 0,
});

const prisma = new PrismaClient({ adapter });

async function resetPassword() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);
    const email = "admin@mytiu.edu";
    
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
    
    console.log(`Password for ${email} has been reset to "password123"`);
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
