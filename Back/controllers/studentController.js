import prisma from "../prisma/prismaClient.js";
import path from "node:path";

export const listMyClasses = async (req, res) => {
  if (!req.user.student) {
    return res.status(403).json({ message: "Student profile required" });
  }
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: req.user.student.id },
    include: {
      classOffering: {
        include: { course: true, lecturer: { include: { user: true } } },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
  res.json(enrollments);
};

export const listMyAssignments = async (req, res) => {
  if (!req.user.student) {
    return res.status(403).json({ message: "Student profile required" });
  }
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: req.user.student.id },
    select: { classId: true },
  });
  const classIds = enrollments.map((item) => item.classId);
  const assignments = await prisma.assignment.findMany({
    where: { classId: { in: classIds } },
    include: { classOffering: { include: { course: true } }, files: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(assignments);
};

export const listMyGrades = async (req, res) => {
  if (!req.user.student) {
    return res.status(403).json({ message: "Student profile required" });
  }
  const grades = await prisma.grade.findMany({
    where: { studentId: req.user.student.id },
    include: {
      assignment: { include: { classOffering: { include: { course: true } } } },
    },
    orderBy: { gradedAt: "desc" },
  });
  res.json(grades);
};

export const listMyProfile = async (req, res) => {
  if (!req.user.student) {
    return res.status(403).json({ message: "Student profile required" });
  }
  const student = await prisma.student.findUnique({
    where: { id: req.user.student.id },
    include: { department: true, user: true },
  });
  res.json(student);
};

export const downloadFile = async (req, res) => {
  const file = await prisma.fileUpload.findUnique({
    where: { id: Number(req.params.fileId) },
  });
  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }
  return res.download(path.resolve(file.path), file.originalName);
};
