import path from "node:path";
import prisma from "../prisma/prismaClient.js";
import { hasAdminPrivileges } from "../middleware/rbacMiddleware.js";

export const listMyClasses = async (req, res) => {
  if (!req.user.lecturer) {
    return res.status(403).json({ message: "Lecturer profile required" });
  }
  const classes = await prisma.classOffering.findMany({
    where: { lecturerId: req.user.lecturer.id },
    include: { course: true, enrollments: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(classes);
};

export const listMyAssignments = async (req, res) => {
  if (!req.user.lecturer) {
    return res.status(403).json({ message: "Lecturer profile required" });
  }
  const assignments = await prisma.assignment.findMany({
    where: { lecturerId: req.user.lecturer.id },
    include: {
      classOffering: {
        include: {
          course: true,
          enrollments: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
        },
      },
      files: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(assignments);
};

export const createAssignment = async (req, res) => {
  if (!req.user.lecturer) {
    return res.status(403).json({ message: "Lecturer profile required" });
  }
  const { classId, title, description, dueDate } = req.body;
  const assignment = await prisma.assignment.create({
    data: {
      classId: Number(classId),
      lecturerId: req.user.lecturer.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  if (req.file) {
    await prisma.fileUpload.create({
      data: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path,
        mimeType: req.file.mimetype,
        extension: path.extname(req.file.originalname).replace(".", ""),
        size: req.file.size,
        relationType: "ASSIGNMENT",
        relationId: assignment.id,
        assignmentId: assignment.id,
        uploadedById: req.user.id,
      },
    });
  }

  const full = await prisma.assignment.findUnique({
    where: { id: assignment.id },
    include: { files: true },
  });
  res.status(201).json(full);
};

export const createAnnouncement = async (req, res) => {
  const { title, content, departmentId } = req.body;
  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      authorId: req.user.id,
      departmentId: departmentId ? Number(departmentId) : null,
    },
  });

  if (req.file) {
    await prisma.fileUpload.create({
      data: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path,
        mimeType: req.file.mimetype,
        extension: path.extname(req.file.originalname).replace(".", ""),
        size: req.file.size,
        relationType: "ANNOUNCEMENT",
        relationId: announcement.id,
        announcementId: announcement.id,
        uploadedById: req.user.id,
      },
    });
  }

  const full = await prisma.announcement.findUnique({
    where: { id: announcement.id },
    include: { files: true },
  });
  res.status(201).json(full);
};

export const gradeStudent = async (req, res) => {
  const { assignmentId, enrollmentId, studentId, score, feedback } = req.body;
  const grade = await prisma.grade.upsert({
    where: {
      assignmentId_enrollmentId: {
        assignmentId: Number(assignmentId),
        enrollmentId: Number(enrollmentId),
      },
    },
    create: {
      assignmentId: Number(assignmentId),
      enrollmentId: Number(enrollmentId),
      studentId: Number(studentId),
      score: Number(score),
      feedback,
      gradedById: req.user.id,
    },
    update: {
      score: Number(score),
      feedback,
      gradedById: req.user.id,
      gradedAt: new Date(),
    },
  });
  res.json(grade);
};

export const assignStudentToClassAsHead = async (req, res) => {
  if (!hasAdminPrivileges(req.user)) {
    return res.status(403).json({ message: "Head of department access required" });
  }
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
