import prisma from "../prisma/prismaClient.js";
import { sendPushToUsers } from "./fcmService.js";

/**
 * Create notifications for a list of user IDs (deduplicated).
 * Also sends FCM push notifications to registered devices.
 */
export async function notifyUsers(userIds, { type, title, body, entityType, entityId }) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (!uniqueIds.length) return [];

  const result = await prisma.notification.createMany({
    data: uniqueIds.map((userId) => ({
      userId,
      type,
      title,
      body: body || null,
      entityType: entityType || null,
      entityId: entityId != null ? Number(entityId) : null,
    })),
  });

  // Also send FCM push (fire-and-forget)
  sendPushToUsers(uniqueIds, {
    title,
    body: body || "",
    data: {
      type: type || "",
      entityType: entityType || "",
      entityId: entityId != null ? String(entityId) : "",
    },
  }).catch((err) => console.error("[FCM] push failed for notifyUsers", err));

  return result;
}

export async function getStudentUserIdsInClass(classId) {
  const enrollments = await prisma.enrollment.findMany({
    where: { classId: Number(classId) },
    include: { student: { select: { userId: true } } },
  });
  return enrollments.map((e) => e.student.userId);
}

export async function getStudentUserIdsByDepartment(departmentId) {
  const students = await prisma.student.findMany({
    where: { departmentId: Number(departmentId) },
    select: { userId: true },
  });
  return students.map((s) => s.userId);
}

export async function getAllStudentUserIds() {
  const students = await prisma.student.findMany({ select: { userId: true } });
  return students.map((s) => s.userId);
}

export async function getAllLecturerUserIds() {
  const lecturers = await prisma.lecturer.findMany({ select: { userId: true } });
  return lecturers.map((l) => l.userId);
}

export async function getAllActiveUserIds(excludeRoles = ["GUEST"]) {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      role: { notIn: excludeRoles },
    },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

export async function notifyClassStudents(classId, payload) {
  const userIds = await getStudentUserIdsInClass(classId);
  return notifyUsers(userIds, payload);
}

export async function notifyDepartmentStudents(departmentId, payload) {
  const userIds = await getStudentUserIdsByDepartment(departmentId);
  return notifyUsers(userIds, payload);
}

export async function notifyAllStudents(payload) {
  const userIds = await getAllStudentUserIds();
  return notifyUsers(userIds, payload);
}

export async function notifyStudentUser(studentId, payload) {
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { userId: true },
  });
  if (!student) return null;
  return notifyUsers([student.userId], payload);
}

export async function notifyLecturerUser(lecturerId, payload) {
  const lecturer = await prisma.lecturer.findUnique({
    where: { id: Number(lecturerId) },
    select: { userId: true },
  });
  if (!lecturer) return null;
  return notifyUsers([lecturer.userId], payload);
}
