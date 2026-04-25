import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

const dashboardRandomTexts = [
  "....",
  "Procrastination Level UP",
  'The syllabus says "hi"',
  "Just get off your phone",
  "It's not your fault.",
  "Stay Hydrated..",
  "Dw the report is writting itself",
  "Did you skip class today? >:)",
  "The GPA is just a number..",
  "One more game",
  "Attendance isn't real",
  "Let me Chatgpt this",
  "Group projects: where one works, four watch",
  "Dw you can always change the picture.",
  "Your lecturer can smell your fear",
  "Music",
  "Who needs sleep anyway?",
  "Who's gonna carry the boats!?",
];

const departmentsSeed = [
  { id: "8", name: "ACCOUNTING", description: "The Accounting department offers programs focused on financial reporting, auditing, and taxation." },
  { id: "3", name: "ARCHITECTURE", description: "The Architecture department emphasizes design, urban planning, and sustainable building techniques." },
  { id: "6", name: "BANKING & FINANCE", description: "Programs covering banking operations, investments, financial analysis, and corporate finance." },
  { id: "18", name: "BIOLOGY EDUCATION", description: "Focused on biology teaching methods and laboratory skills for future educators." },
  { id: "4", name: "BUSINESS & MANAGEMENT", description: "Programs in business strategy, management principles, and organizational leadership." },
  { id: "5", name: "CIVIL", description: "Civil Engineering department covering infrastructure, construction, and structural design." },
  { id: "7", name: "COMPUTER", description: "Computer Science and IT programs focusing on programming, networks, and software engineering." },
  { id: "20", name: "CYBER SECURITY", description: "Specializes in network security, ethical hacking, and information protection techniques." },
  { id: "21", name: "PHARMACY", description: "Programs in drug formulation, pharmacology, and pharmaceutical sciences." },
  { id: "1", name: "DENTISTRY", description: "Covers oral health, dental treatments, and preventive dentistry." },
  { id: "12", name: "ENGLISH LANGUAGE TEACHING (ELT)", description: "Focuses on teaching English language skills to learners in diverse settings." },
  { id: "9", name: "INTERIOR DESIGN", description: "Interior design programs emphasize aesthetics, functionality, and spatial planning." },
  { id: "17", name: "INFORMATION TECHNOLOGIES (IT)", description: "Covers computing systems, software, and IT infrastructure management." },
  { id: "10", name: "INTERNATIONAL RELATIONS & DIPLOMACY", description: "Focuses on diplomacy, international law, and global political strategies." },
  { id: "2", name: "LAW", description: "Programs in civil, criminal, and corporate law with practical training." },
  { id: "19", name: "MEDICAL ANALYSIS", description: "Focuses on laboratory diagnostics and biomedical analysis." },
  { id: "14", name: "MATHEMATICS EDUCATION", description: "Prepares students to teach mathematics at various educational levels." },
  { id: "15", name: "MECHATRONICS", description: "Covers robotics, electronics, and mechanical systems design." },
  { id: "13", name: "PETROLEUM & MINING", description: "Covers petroleum extraction, mining engineering, and geosciences." },
  { id: "16", name: "PHYSICS EDUCATION", description: "Focuses on physics teaching methods and laboratory experiments." },
  { id: "11", name: "SURVEYING & GEOMETRICS", description: "Covers land surveying, mapping, and geometric measurement techniques." },
];

async function main() {
  await prisma.grade.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.classOffering.deleteMany();
  await prisma.course.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.news.deleteMany();
  await prisma.student.deleteMany();
  await prisma.lecturer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@mytiu.edu",
      passwordHash: hashedPassword,
      firstName: "System",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: "guest@mytiu.edu",
      passwordHash: hashedPassword,
      firstName: "Public",
      lastName: "Guest",
      role: "GUEST",
    },
  });

  const createdDepartments = [];
  for (const dept of departmentsSeed) {
    const code = `DEP-${dept.id.padStart(2, "0")}`;
    const created = await prisma.department.create({
      data: {
        name: dept.name,
        code,
      },
    });
    createdDepartments.push({ ...created, description: dept.description });
  }

  const computerDepartment = createdDepartments.find(
    (department) => department.name === "COMPUTER",
  );

  const lecturerUser = await prisma.user.create({
    data: {
      email: "hod.computer@mytiu.edu",
      passwordHash: hashedPassword,
      firstName: "Ari",
      lastName: "Kamal",
      role: "LECTURER",
      lecturer: {
        create: {
          employeeId: "LC-1001",
          rank: "HEAD_OF_DEPARTMENT",
          departmentId: computerDepartment?.id,
        },
      },
    },
    include: { lecturer: true },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: "student1@mytiu.edu",
      passwordHash: hashedPassword,
      firstName: "Sara",
      lastName: "Ahmed",
      role: "STUDENT",
      student: {
        create: {
          studentNumber: "ST-1001",
          yearLevel: 3,
          departmentId: computerDepartment?.id,
        },
      },
    },
    include: { student: true },
  });

  for (const department of createdDepartments) {
    await prisma.news.create({
      data: {
        title: `${department.name} Department Overview`,
        content: department.description,
        departmentId: department.id,
        authorId: adminUser.id,
      },
    });
  }

  for (let i = 0; i < dashboardRandomTexts.length; i += 1) {
    await prisma.news.create({
      data: {
        title: `Dashboard Note #${i + 1}`,
        content: dashboardRandomTexts[i],
        authorId: adminUser.id,
      },
    });
  }

  console.log("Seed completed with:");
  console.log(`- Departments: ${createdDepartments.length}`);
  console.log("- Users: 4 (admin, guest, lecturer, student)");
  console.log(`- Department news: ${createdDepartments.length}`);
  console.log(`- Dashboard text news: ${dashboardRandomTexts.length}`);
  console.log(`- Sample lecturer email: ${lecturerUser.email}`);
  console.log(`- Sample student email: ${studentUser.email}`);
  console.log("- Password for seeded users: Password123!");
  console.log(`- Guest account email: ${guestUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
