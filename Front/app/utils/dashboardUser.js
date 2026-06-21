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

  // For students: show studentNumber as ID; for lecturers: show employeeId
  const displayId = (() => {
    if (userData.student?.studentNumber) return userData.student.studentNumber;
    if (userData.lecturer?.employeeId) return userData.lecturer.employeeId;
    return String(userData.id ?? "--");
  })();

  // Grade maps to yearLevel (e.g. year 1, 2, 3, 4)
  const grade = (() => {
    if (userData.grade != null) return String(userData.grade);
    if (userData.student?.yearLevel != null) return String(userData.student.yearLevel);
    return "--";
  })();

  // Semester comes from the new currentSemester field on Student
  const semester = (() => {
    if (userData.semester != null) return String(userData.semester);
    if (userData.student?.currentSemester != null) return String(userData.student.currentSemester);
    return "--";
  })();

  // GPA comes from the new gpa field on Student
  const gpa = (() => {
    if (userData.gpa != null) return String(userData.gpa);
    if (userData.student?.gpa != null) return String(userData.student.gpa);
    return "--";
  })();

  return {
    id: displayId,
    name,
    grade,
    semester,
    gpa,
    department:
      userData.department ||
      userData.student?.department?.name ||
      userData.lecturer?.department?.name ||
      "—",
    position: userData.position || userData.lecturer?.rank || userData.lecturerRank || "—",
  };
}
