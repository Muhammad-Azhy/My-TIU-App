import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { mS, rS, vS } from "../../Styles/responsive";
import { studentApi, getApiErrorMessage } from "../../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import BackBar from "../../Components/ui/BackBar";

// Files are served from /uploads/ (no /api prefix) — strip it if present.
const rawBase = process.env.EXPO_PUBLIC_API_BASE_URL_WEB || "http://localhost:3000/api";
const UPLOADS_BASE = rawBase.replace(/\/api$/, "");

function FileChip({ file, theme }) {
  const handleOpen = async () => {
    const url = `${UPLOADS_BASE}/uploads/${file.storedName}`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Cannot Open",
          `No handler found for .${file.extension || "file"} files.`,
        );
      }
    } catch {
      Alert.alert("Error", "Failed to open attachment.");
    }
  };

  const iconName = (() => {
    const ext = (file.extension || "").toLowerCase();
    if (ext === "pdf") return "picture-as-pdf";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["doc", "docx"].includes(ext)) return "description";
    if (["xls", "xlsx"].includes(ext)) return "table-chart";
    if (["zip", "rar"].includes(ext)) return "folder-zip";
    return "attach-file";
  })();

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={handleOpen}
      activeOpacity={0.75}
    >
      <Icon name={iconName} size={mS(14)} color={theme.primary} />
      <Text style={[styles.chipText, { color: theme.text }]} numberOfLines={1}>
        {file.originalName}
      </Text>
      <Icon name="open-in-new" size={mS(13)} color={theme.subText} />
    </TouchableOpacity>
  );
}

function AssignmentCard({ assignment, theme }) {
  const [expanded, setExpanded] = useState(false);

  const dueLabel = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();

  const files = Array.isArray(assignment.files) ? assignment.files : [];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        expanded && { borderColor: theme.primary },
      ]}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.82}
    >
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {assignment.title}
          </Text>
          <Text style={[styles.cardCourse, { color: theme.subText }]}>
            {assignment.classOffering?.course?.code}{" "}
            {assignment.classOffering?.course?.title
              ? `— ${assignment.classOffering.course.title}`
              : ""}
          </Text>
        </View>
        <Icon
          name={expanded ? "expand-less" : "expand-more"}
          size={mS(22)}
          color={theme.subText}
        />
      </View>

      {/* Due date badge */}
      <View style={styles.dueRow}>
        <Icon
          name="event"
          size={mS(13)}
          color={isOverdue ? "#c43d3d" : theme.subText}
        />
        <Text
          style={[
            styles.dueLabel,
            { color: isOverdue ? "#c43d3d" : theme.subText },
          ]}
        >
          Due: {dueLabel}
          {isOverdue ? "  (Overdue)" : ""}
        </Text>
      </View>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedBody}>
          {assignment.description ? (
            <Text style={[styles.description, { color: theme.text }]}>
              {assignment.description}
            </Text>
          ) : (
            <Text style={[styles.noDesc, { color: theme.subText }]}>
              No description provided.
            </Text>
          )}

          {files.length > 0 ? (
            <View style={styles.filesSection}>
              <View style={styles.filesHeader}>
                <Icon name="attach-file" size={mS(14)} color={theme.subText} />
                <Text style={[styles.filesLabel, { color: theme.subText }]}>
                  {files.length} Attachment{files.length !== 1 ? "s" : ""}
                </Text>
              </View>
              {files.map((f) => (
                <FileChip key={String(f.id)} file={f} theme={theme} />
              ))}
            </View>
          ) : (
            <Text style={[styles.noAttach, { color: theme.subText }]}>
              No attachments.
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function StudentAssignments() {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.assignments();
        setAssignments(response.data || []);
      } catch (apiError) {
        setAssignments([]);
        setError(getApiErrorMessage(apiError, "Failed to load assignments."));
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <BackBar title="Assignments" />
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : null}
      {error ? (
        <View style={[styles.errBox, { backgroundColor: "#c43d3d18", borderColor: "#c43d3d" }]}>
          <Icon name="error-outline" size={mS(16)} color="#c43d3d" />
          <Text style={{ color: "#c43d3d", fontSize: mS(13), flex: 1 }}>{error}</Text>
        </View>
      ) : null}
      {!loading && !error && assignments.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Icon name="assignment" size={mS(48)} color={theme.border} />
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            No assignments available.
          </Text>
        </View>
      ) : null}
      {assignments.map((a) => (
        <AssignmentCard key={a.id} assignment={a} theme={theme} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(40) },
  title: { fontSize: mS(24), fontWeight: "700", marginBottom: rS(14) },
  errBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(8),
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(10),
    marginBottom: rS(12),
  },
  emptyWrap: { alignItems: "center", marginTop: vS(40), gap: vS(12) },
  emptyText: { fontSize: mS(15) },

  // Card
  card: {
    borderWidth: 1,
    borderRadius: rS(14),
    padding: rS(14),
    marginBottom: rS(10),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: vS(6),
  },
  cardTitle: { fontSize: mS(15), fontWeight: "700", lineHeight: mS(22) },
  cardCourse: { fontSize: mS(12), marginTop: vS(2) },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: rS(4),
    marginTop: vS(2),
  },
  dueLabel: { fontSize: mS(12) },

  // Expanded
  expandedBody: { marginTop: vS(12), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#ddd", paddingTop: vS(10) },
  description: { fontSize: mS(14), lineHeight: mS(21), marginBottom: vS(10) },
  noDesc: { fontSize: mS(13), fontStyle: "italic", marginBottom: vS(10) },
  filesSection: { marginTop: vS(4) },
  filesHeader: { flexDirection: "row", alignItems: "center", gap: rS(4), marginBottom: vS(6) },
  filesLabel: { fontSize: mS(12), fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  noAttach: { fontSize: mS(13), fontStyle: "italic" },

  // File chip
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rS(8),
    paddingHorizontal: rS(10),
    paddingVertical: vS(7),
    marginBottom: vS(6),
    gap: rS(6),
  },
  chipText: { flex: 1, fontSize: mS(13) },
});
