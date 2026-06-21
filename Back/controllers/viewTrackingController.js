import prisma from "../prisma/prismaClient.js";

/**
 * Record that a user viewed a piece of content.
 * POST /student/views  body: { contentType, contentId }
 */
export const recordView = async (req, res) => {
  try {
    const { contentType, contentId } = req.body;
    if (!contentType || !contentId) {
      return res.status(400).json({ message: "contentType and contentId are required" });
    }

    const validTypes = ["announcement", "assignment"];
    if (!validTypes.includes(contentType)) {
      return res.status(400).json({ message: `contentType must be one of: ${validTypes.join(", ")}` });
    }

    const view = await prisma.contentView.upsert({
      where: {
        userId_contentType_contentId: {
          userId: req.user.id,
          contentType,
          contentId: Number(contentId),
        },
      },
      create: {
        userId: req.user.id,
        studentId: req.user.student?.id || null,
        contentType,
        contentId: Number(contentId),
      },
      update: {
        viewedAt: new Date(),
      },
    });

    res.json(view);
  } catch (err) {
    console.error("[views] recordView", err);
    res.status(500).json({ message: "Failed to record view." });
  }
};

/**
 * Get view statistics for a piece of content.
 * GET /lecturer/view-stats/:contentType/:contentId
 * GET /admin/view-stats/:contentType/:contentId
 */
export const getViewStats = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const id = Number(contentId);

    // Count unique viewers
    const totalViews = await prisma.contentView.count({
      where: { contentType, contentId: id },
    });

    // Determine total expected audience
    let totalStudents = 0;

    if (contentType === "assignment") {
      // Students enrolled in the class that the assignment belongs to
      const assignment = await prisma.assignment.findUnique({
        where: { id },
        select: { classId: true },
      });
      if (assignment) {
        totalStudents = await prisma.enrollment.count({
          where: { classId: assignment.classId },
        });
      }
    } else if (contentType === "announcement") {
      // If announcement has a department, count department students; else all students
      const announcement = await prisma.announcement.findUnique({
        where: { id },
        select: { departmentId: true },
      });
      if (announcement?.departmentId) {
        totalStudents = await prisma.student.count({
          where: { departmentId: announcement.departmentId },
        });
      } else {
        totalStudents = await prisma.student.count();
      }
    }

    const percentViewed =
      totalStudents > 0 ? Math.round((totalViews / totalStudents) * 100) : 0;

    res.json({
      contentType,
      contentId: id,
      totalViews,
      totalStudents,
      percentViewed,
    });
  } catch (err) {
    console.error("[views] getViewStats", err);
    res.status(500).json({ message: "Failed to load view stats." });
  }
};
