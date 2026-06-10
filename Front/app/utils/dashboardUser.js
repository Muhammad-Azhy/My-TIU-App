/**
 * Maps API user / profile objects into the shape expected by BigBox and similar widgets.
 */
export function toDashboardUser(userData) {
  if (!userData) {
    return {
      id: "--",
      name: "User",
      grade: "--",
      semester: "--",
      gpa: "--",
      department: "—",
      position: "—",
    };
  }
  const name =
    userData.name ||
    `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
    "User";
  return {
    id: String(userData.id ?? userData.student?.id ?? userData.lecturer?.id ?? "--"),
    name,
    grade:
      userData.grade != null
        ? String(userData.grade)
        : userData.student?.yearLevel != null
          ? String(userData.student.yearLevel)
          : "--",
    semester: userData.semester != null ? String(userData.semester) : "--",
    gpa: userData.gpa != null ? String(userData.gpa) : "--",
    department:
      userData.department ||
      userData.student?.department?.name ||
      userData.lecturer?.department?.name ||
      "—",
    position: userData.position || userData.lecturerRank || "—",
  };
}
