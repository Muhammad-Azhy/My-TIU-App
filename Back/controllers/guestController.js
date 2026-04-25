import prisma from "../prisma/prismaClient.js";

export const listDepartments = async (_req, res) => {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });
  res.json(departments);
};

export const listAnnouncements = async (_req, res) => {
  const items = await prisma.announcement.findMany({
    include: {
      author: { select: { firstName: true, lastName: true } },
      files: true,
      department: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
};

export const listNews = async (_req, res) => {
  const items = await prisma.news.findMany({
    include: { author: { select: { firstName: true, lastName: true } }, department: true, files: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
};
