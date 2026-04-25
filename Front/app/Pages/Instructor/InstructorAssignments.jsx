import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS } from "../../Styles/responsive";
import { lecturerApi } from "../../services/api";

export default function InstructorAssignments() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pickedFile, setPickedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [classesResponse, assignmentsResponse] = await Promise.all([
        lecturerApi.classes(),
        lecturerApi.assignments(),
      ]);
      setClasses(classesResponse.data || []);
      setAssignments(assignmentsResponse.data || []);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Failed to load classes/assignments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/*",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets?.length) {
      setPickedFile(result.assets[0]);
    }
  };

  const submitAssignment = async () => {
    if (!selectedClassId || !title.trim()) {
      setError("Class and title are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("classId", String(selectedClassId));
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("dueDate", dueDate.trim());

      if (pickedFile) {
        formData.append("file", {
          uri: pickedFile.uri,
          name: pickedFile.name || `assignment-${Date.now()}.pdf`,
          type: pickedFile.mimeType || "application/octet-stream",
        });
      }

      await lecturerApi.createAssignment(formData);
      setSuccess("Assignment created successfully.");
      setTitle("");
      setDescription("");
      setDueDate("");
      setPickedFile(null);
      await loadData();
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Failed to create assignment.",
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
      <Text style={[styles.title, { color: theme.text }]}>Assignments</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <Text style={[styles.label, { color: theme.subText }]}>
            Select class
          </Text>
          {classes.map((item) => {
            const active = selectedClassId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.choice,
                  {
                    backgroundColor: theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedClassId(item.id)}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {item.course?.code} - {item.course?.title}
                </Text>
                <Text style={{ color: theme.subText, marginTop: 4 }}>
                  {item.semester} • Section {item.section}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TextInput
            placeholder="Assignment title"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
            ]}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Description"
            placeholderTextColor={theme.subText}
            multiline
            style={[
              styles.inputArea,
              { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
            ]}
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            placeholder="Due date (YYYY-MM-DD)"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
            ]}
            value={dueDate}
            onChangeText={setDueDate}
          />

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={pickFile}
          >
            <Text style={{ color: theme.text }}>
              {pickedFile ? `File: ${pickedFile.name}` : "Select file (PDF/Word/Image)"}
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={submitAssignment}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Submitting..." : "Create Assignment"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Existing assignments
          </Text>
          {assignments.length === 0 ? (
            <Text style={{ color: theme.subText }}>No assignments yet.</Text>
          ) : (
            assignments.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {item.title}
                </Text>
                <Text style={{ color: theme.subText }}>
                  {item.classOffering?.course?.code} • Section {item.classOffering?.section}
                </Text>
                <Text style={{ color: theme.subText }}>
                  Due:{" "}
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"}
                </Text>
                <Text style={{ color: theme.subText }}>
                  Attachments: {item.files?.length || 0}
                </Text>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(30) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(12) },
  label: { marginBottom: rS(8), fontSize: mS(14) },
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
    marginTop: rS(8),
    marginBottom: rS(8),
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    minHeight: rS(110),
    marginBottom: rS(8),
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(12),
  },
  button: {
    borderRadius: rS(10),
    paddingVertical: rS(14),
    alignItems: "center",
    marginBottom: rS(16),
  },
  buttonText: { fontSize: mS(16), fontWeight: "700", color: "#1a1a1a" },
  sectionTitle: { fontSize: mS(18), fontWeight: "700", marginBottom: rS(10) },
  card: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    marginBottom: rS(8),
  },
  cardTitle: { fontSize: mS(15), fontWeight: "600", marginBottom: rS(4) },
  error: { color: "#c43d3d", marginBottom: rS(8) },
  success: { color: "#2f9f59", marginBottom: rS(8) },
});
