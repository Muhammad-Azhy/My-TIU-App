import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as DocumentPicker from "expo-document-picker";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS, vS } from "../../Styles/responsive";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { lecturerApi } from "../../services/api";
import BackBar from "../../Components/ui/BackBar";

export default function InstructorPostAnnouncement({ navigation }) {
  useScreenPerformance("Instructor Post Announcement Screen");
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pickedFile, setPickedFile] = useState(null);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets?.length) {
      setPickedFile(result.assets[0]);
    }
  };

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Please enter a title and message body.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (pickedFile) {
        if (Platform.OS === "web") {
          const resp = await fetch(pickedFile.uri);
          const blob = await resp.blob();
          const fileName = pickedFile.name || `announcement-${Date.now()}`;
          const file = new File([blob], fileName, {
            type: pickedFile.mimeType || blob.type || "application/octet-stream",
          });
          formData.append("file", file);
        } else {
          formData.append("file", {
            uri: pickedFile.uri,
            name: pickedFile.name || `announcement-${Date.now()}.pdf`,
            type: pickedFile.mimeType || "application/octet-stream",
          });
        }
      }
      await lecturerApi.createAnnouncement(formData);
      Alert.alert("Success", "Announcement published.");
      setTitle("");
      setContent("");
      setPickedFile(null);
      navigation.goBack();
    } catch (apiError) {
      Alert.alert(
        "Failed",
        apiError?.response?.data?.message || "Could not publish announcement.",
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      enableOnAndroid
      extraScrollHeight={vS(24)}
    >
      <BackBar title="New Announcement" />
      <Text style={[styles.hint, { color: theme.subText }]}>
        Publish announcements for your students.
      </Text>

      <Text style={[styles.label, { color: theme.subText }]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Midterm room change"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>Message</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write the announcement…"
        placeholderTextColor={theme.subText}
        multiline
        textAlignVertical="top"
        style={[
          styles.inputArea,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>
        Attachment (optional)
      </Text>
      <TouchableOpacity
        onPress={pickFile}
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={{ color: theme.text }}>
          {pickedFile ? `Selected: ${pickedFile.name}` : "Select file"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={submit}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Publish</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(40) },
  heading: { fontSize: mS(22), fontWeight: "bold", marginBottom: rS(8) },
  hint: { fontSize: mS(14), marginBottom: rS(20), lineHeight: mS(20) },
  label: { fontSize: mS(13), marginBottom: rS(6), marginTop: rS(12) },
  input: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    fontSize: mS(16),
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: rS(10),
    padding: rS(12),
    fontSize: mS(16),
    minHeight: vS(140),
  },
  button: {
    marginTop: rS(24),
    paddingVertical: rS(14),
    borderRadius: rS(12),
    alignItems: "center",
  },
  buttonText: {
    color: "#1a1a1a",
    fontSize: mS(16),
    fontWeight: "700",
  },
});
