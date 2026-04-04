import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darkTheme, lightTheme } from "../../Styles/theme";
import { rS, mS, vS } from "../../Styles/responsive";

export default function InstructorPostAnnouncement({ navigation }) {
  const mode = useSelector((s) => s.theme.mode);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachmentNote, setAttachmentNote] = useState("");

  const submit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Please enter a title and message body.");
      return;
    }
    Alert.alert(
      "Sent (demo)",
      "Announcement would be published when the API is connected.",
      [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setContent("");
            setAttachmentNote("");
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      enableOnAndroid
      extraScrollHeight={vS(24)}
    >
      <Text style={[styles.heading, { color: theme.text }]}>
        New announcement
      </Text>
      <Text style={[styles.hint, { color: theme.subText }]}>
        Students in your department/year filters will see this once the backend
        is wired.
      </Text>

      <Text style={[styles.label, { color: theme.subText }]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Midterm room change"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
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
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>
        Attachment (optional)
      </Text>
      <TextInput
        value={attachmentNote}
        onChangeText={setAttachmentNote}
        placeholder="e.g. Link or file name — upload UI later"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={submit}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Publish (demo)</Text>
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
