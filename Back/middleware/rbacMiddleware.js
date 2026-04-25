export const hasAdminPrivileges = (user) =>
  user?.role === "ADMIN" ||
  (user?.role === "LECTURER" && user?.lecturer?.rank === "HEAD_OF_DEPARTMENT");

export const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

export const requireAdminOrHead = (req, res, next) => {
  if (!hasAdminPrivileges(req.user)) {
    return res
      .status(403)
      .json({ message: "Admin or head of department access is required" });
  }
  return next();
};
