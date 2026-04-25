import bcrypt from "bcryptjs";
import prisma from "../prisma/prismaClient.js";

export const listUsers = async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { student: true, lecturer: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
};

export const listStudents = async (_req, res) => {
  const students = await prisma.student.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: { id: "desc" },
  });
  res.json(students);
};

export const listClasses = async (_req, res) => {
  const classes = await prisma.classOffering.findMany({
    include: {
      course: true,
      lecturer: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(classes);
};

export const createUser = async (req, res) => {
  const { email, password, firstName, lastName, role, departmentId, yearLevel, studentNumber, employeeId, lecturerRank } =
    req.body;

  const created = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      role,
      student:
        role === "STUDENT"
          ? { create: { studentNumber, yearLevel: Number(yearLevel), departmentId: Number(departmentId) } }
          : undefined,
      lecturer:
        role === "LECTURER"
          ? { create: { employeeId, rank: lecturerRank || "LECTURER", departmentId: Number(departmentId) } }
          : undefined,
    },
    include: { student: true, lecturer: true },
  });
  res.status(201).json(created);
};

export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const { firstName, lastName, isActive, role } = req.body;
  const updated = await prisma.user.update({
    where: { id },
    data: { firstName, lastName, isActive, role },
  });
  res.json(updated);
};

export const deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};

export const assignStudentToClass = async (req, res) => {
  const { studentId, classId } = req.body;
  const enrollment = await prisma.enrollment.upsert({
    where: {
      studentId_classId: { studentId: Number(studentId), classId: Number(classId) },
    },
    create: { studentId: Number(studentId), classId: Number(classId) },
    update: {},
  });
  res.status(201).json(enrollment);
};

export const assignLecturerToCourse = async (req, res) => {
  const { lecturerId, classId } = req.body;
  const updated = await prisma.classOffering.update({
    where: { id: Number(classId) },
    data: { lecturerId: Number(lecturerId) },
  });
  res.json(updated);
};

export const listDepartmentsAdmin = async (_req, res) => {
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  res.json(departments);
};

export const createDepartment = async (req, res) => {
  const { name, code } = req.body;
  const department = await prisma.department.create({ data: { name, code } });
  res.status(201).json(department);
};

export const updateDepartment = async (req, res) => {
  const department = await prisma.department.update({
    where: { id: Number(req.params.id) },
    data: { name: req.body.name, code: req.body.code },
  });
  res.json(department);
};

export const deleteDepartment = async (req, res) => {
  await prisma.department.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};

export const getDashboardStats = async (_req, res) => {
  const [users, departments, classes, announcements, news] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.classOffering.count(),
    prisma.announcement.count(),
    prisma.news.count(),
  ]);
  res.json({ users, departments, classes, announcements, news });
};

export const createNews = async (req, res) => {
  const { title, content, departmentId } = req.body;
  const created = await prisma.news.create({
    data: {
      title,
      content,
      departmentId: departmentId ? Number(departmentId) : null,
      authorId: req.user.id,
    },
  });
  res.status(201).json(created);
};

export const updateNews = async (req, res) => {
  const news = await prisma.news.update({
    where: { id: Number(req.params.id) },
    data: { title: req.body.title, content: req.body.content, departmentId: req.body.departmentId ? Number(req.body.departmentId) : null },
  });
  res.json(news);
};

export const deleteNews = async (req, res) => {
  await prisma.news.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};
