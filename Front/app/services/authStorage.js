import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "mytiu_token";
const USER_KEY = "mytiu_user";
const AUTH_KEYS = [TOKEN_KEY, USER_KEY];

async function getStorageEntries(keys) {
  if (typeof AsyncStorage.getMany === "function") {
    const entries = await AsyncStorage.getMany(keys);
    return keys.map((key) => [key, entries[key] ?? null]);
  }
  if (typeof AsyncStorage.multiGet === "function") {
    return AsyncStorage.multiGet(keys);
  }
  const values = await Promise.all(keys.map((key) => AsyncStorage.getItem(key)));
  return keys.map((key, index) => [key, values[index]]);
}

async function removeStorageKeys(keys) {
  if (typeof AsyncStorage.removeMany === "function") {
    await AsyncStorage.removeMany(keys);
    return;
  }
  if (typeof AsyncStorage.multiRemove === "function") {
    await AsyncStorage.multiRemove(keys);
    return;
  }
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}

export const saveAuth = async ({ token, user }) => {
  await AsyncStorage.setItem(TOKEN_KEY, token || "");
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user || null));
};

export const clearAuth = async () => {
  await removeStorageKeys(AUTH_KEYS);
};

export const readAuth = async () => {
  try {
    const [[, token], [, userRaw]] = await getStorageEntries(AUTH_KEYS);
    if (!userRaw) {
      return { token: token || null, user: null };
    }
    try {
      const user = JSON.parse(userRaw);
      return { token: token || null, user };
    } catch {
      await clearAuth();
      return { token: null, user: null };
    }
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("[AUTH] readAuth failed", error?.message || error);
    }
    return { token: null, user: null };
  }
};
