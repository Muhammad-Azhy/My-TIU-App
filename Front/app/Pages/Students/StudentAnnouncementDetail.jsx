import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS, vS } from "../../Styles/responsive";
import Icon from "react-native-vector-icons/MaterialIcons";
import BackBar from "../../Components/ui/BackBar";
import { getUploadsBaseUrl, studentApi } from "../../services/api";

const UPLOADS_BASE = getUploadsBaseUrl();

function FileItem({ file, theme }) {
  const handleOpen = async () => {
    // Try serving from /uploads/ static path first (no auth required for simplicity)
    const url = `${UPLOADS_BASE}/uploads/${file.storedName}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Cannot open file", `No app found to open this file type (.${file.extension || "file"}).`);
      }
    } catch {
      Alert.alert("Error", "Failed to open the attachment.");
    }
  };

  const iconName = (() => {
    const ext = (file.extension || "").toLowerCase();
    if (["pdf"].includes(ext)) return "picture-as-pdf";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["doc", "docx"].includes(ext)) return "description";
    if (["xls", "xlsx"].includes(ext)) return "table-chart";
    if (["zip", "rar"].includes(ext)) return "folder-zip";
    return "attach-file";
  })();

  const sizeLabel = file.size
    ? file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`
    : "";

  return (
    <TouchableOpacity
      style={[styles.fileCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={handleOpen}
      activeOpacity={0.75}
    >
      <View style={[styles.fileIconWrap, { backgroundColor: theme.primary + "22" }]}>
        <Icon name={iconName} size={mS(22)} color={theme.primary} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
          {file.originalName}
        </Text>
        {sizeLabel ? (
          <Text style={[styles.fileMeta, { color: theme.subText }]}>{sizeLabel}</Text>
        ) : null}
      </View>
      <Icon name="open-in-new" size={mS(18)} color={theme.subText} />
    </TouchableOpacity>
  );
}

export default function StudentAnnouncementDetail({ route }) {
  const { announcementId, title, body, date, files } = route.params || {};
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const attachments = Array.isArray(files) ? files : [];

  // Record view when this screen is opened
  useEffect(() => {
    if (announcementId) {
      studentApi
        .recordView({ contentType: "announcement", contentId: announcementId })
        .catch((err) => {
          if (__DEV__) console.warn("[View] Failed to record announcement view:", err?.message);
        });
    }
  }, [announcementId]);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <BackBar title="Announcement" />
      <Text style={[styles.date, { color: theme.subText }]}>{date}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.text }]}>{body}</Text>

      {attachments.length > 0 ? (
        <View style={styles.attachSection}>
          <View style={styles.attachHeader}>
            <Icon name="attach-file" size={mS(16)} color={theme.subText} />
            <Text style={[styles.attachLabel, { color: theme.subText }]}>
              {attachments.length} Attachment{attachments.length !== 1 ? "s" : ""}
            </Text>
          </View>
          {attachments.map((f) => (
            <FileItem key={String(f.id)} file={f} theme={theme} />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(40) },
  date: { fontSize: mS(12), marginBottom: rS(6), fontWeight: "500" },
  title: {
    fontSize: mS(22),
    fontWeight: "bold",
    marginBottom: rS(14),
    lineHeight: mS(30),
  },
  body: { fontSize: mS(15), lineHeight: mS(24), marginBottom: rS(24) },
  attachSection: { marginTop: rS(4) },
  attachHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rS(10),
    gap: rS(4),
  },
  attachLabel: {
    fontSize: mS(13),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rS(12),
    padding: rS(12),
    marginBottom: rS(8),
    gap: rS(12),
  },
  fileIconWrap: {
    width: rS(40),
    height: rS(40),
    borderRadius: rS(10),
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: { flex: 1 },
  fileName: { fontSize: mS(14), fontWeight: "600" },
  fileMeta: { fontSize: mS(11), marginTop: vS(2) },
});
