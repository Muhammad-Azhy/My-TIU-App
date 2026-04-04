import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darkTheme, lightTheme } from "../../Styles/theme";
import {
  addManagedNews,
  updateManagedNews,
} from "../../Redux/Slices/Admin/adminSlice";
import { rS, mS, vS } from "../../Styles/responsive";

export default function AdminNewsForm({ navigation, route }) {
  const itemId = route.params?.itemId;
  const mode = useSelector((s) => s.theme.mode);
  const items = useSelector((s) => s.admin.managedNews);
  const dispatch = useDispatch();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const existing = useMemo(
    () => items.find((n) => n.id === itemId),
    [items, itemId]
  );

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [departmentLabel, setDepartmentLabel] = useState(
    existing?.departmentLabel ?? "Global"
  );

  useEffect(() => {
    if (!itemId) {
      setTitle("");
      setContent("");
      setDepartmentLabel("Global");
      return;
    }
    const item = items.find((n) => n.id === itemId);
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setDepartmentLabel(item.departmentLabel ?? "Global");
    }
  }, [itemId, items]);

  const save = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Title and content are required.");
      return;
    }
    if (existing) {
      dispatch(
        updateManagedNews({
          id: existing.id,
          title,
          content,
          departmentLabel,
        })
      );
    } else {
      dispatch(addManagedNews({ title, content, departmentLabel }));
    }
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      enableOnAndroid
      extraScrollHeight={vS(24)}
    >
      <Text style={[styles.heading, { color: theme.text }]}>
        {existing ? "Edit news" : "New news"}
      </Text>

      <Text style={[styles.label, { color: theme.subText }]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Headline"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Body text"
        placeholderTextColor={theme.subText}
        multiline
        textAlignVertical="top"
        style={[
          styles.inputArea,
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      />

      <Text style={[styles.label, { color: theme.subText }]}>
        Department tag
      </Text>
      <TextInput
        value={departmentLabel}
        onChangeText={setDepartmentLabel}
        placeholder="Global, CMPE, …"
        placeholderTextColor={theme.subText}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={save}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: rS(16), paddingBottom: rS(40) },
  heading: { fontSize: mS(22), fontWeight: "bold", marginBottom: rS(16) },
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
    minHeight: vS(160),
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
