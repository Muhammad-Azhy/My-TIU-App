import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

const TOKEN_PREFIX = "Bearer ";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith(TOKEN_PREFIX)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.slice(TOKEN_PREFIX.length).trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { lecturer: true, student: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
