import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS } from "../../Styles/responsive";
import { adminApi } from "../../services/api";

export default function AdminAssignEnrollment() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
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

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId),
    [students, selectedStudentId],
  );

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId),
    [classes, selectedClassId],
  );

  const assign = async () => {
    if (!selectedStudentId || !selectedClassId) {
      setError("Select both student and class.");
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
      setSuccess("Student assigned successfully.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Could not assign student to class.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Assign Students to Class
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            Choose student
          </Text>
          {students.map((student) => {
            const active = selectedStudentId === student.id;
            return (
              <TouchableOpacity
                key={student.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedStudentId(student.id)}
              >
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  {student.user?.firstName} {student.user?.lastName}
                </Text>
                <Text style={[styles.optionMeta, { color: theme.subText }]}>
                  {student.studentNumber} {student.department?.name ? `• ${student.department.name}` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            Choose class
          </Text>
          {classes.map((item) => {
            const active = selectedClassId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedClassId(item.id)}
              >
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  {item.course?.code} - {item.course?.title}
                </Text>
                <Text style={[styles.optionMeta, { color: theme.subText }]}>
                  {item.semester} • Section {item.section}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <View style={[styles.summary, { backgroundColor: theme.card }]}>
        <Text style={[styles.summaryText, { color: theme.text }]}>
          Student:{" "}
          {selectedStudent
            ? `${selectedStudent.user?.firstName} ${selectedStudent.user?.lastName}`
            : "Not selected"}
        </Text>
        <Text style={[styles.summaryText, { color: theme.text }]}>
          Class:{" "}
          {selectedClass
            ? `${selectedClass.course?.code} (Section ${selectedClass.section})`
            : "Not selected"}
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={assign}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Assigning..." : "Assign"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(14) },
  sectionTitle: { fontSize: mS(14), marginBottom: rS(8), marginTop: rS(8) },
  optionCard: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  optionTitle: { fontSize: mS(15), fontWeight: "600" },
  optionMeta: { fontSize: mS(12), marginTop: rS(4) },
  summary: { borderRadius: rS(10), padding: rS(12), marginVertical: rS(12) },
  summaryText: { fontSize: mS(14), marginBottom: rS(4) },
  button: {
    borderRadius: rS(12),
    paddingVertical: rS(14),
    alignItems: "center",
  },
  buttonText: { fontSize: mS(16), fontWeight: "700", color: "#1a1a1a" },
  error: { color: "#c43d3d", marginBottom: rS(10) },
  success: { color: "#2e9e55", marginBottom: rS(10) },
});
