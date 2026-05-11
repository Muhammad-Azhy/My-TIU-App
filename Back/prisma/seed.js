import pkg from "@prisma/client";
const { PrismaClient } = pkg;
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

// ─── Static Data ────────────────────────────────────────────────────────────

const dashboardRandomTexts = [
  "....",
  "Procrastination Level UP",
  'The syllabus says "hi"',
  "Just get off your phone",
  "It's not your fault.",
  "Stay Hydrated..",
  "Dw the report is writing itself",
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

// Courses per department: [deptName, [{code, title, description, creditHours}]]
const coursesByDept = {
  "COMPUTER": [
    { code: "CS101", title: "Introduction to Programming", description: "Fundamentals of programming using Python.", creditHours: 3 },
    { code: "CS201", title: "Data Structures & Algorithms", description: "Arrays, linked lists, trees, sorting and searching.", creditHours: 3 },
    { code: "CS301", title: "Database Systems", description: "Relational databases, SQL, normalization.", creditHours: 3 },
    { code: "CS302", title: "Operating Systems", description: "Processes, memory management, file systems.", creditHours: 3 },
    { code: "CS401", title: "Software Engineering", description: "SDLC, design patterns, agile methodologies.", creditHours: 3 },
    { code: "CS402", title: "Computer Networks", description: "TCP/IP, network architecture, protocols.", creditHours: 3 },
  ],
  "INFORMATION TECHNOLOGIES (IT)": [
    { code: "IT101", title: "IT Fundamentals", description: "Hardware, software and IT support essentials.", creditHours: 3 },
    { code: "IT201", title: "Web Development", description: "HTML, CSS, JavaScript and responsive design.", creditHours: 3 },
    { code: "IT301", title: "Cloud Computing", description: "Cloud architecture, AWS, Azure basics.", creditHours: 3 },
    { code: "IT401", title: "IT Project Management", description: "Planning, execution and delivery of IT projects.", creditHours: 3 },
  ],
  "CYBER SECURITY": [
    { code: "CYS101", title: "Introduction to Cyber Security", description: "Core principles of information security.", creditHours: 3 },
    { code: "CYS201", title: "Network Security", description: "Firewalls, intrusion detection, VPNs.", creditHours: 3 },
    { code: "CYS301", title: "Ethical Hacking", description: "Penetration testing and vulnerability assessment.", creditHours: 3 },
    { code: "CYS401", title: "Digital Forensics", description: "Evidence collection and incident response.", creditHours: 3 },
  ],
  "BUSINESS & MANAGEMENT": [
    { code: "BUS101", title: "Principles of Management", description: "Planning, organizing, leading and controlling.", creditHours: 3 },
    { code: "BUS201", title: "Marketing Management", description: "Market analysis, product strategy and promotion.", creditHours: 3 },
    { code: "BUS301", title: "Organizational Behavior", description: "Human behavior in organizations.", creditHours: 3 },
    { code: "BUS401", title: "Strategic Management", description: "Competitive strategy and corporate governance.", creditHours: 3 },
  ],
  "ACCOUNTING": [
    { code: "ACC101", title: "Financial Accounting", description: "Recording, summarizing and reporting transactions.", creditHours: 3 },
    { code: "ACC201", title: "Managerial Accounting", description: "Cost behavior, budgeting and performance.", creditHours: 3 },
    { code: "ACC301", title: "Auditing", description: "Audit planning, evidence and reporting.", creditHours: 3 },
    { code: "ACC401", title: "Taxation", description: "Tax laws, corporate tax and VAT.", creditHours: 3 },
  ],
  "CIVIL": [
    { code: "CVL101", title: "Engineering Mechanics", description: "Statics and dynamics of structures.", creditHours: 3 },
    { code: "CVL201", title: "Structural Analysis", description: "Beams, trusses and frames.", creditHours: 3 },
    { code: "CVL301", title: "Geotechnical Engineering", description: "Soil mechanics and foundation design.", creditHours: 3 },
    { code: "CVL401", title: "Construction Management", description: "Project scheduling, cost control and safety.", creditHours: 3 },
  ],
  "LAW": [
    { code: "LAW101", title: "Introduction to Law", description: "Legal systems, sources and principles.", creditHours: 3 },
    { code: "LAW201", title: "Contract Law", description: "Formation, breach and remedies of contracts.", creditHours: 3 },
    { code: "LAW301", title: "Criminal Law", description: "Offences, defences and sentencing.", creditHours: 3 },
    { code: "LAW401", title: "Corporate Law", description: "Company formation, governance and insolvency.", creditHours: 3 },
  ],
  "ARCHITECTURE": [
    { code: "ARC101", title: "Architectural Design I", description: "Basic principles of architectural design.", creditHours: 4 },
    { code: "ARC201", title: "Architectural Design II", description: "Intermediate design studios.", creditHours: 4 },
    { code: "ARC301", title: "Urban Planning", description: "Urban form, zoning and master planning.", creditHours: 3 },
    { code: "ARC401", title: "Sustainable Architecture", description: "Green building techniques and energy efficiency.", creditHours: 3 },
  ],
  "BANKING & FINANCE": [
    { code: "BNF101", title: "Principles of Finance", description: "Time value of money, risk and return.", creditHours: 3 },
    { code: "BNF201", title: "Banking Operations", description: "Commercial banking, credit and risk management.", creditHours: 3 },
    { code: "BNF301", title: "Investment Analysis", description: "Portfolio theory, equity and fixed income.", creditHours: 3 },
    { code: "BNF401", title: "Islamic Finance", description: "Sharia-compliant products and instruments.", creditHours: 3 },
  ],
  "MECHATRONICS": [
    { code: "MCT101", title: "Electronics Fundamentals", description: "Circuit theory, components and measurements.", creditHours: 3 },
    { code: "MCT201", title: "Control Systems", description: "Feedback, stability and PID control.", creditHours: 3 },
    { code: "MCT301", title: "Robotics", description: "Kinematics, actuators and robot programming.", creditHours: 3 },
    { code: "MCT401", title: "Embedded Systems", description: "Microcontrollers, RTOS and hardware interfaces.", creditHours: 3 },
  ],
};

// Lecturers seed data
const lecturersSeed = [
  // COMPUTER dept
  { firstName: "Ari", lastName: "Kamal", email: "hod.computer@mytiu.edu", employeeId: "LC-1001", rank: "HEAD_OF_DEPARTMENT", dept: "COMPUTER" },
  { firstName: "Noor", lastName: "Hassan", email: "noor.hassan@mytiu.edu", employeeId: "LC-1002", rank: "LECTURER", dept: "COMPUTER" },
  { firstName: "Zaid", lastName: "Omar", email: "zaid.omar@mytiu.edu", employeeId: "LC-1003", rank: "ASSISTANT", dept: "COMPUTER" },
  // IT dept
  { firstName: "Layla", lastName: "Rashid", email: "layla.rashid@mytiu.edu", employeeId: "LC-1004", rank: "HEAD_OF_DEPARTMENT", dept: "INFORMATION TECHNOLOGIES (IT)" },
  { firstName: "Tariq", lastName: "Najaf", email: "tariq.najaf@mytiu.edu", employeeId: "LC-1005", rank: "LECTURER", dept: "INFORMATION TECHNOLOGIES (IT)" },
  // CYBER SECURITY
  { firstName: "Sana", lastName: "Aziz", email: "sana.aziz@mytiu.edu", employeeId: "LC-1006", rank: "HEAD_OF_DEPARTMENT", dept: "CYBER SECURITY" },
  { firstName: "Bilal", lastName: "Kareem", email: "bilal.kareem@mytiu.edu", employeeId: "LC-1007", rank: "LECTURER", dept: "CYBER SECURITY" },
  // BUSINESS
  { firstName: "Hana", lastName: "Salim", email: "hana.salim@mytiu.edu", employeeId: "LC-1008", rank: "HEAD_OF_DEPARTMENT", dept: "BUSINESS & MANAGEMENT" },
  { firstName: "Ahmad", lastName: "Farid", email: "ahmad.farid@mytiu.edu", employeeId: "LC-1009", rank: "LECTURER", dept: "BUSINESS & MANAGEMENT" },
  // ACCOUNTING
  { firstName: "Rania", lastName: "Khalil", email: "rania.khalil@mytiu.edu", employeeId: "LC-1010", rank: "HEAD_OF_DEPARTMENT", dept: "ACCOUNTING" },
  { firstName: "Yusuf", lastName: "Badr", email: "yusuf.badr@mytiu.edu", employeeId: "LC-1011", rank: "LECTURER", dept: "ACCOUNTING" },
  // CIVIL
  { firstName: "Faris", lastName: "Taha", email: "faris.taha@mytiu.edu", employeeId: "LC-1012", rank: "HEAD_OF_DEPARTMENT", dept: "CIVIL" },
  { firstName: "Mariam", lastName: "Saeed", email: "mariam.saeed@mytiu.edu", employeeId: "LC-1013", rank: "LECTURER", dept: "CIVIL" },
  // LAW
  { firstName: "Dania", lastName: "Jawad", email: "dania.jawad@mytiu.edu", employeeId: "LC-1014", rank: "HEAD_OF_DEPARTMENT", dept: "LAW" },
  { firstName: "Hassan", lastName: "Qasim", email: "hassan.qasim@mytiu.edu", employeeId: "LC-1015", rank: "LECTURER", dept: "LAW" },
  // ARCHITECTURE
  { firstName: "Sama", lastName: "Naji", email: "sama.naji@mytiu.edu", employeeId: "LC-1016", rank: "HEAD_OF_DEPARTMENT", dept: "ARCHITECTURE" },
  { firstName: "Karrar", lastName: "Ali", email: "karrar.ali@mytiu.edu", employeeId: "LC-1017", rank: "LECTURER", dept: "ARCHITECTURE" },
  // BANKING
  { firstName: "Mona", lastName: "Hamid", email: "mona.hamid@mytiu.edu", employeeId: "LC-1018", rank: "HEAD_OF_DEPARTMENT", dept: "BANKING & FINANCE" },
  { firstName: "Samer", lastName: "Adel", email: "samer.adel@mytiu.edu", employeeId: "LC-1019", rank: "LECTURER", dept: "BANKING & FINANCE" },
  // MECHATRONICS
  { firstName: "Rami", lastName: "Nasser", email: "rami.nasser@mytiu.edu", employeeId: "LC-1020", rank: "HEAD_OF_DEPARTMENT", dept: "MECHATRONICS" },
  { firstName: "Lina", lastName: "Waleed", email: "lina.waleed@mytiu.edu", employeeId: "LC-1021", rank: "LECTURER", dept: "MECHATRONICS" },
];

// Students seed data (10 per major department, 4 year levels)
const studentsSeed = [
  // COMPUTER
  { firstName: "Sara", lastName: "Ahmed", email: "student1@mytiu.edu", studentNumber: "ST-1001", yearLevel: 3, dept: "COMPUTER" },
  { firstName: "Omar", lastName: "Malik", email: "omar.malik@mytiu.edu", studentNumber: "ST-1002", yearLevel: 2, dept: "COMPUTER" },
  { firstName: "Lara", lastName: "Hadi", email: "lara.hadi@mytiu.edu", studentNumber: "ST-1003", yearLevel: 1, dept: "COMPUTER" },
  { firstName: "Karim", lastName: "Zaki", email: "karim.zaki@mytiu.edu", studentNumber: "ST-1004", yearLevel: 4, dept: "COMPUTER" },
  { firstName: "Nadia", lastName: "Fawzi", email: "nadia.fawzi@mytiu.edu", studentNumber: "ST-1005", yearLevel: 2, dept: "COMPUTER" },
  { firstName: "Ali", lastName: "Jabbar", email: "ali.jabbar@mytiu.edu", studentNumber: "ST-1006", yearLevel: 3, dept: "COMPUTER" },
  { firstName: "Rana", lastName: "Sahi", email: "rana.sahi@mytiu.edu", studentNumber: "ST-1007", yearLevel: 1, dept: "COMPUTER" },
  { firstName: "Mustafa", lastName: "Amir", email: "mustafa.amir@mytiu.edu", studentNumber: "ST-1008", yearLevel: 4, dept: "COMPUTER" },
  // IT
  { firstName: "Hiba", lastName: "Nour", email: "hiba.nour@mytiu.edu", studentNumber: "ST-2001", yearLevel: 2, dept: "INFORMATION TECHNOLOGIES (IT)" },
  { firstName: "Qasim", lastName: "Talib", email: "qasim.talib@mytiu.edu", studentNumber: "ST-2002", yearLevel: 3, dept: "INFORMATION TECHNOLOGIES (IT)" },
  { firstName: "Aya", lastName: "Wahid", email: "aya.wahid@mytiu.edu", studentNumber: "ST-2003", yearLevel: 1, dept: "INFORMATION TECHNOLOGIES (IT)" },
  { firstName: "Mazin", lastName: "Samir", email: "mazin.samir@mytiu.edu", studentNumber: "ST-2004", yearLevel: 4, dept: "INFORMATION TECHNOLOGIES (IT)" },
  // CYBER SECURITY
  { firstName: "Faten", lastName: "Yahya", email: "faten.yahya@mytiu.edu", studentNumber: "ST-3001", yearLevel: 2, dept: "CYBER SECURITY" },
  { firstName: "Haider", lastName: "Kareem", email: "haider.kareem@mytiu.edu", studentNumber: "ST-3002", yearLevel: 3, dept: "CYBER SECURITY" },
  { firstName: "Zainab", lastName: "Muhsin", email: "zainab.muhsin@mytiu.edu", studentNumber: "ST-3003", yearLevel: 1, dept: "CYBER SECURITY" },
  { firstName: "Amir", lastName: "Latif", email: "amir.latif@mytiu.edu", studentNumber: "ST-3004", yearLevel: 4, dept: "CYBER SECURITY" },
  // BUSINESS
  { firstName: "Dina", lastName: "Fadel", email: "dina.fadel@mytiu.edu", studentNumber: "ST-4001", yearLevel: 2, dept: "BUSINESS & MANAGEMENT" },
  { firstName: "Bilal", lastName: "Hamza", email: "bilal.hamza@mytiu.edu", studentNumber: "ST-4002", yearLevel: 3, dept: "BUSINESS & MANAGEMENT" },
  { firstName: "Safa", lastName: "Rauf", email: "safa.rauf@mytiu.edu", studentNumber: "ST-4003", yearLevel: 1, dept: "BUSINESS & MANAGEMENT" },
  { firstName: "Emad", lastName: "Shawi", email: "emad.shawi@mytiu.edu", studentNumber: "ST-4004", yearLevel: 4, dept: "BUSINESS & MANAGEMENT" },
  // ACCOUNTING
  { firstName: "Reem", lastName: "Amin", email: "reem.amin@mytiu.edu", studentNumber: "ST-5001", yearLevel: 2, dept: "ACCOUNTING" },
  { firstName: "Luay", lastName: "Sabah", email: "luay.sabah@mytiu.edu", studentNumber: "ST-5002", yearLevel: 3, dept: "ACCOUNTING" },
  { firstName: "Nour", lastName: "Jasim", email: "nour.jasim@mytiu.edu", studentNumber: "ST-5003", yearLevel: 1, dept: "ACCOUNTING" },
  { firstName: "Zahra", lastName: "Kadhim", email: "zahra.kadhim@mytiu.edu", studentNumber: "ST-5004", yearLevel: 4, dept: "ACCOUNTING" },
  // CIVIL
  { firstName: "Waleed", lastName: "Obaid", email: "waleed.obaid@mytiu.edu", studentNumber: "ST-6001", yearLevel: 2, dept: "CIVIL" },
  { firstName: "Iman", lastName: "Rasheed", email: "iman.rasheed@mytiu.edu", studentNumber: "ST-6002", yearLevel: 3, dept: "CIVIL" },
  { firstName: "Hussain", lastName: "Jasim", email: "hussain.jasim@mytiu.edu", studentNumber: "ST-6003", yearLevel: 1, dept: "CIVIL" },
  { firstName: "Widad", lastName: "Turki", email: "widad.turki@mytiu.edu", studentNumber: "ST-6004", yearLevel: 4, dept: "CIVIL" },
  // LAW
  { firstName: "Tara", lastName: "Osman", email: "tara.osman@mytiu.edu", studentNumber: "ST-7001", yearLevel: 2, dept: "LAW" },
  { firstName: "Khalid", lastName: "Musa", email: "khalid.musa@mytiu.edu", studentNumber: "ST-7002", yearLevel: 3, dept: "LAW" },
  { firstName: "Inas", lastName: "Hameed", email: "inas.hameed@mytiu.edu", studentNumber: "ST-7003", yearLevel: 1, dept: "LAW" },
  { firstName: "Barzan", lastName: "Azad", email: "barzan.azad@mytiu.edu", studentNumber: "ST-7004", yearLevel: 4, dept: "LAW" },
  // BANKING
  { firstName: "Razan", lastName: "Mukhtar", email: "razan.mukhtar@mytiu.edu", studentNumber: "ST-8001", yearLevel: 2, dept: "BANKING & FINANCE" },
  { firstName: "Sinan", lastName: "Hasan", email: "sinan.hasan@mytiu.edu", studentNumber: "ST-8002", yearLevel: 3, dept: "BANKING & FINANCE" },
  { firstName: "Diana", lastName: "Naji", email: "diana.naji@mytiu.edu", studentNumber: "ST-8003", yearLevel: 1, dept: "BANKING & FINANCE" },
  { firstName: "Faisal", lastName: "Azawi", email: "faisal.azawi@mytiu.edu", studentNumber: "ST-8004", yearLevel: 4, dept: "BANKING & FINANCE" },
  // MECHATRONICS
  { firstName: "Sawsan", lastName: "Radhi", email: "sawsan.radhi@mytiu.edu", studentNumber: "ST-9001", yearLevel: 2, dept: "MECHATRONICS" },
  { firstName: "Yousif", lastName: "Saleh", email: "yousif.saleh@mytiu.edu", studentNumber: "ST-9002", yearLevel: 3, dept: "MECHATRONICS" },
  { firstName: "Ghada", lastName: "Kamel", email: "ghada.kamel@mytiu.edu", studentNumber: "ST-9003", yearLevel: 1, dept: "MECHATRONICS" },
  { firstName: "Ihsan", lastName: "Mahmoud", email: "ihsan.mahmoud@mytiu.edu", studentNumber: "ST-9004", yearLevel: 4, dept: "MECHATRONICS" },
  // ARCHITECTURE
  { firstName: "Ruba", lastName: "Sadeq", email: "ruba.sadeq@mytiu.edu", studentNumber: "ST-10001", yearLevel: 2, dept: "ARCHITECTURE" },
  { firstName: "Luqman", lastName: "Taher", email: "luqman.taher@mytiu.edu", studentNumber: "ST-10002", yearLevel: 3, dept: "ARCHITECTURE" },
  { firstName: "Shams", lastName: "Jaber", email: "shams.jaber@mytiu.edu", studentNumber: "ST-10003", yearLevel: 1, dept: "ARCHITECTURE" },
  { firstName: "Adnan", lastName: "Najm", email: "adnan.najm@mytiu.edu", studentNumber: "ST-10004", yearLevel: 4, dept: "ARCHITECTURE" },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function randomScore(min = 50, max = 100) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // ── Wipe existing data (order matters for FK constraints) ──
  await prisma.fileUpload.deleteMany();
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

  // ── Departments ──────────────────────────────────────────────
  const createdDepartments = [];
  for (const dept of departmentsSeed) {
    const code = `DEP-${dept.id.padStart(2, "0")}`;
    const created = await prisma.department.create({
      data: { name: dept.name, code },
    });
    createdDepartments.push({ ...created, description: dept.description });
  }

  const deptMap = Object.fromEntries(createdDepartments.map((d) => [d.name, d]));

  // ── Admin & Guest ─────────────────────────────────────────────
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

  // ── Lecturers ─────────────────────────────────────────────────
  const lecturerMap = {}; // employeeId → { user, lecturer }
  for (const l of lecturersSeed) {
    const dept = deptMap[l.dept];
    const userRecord = await prisma.user.create({
      data: {
        email: l.email,
        passwordHash: hashedPassword,
        firstName: l.firstName,
        lastName: l.lastName,
        role: "LECTURER",
        lecturer: {
          create: {
            employeeId: l.employeeId,
            rank: l.rank,
            departmentId: dept?.id,
          },
        },
      },
      include: { lecturer: true },
    });
    lecturerMap[l.employeeId] = userRecord;
  }

  // ── Students ──────────────────────────────────────────────────
  const studentMap = {}; // studentNumber → { user, student }
  for (const s of studentsSeed) {
    const dept = deptMap[s.dept];
    const userRecord = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: hashedPassword,
        firstName: s.firstName,
        lastName: s.lastName,
        role: "STUDENT",
        student: {
          create: {
            studentNumber: s.studentNumber,
            yearLevel: s.yearLevel,
            departmentId: dept?.id,
          },
        },
      },
      include: { student: true },
    });
    studentMap[s.studentNumber] = userRecord;
  }

  // ── Courses ───────────────────────────────────────────────────
  const courseMap = {}; // code → course
  for (const [deptName, courses] of Object.entries(coursesByDept)) {
    const dept = deptMap[deptName];
    if (!dept) continue;
    for (const c of courses) {
      const course = await prisma.course.create({
        data: {
          code: c.code,
          title: c.title,
          description: c.description,
          creditHours: c.creditHours,
          departmentId: dept.id,
        },
      });
      courseMap[c.code] = course;
    }
  }

  // ── Class Offerings (2 sections per course, 2 semesters) ──────
  const semesters = ["2024-Fall", "2025-Spring"];
  const sections = ["A", "B"];
  const rooms = ["R101", "R102", "R103", "R104", "R201", "R202", "Lab1", "Lab2"];
  const schedules = [
    "Sun/Tue 08:00-09:30",
    "Sun/Tue 10:00-11:30",
    "Mon/Wed 08:00-09:30",
    "Mon/Wed 10:00-11:30",
    "Mon/Wed 13:00-14:30",
    "Sun/Tue 13:00-14:30",
  ];

  // Build a lookup: deptName → [lecturerId, ...]
  const lecturersByDept = {};
  for (const l of lecturersSeed) {
    if (!lecturersByDept[l.dept]) lecturersByDept[l.dept] = [];
    const rec = lecturerMap[l.employeeId];
    if (rec?.lecturer) lecturersByDept[l.dept].push(rec.lecturer.id);
  }

  const classOfferingMap = {}; // `${courseCode}-${semester}-${section}` → classOffering
  let roomIdx = 0;
  let schedIdx = 0;

  for (const [deptName, courses] of Object.entries(coursesByDept)) {
    const deptLecturers = lecturersByDept[deptName] || [];
    let lecIdx = 0;

    for (const c of courses) {
      const course = courseMap[c.code];
      if (!course) continue;

      for (const semester of semesters) {
        for (const section of sections) {
          const lecturerId = deptLecturers.length
            ? deptLecturers[lecIdx % deptLecturers.length]
            : null;
          lecIdx++;

          const offering = await prisma.classOffering.create({
            data: {
              courseId: course.id,
              lecturerId,
              semester,
              section,
              room: rooms[roomIdx % rooms.length],
              schedule: schedules[schedIdx % schedules.length],
              capacity: 35,
            },
          });

          classOfferingMap[`${c.code}-${semester}-${section}`] = offering;
          roomIdx++;
          schedIdx++;
        }
      }
    }
  }

  // ── Enrollments & Grades ──────────────────────────────────────
  // Each student enrolls in the courses of their department for the current semester
  const targetSemester = "2025-Spring";

  for (const s of studentsSeed) {
    const userRec = studentMap[s.studentNumber];
    if (!userRec?.student) continue;
    const studentId = userRec.student.id;

    const deptCourses = coursesByDept[s.dept] || [];
    // Take first 3 courses to keep data reasonable
    const enrolledCourses = deptCourses.slice(0, 3);

    for (const c of enrolledCourses) {
      const key = `${c.code}-${targetSemester}-A`;
      const offering = classOfferingMap[key];
      if (!offering) continue;

      // Enroll
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          classId: offering.id,
        },
      });

      // Find an assignment for this class (created below), so we create assignments first
      // Store enrollment for later grading
      if (!offering._enrollments) offering._enrollments = [];
      offering._enrollments.push({ enrollment, studentId });
    }
  }

  // ── Assignments (2 per class offering in Spring semester) ─────
  const assignmentTitles = [
    ["Midterm Assignment", "Final Project"],
    ["Lab Report 1", "Lab Report 2"],
    ["Research Paper", "Presentation"],
    ["Problem Set 1", "Problem Set 2"],
    ["Case Study", "Group Project"],
    ["Quiz Submission", "Term Paper"],
  ];

  let assignTitleIdx = 0;
  const assignmentsByOffering = {}; // offeringId → [assignment]

  for (const [deptName, courses] of Object.entries(coursesByDept)) {
    const deptLecturers = lecturersByDept[deptName] || [];
    if (!deptLecturers.length) continue;

    for (const c of courses) {
      const key = `${c.code}-${targetSemester}-A`;
      const offering = classOfferingMap[key];
      if (!offering) continue;

      const lecturerId = offering.lecturerId ?? deptLecturers[0];
      const titles = assignmentTitles[assignTitleIdx % assignmentTitles.length];
      assignTitleIdx++;

      const created = [];
      for (let i = 0; i < titles.length; i++) {
        const dueDate = new Date(`2025-0${4 + i}-${10 + i * 5}`);
        const assignment = await prisma.assignment.create({
          data: {
            classId: offering.id,
            lecturerId,
            title: titles[i],
            description: `${titles[i]} for ${c.title}. Submit via the portal before the due date.`,
            dueDate,
          },
        });
        created.push(assignment);
      }
      assignmentsByOffering[offering.id] = created;
    }
  }

  // ── Grades (for each enrollment × assignment) ─────────────────
  for (const [deptName, courses] of Object.entries(coursesByDept)) {
    for (const c of courses) {
      const key = `${c.code}-${targetSemester}-A`;
      const offering = classOfferingMap[key];
      if (!offering?._enrollments) continue;

      const assignments = assignmentsByOffering[offering.id] || [];
      if (!assignments.length) continue;

      for (const { enrollment, studentId } of offering._enrollments) {
        for (const assignment of assignments) {
          await prisma.grade.create({
            data: {
              assignmentId: assignment.id,
              enrollmentId: enrollment.id,
              studentId,
              score: randomScore(55, 100),
              feedback: "Good work. Keep it up!",
              gradedById: adminUser.id,
            },
          });
        }
      }
    }
  }

  // ── News ───────────────────────────────────────────────────────
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

  for (let i = 0; i < dashboardRandomTexts.length; i++) {
    await prisma.news.create({
      data: {
        title: `Dashboard Note #${i + 1}`,
        content: dashboardRandomTexts[i],
        authorId: adminUser.id,
      },
    });
  }

  // Extra news from lecturers
  const newsExtras = [
    { title: "Semester Kick-off", content: "Welcome to the new semester. Classes begin on time." },
    { title: "Lab Maintenance Notice", content: "Computer labs will be unavailable Saturday 8am–12pm." },
    { title: "Scholarship Applications", content: "Applications for merit scholarships are now open." },
    { title: "Guest Lecture: AI Trends", content: "A guest lecture on AI in industry will be held next Monday." },
    { title: "Library Extended Hours", content: "The library will be open until midnight during finals week." },
  ];
  const lecturerUserIds = Object.values(lecturerMap).map((r) => r.id);
  for (let i = 0; i < newsExtras.length; i++) {
    await prisma.news.create({
      data: {
        title: newsExtras[i].title,
        content: newsExtras[i].content,
        authorId: lecturerUserIds[i % lecturerUserIds.length],
      },
    });
  }

  // ── Announcements ─────────────────────────────────────────────
  const announcementsSeed = [
    { title: "Exam Schedule Released", content: "Final exam schedule is now available on the portal.", dept: "COMPUTER" },
    { title: "Assignment Deadline Reminder", content: "All CS201 assignments are due by end of the week.", dept: "COMPUTER" },
    { title: "IT Workshop Registration", content: "Register for the Cloud Computing workshop by Friday.", dept: "INFORMATION TECHNOLOGIES (IT)" },
    { title: "Cyber Security Seminar", content: "Attend the upcoming ethical hacking seminar on campus.", dept: "CYBER SECURITY" },
    { title: "Business Case Competition", content: "Teams of 3–4 can register for the annual case competition.", dept: "BUSINESS & MANAGEMENT" },
    { title: "Tax Law Update Lecture", content: "Extra lecture on recent tax amendments added to week 10.", dept: "ACCOUNTING" },
    { title: "Site Visit Scheduled", content: "Civil students: site visit to downtown project on Thursday.", dept: "CIVIL" },
    { title: "Moot Court Practice", content: "Moot court sessions every Wednesday at 4pm in Hall B.", dept: "LAW" },
    { title: "Design Studio Hours", content: "Studio open access extended to 10pm on weekdays.", dept: "ARCHITECTURE" },
    { title: "Finance Internship Fair", content: "Internship fair with 12 local banks on the 20th.", dept: "BANKING & FINANCE" },
    { title: "Robotics Club Signup", content: "Join the robotics club — first meeting this Sunday 2pm.", dept: "MECHATRONICS" },
    { title: "General: Campus Wi-Fi Update", content: "Campus-wide Wi-Fi upgrade complete. New SSID: TIU-Campus.", dept: null },
    { title: "Student ID Renewal", content: "IDs expiring this year must be renewed at admin office.", dept: null },
  ];

  for (const ann of announcementsSeed) {
    const dept = ann.dept ? deptMap[ann.dept] : null;
    const authorId = ann.dept
      ? (lecturersByDept[ann.dept]?.[0]
        ? Object.values(lecturerMap).find((r) => r.lecturer?.departmentId === dept?.id)?.id ?? adminUser.id
        : adminUser.id)
      : adminUser.id;

    await prisma.announcement.create({
      data: {
        title: ann.title,
        content: ann.content,
        authorId,
        departmentId: dept?.id ?? null,
      },
    });
  }

  // ── File Uploads ──────────────────────────────────────────────
  // Attach sample files to assignments, news, announcements
  const allAssignments = await prisma.assignment.findMany({ take: 6 });
  const allNews = await prisma.news.findMany({ take: 4 });
  const allAnnouncements = await prisma.announcement.findMany({ take: 3 });

  for (const assignment of allAssignments) {
    await prisma.fileUpload.create({
      data: {
        originalName: `${assignment.title.replace(/\s+/g, "_")}_brief.pdf`,
        storedName: `assignment_${assignment.id}_brief.pdf`,
        path: `/uploads/assignments/${assignment.id}/`,
        mimeType: "application/pdf",
        extension: "pdf",
        size: 204800,
        relationType: "ASSIGNMENT",
        relationId: assignment.id,
        uploadedById: adminUser.id,
        assignmentId: assignment.id,
      },
    });
  }

  for (const news of allNews) {
    await prisma.fileUpload.create({
      data: {
        originalName: `news_${news.id}_cover.jpg`,
        storedName: `news_${news.id}_cover.jpg`,
        path: `/uploads/news/${news.id}/`,
        mimeType: "image/jpeg",
        extension: "jpg",
        size: 102400,
        relationType: "NEWS",
        relationId: news.id,
        uploadedById: adminUser.id,
        newsId: news.id,
      },
    });
  }

  for (const ann of allAnnouncements) {
    await prisma.fileUpload.create({
      data: {
        originalName: `announcement_${ann.id}_attachment.pdf`,
        storedName: `announcement_${ann.id}_attachment.pdf`,
        path: `/uploads/announcements/${ann.id}/`,
        mimeType: "application/pdf",
        extension: "pdf",
        size: 51200,
        relationType: "ANNOUNCEMENT",
        relationId: ann.id,
        uploadedById: adminUser.id,
        announcementId: ann.id,
      },
    });
  }

  // ── Summary ───────────────────────────────────────────────────
  const counts = {
    departments: await prisma.department.count(),
    users: await prisma.user.count(),
    lecturers: await prisma.lecturer.count(),
    students: await prisma.student.count(),
    courses: await prisma.course.count(),
    classOfferings: await prisma.classOffering.count(),
    enrollments: await prisma.enrollment.count(),
    assignments: await prisma.assignment.count(),
    grades: await prisma.grade.count(),
    news: await prisma.news.count(),
    announcements: await prisma.announcement.count(),
    fileUploads: await prisma.fileUpload.count(),
  };

  console.log("\n✅ Seed completed successfully\n");
  console.table(counts);
  console.log("\nDefault password for all seeded users: Password123!");
  console.log(`Admin:  admin@mytiu.edu`);
  console.log(`Guest:  guest@mytiu.edu`);
  console.log(`Sample lecturer: hod.computer@mytiu.edu`);
  console.log(`Sample student:  student1@mytiu.edu`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });