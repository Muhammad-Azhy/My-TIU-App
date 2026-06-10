import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS } from "../../Styles/responsive";
import { lecturerApi } from "../../services/api";

export default function InstructorGradeStudents() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await lecturerApi.assignments();
        setAssignments(response.data || []);
      } catch (apiError) {
        setError(
          apiError?.response?.data?.message || "Failed to load assignment data.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const enrollmentOptions = selectedAssignment?.classOffering?.enrollments || [];
  const selectedEnrollment = enrollmentOptions.find(
    (enrollment) => enrollment.id === selectedEnrollmentId,
  );

  const submitGrade = async () => {
    if (!selectedAssignment || !selectedEnrollment || !score.trim()) {
      setError("Assignment, student, and score are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await lecturerApi.gradeStudent({
        assignmentId: selectedAssignment.id,
        enrollmentId: selectedEnrollment.id,
        studentId: selectedEnrollment.studentId,
        score: Number(score),
        feedback: feedback.trim(),
      });
      setSuccess("Grade saved successfully.");
      setScore("");
      setFeedback("");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to submit grade.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Grade Students</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <Text style={[styles.label, { color: theme.subText }]}>
            Select assignment
          </Text>
          {assignments.map((assignment) => {
            const active = selectedAssignmentId === assignment.id;
            return (
              <TouchableOpacity
                key={assignment.id}
                style={[
                  styles.choice,
                  {
                    backgroundColor: theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedAssignmentId(assignment.id);
                  setSelectedEnrollmentId(null);
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {assignment.title}
                </Text>
                <Text style={{ color: theme.subText }}>
                  {assignment.classOffering?.course?.code} • Section {assignment.classOffering?.section}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.label, { color: theme.subText }]}>
            Select student
          </Text>
          {enrollmentOptions.length === 0 ? (
            <Text style={{ color: theme.subText, marginBottom: rS(8) }}>
              No enrolled students for this assignment.
            </Text>
          ) : (
            enrollmentOptions.map((enrollment) => {
              const active = selectedEnrollmentId === enrollment.id;
              return (
                <TouchableOpacity
                  key={enrollment.id}
                  style={[
                    styles.choice,
                    {
                      backgroundColor: theme.card,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedEnrollmentId(enrollment.id)}
                >
                  <Text style={{ color: theme.text, fontWeight: "600" }}>
                    {enrollment.student?.user?.firstName} {enrollment.student?.user?.lastName}
                  </Text>
                  <Text style={{ color: theme.subText }}>
                    {enrollment.student?.studentNumber}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}

          <TextInput
            placeholder="Score"
            keyboardType="numeric"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            value={score}
            onChangeText={setScore}
          />

          <TextInput
            placeholder="Feedback"
            multiline
            placeholderTextColor={theme.subText}
            style={[
              styles.inputArea,
              {
                color: theme.text,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            value={feedback}
            onChangeText={setFeedback}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={submitGrade}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Saving..." : "Submit Grade"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(32) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(10) },
  label: { fontSize: mS(14), marginBottom: rS(8), marginTop: rS(8) },
  choice: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  input: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    minHeight: rS(100),
    marginBottom: rS(8),
  },
  button: {
    borderRadius: rS(10),
    paddingVertical: rS(14),
    alignItems: "center",
    marginTop: rS(4),
  },
  buttonText: { color: "#1a1a1a", fontSize: mS(16), fontWeight: "700" },
  error: { color: "#c43d3d", marginBottom: rS(8) },
  success: { color: "#2f9f59", marginBottom: rS(8) },
});
