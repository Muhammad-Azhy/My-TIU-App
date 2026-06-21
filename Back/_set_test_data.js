import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Set GPA and semester for test student ST-1001
  const result = await prisma.student.updateMany({
    where: { studentNumber: "ST-1001" },
    data: { gpa: 3.75, currentSemester: "2025-Spring" },
  });
  console.log("Updated ST-1001:", result);

  // Verify
  const student = await prisma.student.findFirst({
    where: { studentNumber: "ST-1001" },
    select: { studentNumber: true, gpa: true, currentSemester: true, yearLevel: true },
  });
  console.log("Verified:", student);
}

main()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
