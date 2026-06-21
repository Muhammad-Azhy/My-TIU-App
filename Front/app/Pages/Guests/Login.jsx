import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import Logo from "../../../assets/image.png";
import Logo2 from "../../../assets/TIU.webp";

import { mS, rS, vS } from "../../Styles/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthError,
  setAuthLoading,
  setUser,
} from "../../Redux/Slices/User/userSlice";
import { fetchUserProfile } from "../../Redux/Slices/User/userAction";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { authApi, setApiToken, getApiErrorMessage } from "../../services/api";
import { clearAuth, saveAuth } from "../../services/authStorage";
import { extractAuthPayload } from "../../utils/authPayload";
import PressableScale from "../../Components/animations/PressableScale";
import FadeSlideIn from "../../Components/animations/FadeSlideIn";

const Login = () => {
  useScreenPerformance("Login Screen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const authLoading = useSelector((s) => s.user.loading);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    dispatch(setAuthError(null));
    dispatch(setAuthLoading(true));
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });
      const payload = extractAuthPayload(response?.data);
      if (!payload?.token || !payload?.user) {
        const msg =
          "Unexpected response from server (missing token or user). Check API version.";
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

      // Fetch enriched profile immediately (department, gpa, semester)
      dispatch(fetchUserProfile());
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Login failed. Try again.");
      setError(message);
      dispatch(setAuthError(message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const handleSkip = async () => {
    await clearAuth();
    setApiToken(null);
    dispatch(setUser({ token: null, user: { role: "GUEST" } }));
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.loginContainer}>
        <FadeSlideIn>
          <View style={styles.imageContainer}>
            <Image source={Logo} style={styles.image}  />
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={80}>
          <View style={styles.inputContainer}>
            <Text
              style={{
                marginVertical: mS(20),
                fontSize: mS(20),
                textAlign: "center",
                fontWeight: "700",
                color: "#333",
              }}
            >
              Sign in
            </Text>
            <TextInput
              placeholder="example@std.tiu.edu.iq"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!authLoading}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!authLoading}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PressableScale
              onPress={handleLogin}
              disabled={authLoading}
              style={[styles.button, authLoading && styles.buttonDisabled]}
            >
              {authLoading ? (
                <ActivityIndicator color="#333" />
              ) : (
                <Text style={styles.buttonLabel}>Enter</Text>
              )}
            </PressableScale>

            <View
              style={{
                borderBottomColor: "rgba(0,0,0,0.08)",
                borderBottomWidth: 1,
                margin: mS(20),
              }}
            />
            <PressableScale
              onPress={handleSkip}
              disabled={authLoading}
              style={styles.SkipButton}
            >
              <Text style={styles.skipLabel}>Continue as guest</Text>
            </PressableScale>
          </View>
        </FadeSlideIn>

        <Text
          style={{
            position: "absolute",
            bottom: mS(10),
            alignSelf: "center",
            color: "rgba(255,255,255,0.55)",
            fontSize: mS(12),
            marginBottom: vS(10),
            textAlign: "center",
          }}
        >
          Copyright © Tishk International University
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f2b136",
    borderRadius: vS(22),
    padding: 12,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontWeight: "700",
    color: "#333",
  },
  SkipButton: {
    backgroundColor: "#E8E8E8",
    borderRadius: vS(22),
    padding: 12,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
  },
  skipLabel: {
    color: "#444",
    fontWeight: "600",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "flex-start",
    padding: mS(30),
    backgroundColor: "#720e3dff",
  },
  image: {
    width: rS(130),
    aspectRatio: 1,
    borderRadius: 16,
    alignSelf: "center",
    resizeMode: "contain",
  },
  imageContainer: {
    backgroundColor: "rgba(238, 238, 238, 1)",
    width: rS(160),
    aspectRatio: 1,
    marginTop: vS(50),
    marginBottom: vS(40),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#f9deb0",
    padding: mS(12),
    marginBottom: mS(15),
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: mS(40),
    padding: mS(20),
    borderRadius: mS(20),
    backgroundColor: "rgba(238, 238, 238, 1)",
  },
  error: {
    color: "#b00020",
    marginBottom: mS(15),
    textAlign: "center",
    fontWeight: "500",
  },
});
