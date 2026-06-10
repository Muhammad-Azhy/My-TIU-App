import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS, vS } from "../../Styles/responsive";
import { adminApi } from "../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import BackBar from "../../Components/ui/BackBar";

export default function AdminAssignEnrollment() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsResponse, classesResponse] = await Promise.all([
          adminApi.students(),
          adminApi.classes(),
        ]);
        setStudents(studentsResponse.data || []);
        setClasses(classesResponse.data || []);
      } catch (apiError) {
        setError(
          apiError?.response?.data?.message || "Failed to load students/classes.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const fullName = `${s.user?.firstName ?? ""} ${s.user?.lastName ?? ""}`.toLowerCase();
      const num = (s.studentNumber ?? "").toLowerCase();
      return fullName.includes(q) || num.includes(q);
    });
  }, [students, studentSearch]);

  const filteredClasses = useMemo(() => {
    const q = classSearch.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => {
      const label = `${c.course?.code ?? ""} ${c.course?.title ?? ""} ${c.semester ?? ""} ${c.section ?? ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [classes, classSearch]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId],
  );

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId],
  );

  const assign = async () => {
    if (!selectedStudentId || !selectedClassId) {
      setError("Select both a student and a class.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await adminApi.assignStudentToClass({
        studentId: selectedStudentId,
        classId: selectedClassId,
      });
      setSuccess("Student assigned successfully!");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Could not assign student to class.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render helpers ─────────────────────────────────────────── */

  const renderStudentItem = ({ item: student }) => {
    const active = selectedStudentId === student.id;
    return (
      <TouchableOpacity
        style={[
          styles.optionCard,
          {
            backgroundColor: active ? theme.primary + "18" : theme.background,
            borderColor: active ? theme.primary : theme.border,
          },
        ]}
        onPress={() => setSelectedStudentId(active ? null : student.id)}
        activeOpacity={0.75}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + "33" }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {student.user?.firstName?.[0] ?? "?"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>
              {student.user?.firstName} {student.user?.lastName}
            </Text>
            <Text style={[styles.optionMeta, { color: theme.subText }]}>
              {student.studentNumber}
              {student.department?.name ? `  •  ${student.department.name}` : ""}
            </Text>
          </View>
        </View>
        {active && <Icon name="check-circle" size={mS(18)} color={theme.primary} />}
      </TouchableOpacity>
    );
  };

  const renderClassItem = ({ item }) => {
    const active = selectedClassId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.optionCard,
          {
            backgroundColor: active ? theme.primary + "18" : theme.background,
            borderColor: active ? theme.primary : theme.border,
          },
        ]}
        onPress={() => setSelectedClassId(active ? null : item.id)}
        activeOpacity={0.75}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.avatar, { backgroundColor: "#3A7BD522" }]}>
            <Icon name="menu-book" size={mS(16)} color="#3A7BD5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>
              {item.course?.code}  —  {item.course?.title}
            </Text>
            <Text style={[styles.optionMeta, { color: theme.subText }]}>
              {item.semester}  •  Sec {item.section}
              {item.room ? `  •  ${item.room}` : ""}
            </Text>
          </View>
        </View>
        {active && <Icon name="check-circle" size={mS(18)} color={theme.primary} />}
      </TouchableOpacity>
    );
  };

  /* ── Main render ────────────────────────────────────────────── */

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <BackBar title="Assign Enrollment" />

      {/* Two-column panel row */}
      <View style={styles.panelRow}>
        {/* LEFT PANEL – Students */}
        <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <View style={[styles.sectionNumBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionNum}>1</Text>
            </View>
            <Text style={[styles.panelTitle, { color: theme.text }]}>Student</Text>
          </View>

          <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Icon name="search" size={mS(16)} color={theme.subText} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search students…"
              placeholderTextColor={theme.subText}
              value={studentSearch}
              onChangeText={setStudentSearch}
              autoCapitalize="none"
            />
            {studentSearch.length > 0 && (
              <TouchableOpacity onPress={() => setStudentSearch("")} hitSlop={8}>
                <Icon name="close" size={mS(14)} color={theme.subText} />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: vS(24) }} />
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(s) => String(s.id)}
              renderItem={renderStudentItem}
              style={styles.list}
              ListEmptyComponent={
                <Text style={[styles.emptyNote, { color: theme.subText }]}>
                  {studentSearch ? "No match." : "No students."}
                </Text>
              }
            />
          )}
        </View>

        {/* RIGHT PANEL – Courses / Classes */}
        <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <View style={[styles.sectionNumBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionNum}>2</Text>
            </View>
            <Text style={[styles.panelTitle, { color: theme.text }]}>Course / Class</Text>
          </View>

          <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Icon name="search" size={mS(16)} color={theme.subText} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search courses…"
              placeholderTextColor={theme.subText}
              value={classSearch}
              onChangeText={setClassSearch}
              autoCapitalize="none"
            />
            {classSearch.length > 0 && (
              <TouchableOpacity onPress={() => setClassSearch("")} hitSlop={8}>
                <Icon name="close" size={mS(14)} color={theme.subText} />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: vS(24) }} />
          ) : (
            <FlatList
              data={filteredClasses}
              keyExtractor={(c) => String(c.id)}
              renderItem={renderClassItem}
              style={styles.list}
              ListEmptyComponent={
                <Text style={[styles.emptyNote, { color: theme.subText }]}>
                  {classSearch ? "No match." : "No classes."}
                </Text>
              }
            />
          )}
        </View>
      </View>

      {/* ── Bottom bar: summary + assign button ─────────────────── */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.summaryRow}>
          <Icon name="person" size={mS(15)} color={theme.subText} />
          <Text style={[styles.summaryText, { color: theme.text }]} numberOfLines={1}>
            {selectedStudent
              ? `${selectedStudent.user?.firstName} ${selectedStudent.user?.lastName}`
              : "—"}
          </Text>

          <Icon name="arrow-forward" size={mS(14)} color={theme.subText} style={{ marginHorizontal: rS(6) }} />

          <Icon name="menu-book" size={mS(15)} color={theme.subText} />
          <Text style={[styles.summaryText, { color: theme.text }]} numberOfLines={1}>
            {selectedClass
              ? `${selectedClass.course?.code} (Sec ${selectedClass.section})`
              : "—"}
          </Text>
        </View>

        {error ? (
          <Text style={styles.errText}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={styles.okText}>{success}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary },
            (!selectedStudentId || !selectedClassId || submitting) && { opacity: 0.45 },
          ]}
          onPress={assign}
          disabled={submitting || !selectedStudentId || !selectedClassId}
        >
          {submitting ? (
            <ActivityIndicator color="#1a1a1a" />
          ) : (
            <Text style={styles.buttonText}>Assign</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: rS(12), paddingBottom: 0 },
  title: { fontSize: mS(22), fontWeight: "700", marginBottom: rS(10), paddingHorizontal: rS(4) },

  /* Two-column panels */
  panelRow: {
    flex: 1,
    flexDirection: "row",
    gap: rS(10),
  },
  panel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: rS(14),
    padding: rS(10),
    overflow: "hidden",
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(8),
    marginBottom: rS(8),
  },
  panelTitle: { fontSize: mS(15), fontWeight: "700" },
  sectionNumBadge: {
    width: rS(24),
    height: rS(24),
    borderRadius: rS(12),
    justifyContent: "center",
    alignItems: "center",
  },
  sectionNum: { color: "#1a1a1a", fontWeight: "800", fontSize: mS(12) },

  /* Search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rS(10),
    paddingHorizontal: rS(8),
    paddingVertical: vS(6),
    marginBottom: rS(6),
    gap: rS(6),
  },
  searchInput: { flex: 1, fontSize: mS(13) },

  /* Scrollable list inside panel */
  list: { flex: 1 },

  /* Option cards */
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(10),
    marginBottom: rS(6),
  },
  optionLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: rS(8) },
  avatar: {
    width: rS(30),
    height: rS(30),
    borderRadius: rS(15),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: mS(14), fontWeight: "700" },
  optionTitle: { fontSize: mS(13), fontWeight: "600" },
  optionMeta: { fontSize: mS(11), marginTop: vS(1) },

  /* Bottom bar */
  bottomBar: {
    borderTopWidth: 1,
    padding: rS(10),
    marginHorizontal: -rS(12),
    paddingHorizontal: rS(16),
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(4),
    marginBottom: rS(6),
  },
  summaryText: { fontSize: mS(13), flexShrink: 1 },
  errText: { color: "#c43d3d", fontSize: mS(12), marginBottom: rS(4) },
  okText: { color: "#2e9e55", fontSize: mS(12), marginBottom: rS(4) },
  button: {
    borderRadius: rS(10),
    paddingVertical: rS(12),
    alignItems: "center",
  },
  buttonText: { fontSize: mS(15), fontWeight: "700", color: "#1a1a1a" },

  emptyNote: { fontSize: mS(13), textAlign: "center", marginTop: rS(12) },
});
