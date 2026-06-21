import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKENS_KEY = "mytiu_push_tokens";

export async function savePushTokens(tokens) {
  const list = (tokens || []).filter(Boolean);
  if (!list.length) return;
  await AsyncStorage.setItem(PUSH_TOKENS_KEY, JSON.stringify(list));
}

export async function readPushTokens() {
  try {
    const raw = await AsyncStorage.getItem(PUSH_TOKENS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function clearPushTokens() {
  await AsyncStorage.removeItem(PUSH_TOKENS_KEY);
}
