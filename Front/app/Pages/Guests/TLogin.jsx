import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { mS, rS, vS } from "../../Styles/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import { setUser, setAuthLoading, setAuthError } from "../../Redux/Slices/User/userSlice";
import useTheme from "../../Hooks/useTheme";
import { authApi, setApiToken, getApiErrorMessage } from "../../services/api";
import { saveAuth } from "../../services/authStorage";
import { extractAuthPayload } from "../../utils/authPayload";

const TLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    dispatch(setAuthLoading(true));
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });
      const payload = extractAuthPayload(response?.data);
      if (!payload?.token || !payload?.user) {
        const msg = "Unexpected response from server. Check API version.";
        setError(msg);
        dispatch(setAuthError(msg));
        return;
      }
      if (!payload.user.role) {
        const msg = "Account has no role assigned. Contact support.";
        setError(msg);
        dispatch(setAuthError(msg));
        return;
      }
      setApiToken(payload.token);
      await saveAuth({ token: payload.token, user: payload.user });
      dispatch(setUser({ token: payload.token, user: payload.user }));
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Login failed. Try again.");
      setError(message);
      dispatch(setAuthError(message));
    } finally {
      setLoading(false);
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={[styles.loginContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.inputContainer, { backgroundColor: theme.secondary }]}>
          <Text
            style={{
              marginVertical: mS(20),
              fontSize: mS(20),
              textAlign: "center",
              color: theme.textSec,
              fontWeight: "700",
            }}
          >
            TLogin
          </Text>
          <TextInput
            placeholder="example@std.tiu.edu.iq"
            placeholderTextColor={theme.subText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <Text style={{ color: theme.text, fontWeight: "bold" }}>Enter</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default TLogin;

const styles = StyleSheet.create({
  button: {
    borderRadius: vS(22),
    padding: 10,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  loginContainer: {
    flex: 1,
    padding: mS(30),
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    padding: mS(15),
    marginBottom: mS(15),
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: mS(20),
    gap: mS(5),
    padding: mS(20),
    justifyContent: "space-evenly",
    borderRadius: mS(20),
  },
  error: {
    color: "#ff1900ff",
    marginBottom: mS(15),
    textAlign: "center",
    fontSize: mS(13),
  },
});