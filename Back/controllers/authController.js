import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d",
  });

const mapUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  lecturerRank: user.lecturer?.rank || null,
  student: user.student
    ? {
        id: user.student.id,
        studentNumber: user.student.studentNumber,
        yearLevel: user.student.yearLevel,
      }
    : null,
  lecturer: user.lecturer
    ? {
        id: user.lecturer.id,
        employeeId: user.lecturer.employeeId,
        rank: user.lecturer.rank,
      }
    : null,
});

export const register = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role = "STUDENT",
    departmentId,
    yearLevel,
    studentNumber,
    employeeId,
    lecturerRank = "LECTURER",
  } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      student:
        role === "STUDENT"
          ? {
              create: {
                studentNumber:
                  studentNumber || `ST-${Date.now().toString().slice(-6)}`,
                yearLevel: yearLevel ? Number(yearLevel) : null,
                departmentId: departmentId ? Number(departmentId) : null,
              },
            }
          : undefined,
      lecturer:
        role === "LECTURER"
          ? {
              create: {
                employeeId:
                  employeeId || `LC-${Date.now().toString().slice(-6)}`,
                rank: lecturerRank,
                departmentId: departmentId ? Number(departmentId) : null,
              },
            }
          : undefined,
    },
    include: { student: true, lecturer: true },
  });

  const token = signToken(created.id);
  return res.status(201).json({ token, user: mapUser(created) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: true, lecturer: true },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user.id);
  return res.json({ token, user: mapUser(user) });
};

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      student: { include: { department: true } },
      lecturer: { include: { department: true } },
    },
  });
  return res.json({ user: mapUser(user) });
};
