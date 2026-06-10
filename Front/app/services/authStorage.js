import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "mytiu_token";
const USER_KEY = "mytiu_user";

export const saveAuth = async ({ token, user }) => {
  await AsyncStorage.setItem(TOKEN_KEY, token || "");
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user || null));
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};

export const readAuth = async () => {
  try {
    const [[, token], [, userRaw]] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      USER_KEY,
    ]);
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
