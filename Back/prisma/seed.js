// prisma/seed.ts
//import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { env } from "process";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// use `prisma` in your application to read and write data in your DB// instead of '@prisma/client'

//const prisma = new PrismaClient();

async function main() {
  // ===== Departments =====
  const cmpe = await prisma.department.upsert({
    where: { code: "CMPE" },
    update: {},
    create: { name: "Computer Engineering", code: "CMPE" },
  });

  // ===== News =====
  const newsData = [
    // CMPE News (5)
    {
      title: "CMPE Lab Maintenance",
      content: "CMPE labs closed this week.",
      departmentId: cmpe.id,
      imageUrl: "/uploads/news/cmpe_lab.jpg",
    },
    {
      title: "CMPE AI Workshop",
      content: "AI workshop scheduled Friday.",
      departmentId: cmpe.id,
    },
    {
      title: "CMPE Seminar",
      content: "Seminar on software testing.",
      departmentId: cmpe.id,
      imageUrl: "/uploads/news/cmpe_seminar.jpg",
    },
    {
      title: "CMPE Notice",
      content: "Final exam schedule released.",
      departmentId: cmpe.id,
    },
    {
      title: "CMPE Graduation",
      content: "Graduation ceremony planned.",
      departmentId: cmpe.id,
    },

    // Global News (10)
    {
      title: "Library Update",
      content: "New books available in library.",
      departmentId: null,
      imageUrl: "/uploads/news/library.jpg",
    },
    {
      title: "Campus WiFi",
      content: "WiFi upgraded across campus.",
      departmentId: null,
    },
    {
      title: "Cafeteria Menu",
      content: "New healthy options available.",
      departmentId: null,
    },
    {
      title: "Sports Week",
      content: "Inter-department sports week starts Monday.",
      departmentId: null,
    },
    {
      title: "Maintenance Alert",
      content: "Power shutdown on campus.",
      departmentId: null,
      imageUrl: "/uploads/news/power.jpg",
    },
    {
      title: "Student Council Elections",
      content: "Elections scheduled next week.",
      departmentId: null,
    },
    {
      title: "Tech Fair",
      content: "Annual tech fair coming soon.",
      departmentId: null,
    },
    {
      title: "Guest Lecture",
      content: "Industry expert will lecture on AI.",
      departmentId: null,
    },
    {
      title: "Scholarship Announcements",
      content: "New scholarships available.",
      departmentId: null,
    },
    {
      title: "Library Hours Extended",
      content: "Library open till midnight.",
      departmentId: null,
    },
  ];

  for (const n of newsData) {
    await prisma.news.create({ data: n });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
