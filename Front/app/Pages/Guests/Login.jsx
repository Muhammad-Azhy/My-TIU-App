import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Logo from "../../../assets/TIU.webp";
import { mS, rS, vS } from "../../Styles/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import {
  setAuthError,
  setAuthLoading,
  setUser,
} from "../../Redux/Slices/User/userSlice";
import useScreenPerformance from "../../Hooks/useScreenPerformance";
import { authApi, setApiToken } from "../../services/api";
import { clearAuth, saveAuth } from "../../services/authStorage";

const Login = () => {
  useScreenPerformance("Login Screen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    console.log("[LOGIN] submit", {
      hasEmail: Boolean(email.trim()),
      hasPassword: Boolean(password.trim()),
    });
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "f8db7c",
      },
      body: JSON.stringify({
        sessionId: "f8db7c",
        runId: "initial",
        hypothesisId: "H5",
        location: "Pages/Guests/Login.jsx:handleLogin-start",
        message: "Login submit invoked",
        data: {
          hasEmail: Boolean(email.trim()),
          hasPassword: Boolean(password.trim()),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
      console.log("[LOGIN] success", {
        status: response.status,
        role: response?.data?.user?.role,
      });
      const { token, user } = response.data;
      setApiToken(token);
      await saveAuth({ token, user });
      dispatch(setUser({ token, user }));
    } catch (apiError) {
      console.error("[LOGIN] failed", {
        status: apiError?.response?.status || null,
        message: apiError?.message || "unknown",
      });
      // #region agent log
      fetch(
        "http://127.0.0.1:7577/ingest/8ac24eb4-5f94-4dbf-a6b4-b2fa5097aca3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "f8db7c",
          },
          body: JSON.stringify({
            sessionId: "f8db7c",
            runId: "initial",
            hypothesisId: "H2-H3-H4",
            location: "Pages/Guests/Login.jsx:handleLogin-catch",
            message: "Login failed in UI catch",
            data: {
              status: apiError?.response?.status || null,
              message: apiError?.message || "unknown",
            },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
      const message =
        apiError?.response?.data?.message || "Login failed. Try again.";
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
        <View style={styles.imageContainer}>
          <Image source={Logo} style={styles.image} />
        </View>

        <View style={styles.inputContainer}>
          <Text
            style={{
              marginVertical: mS(20),
              fontSize: mS(20),
              textAlign: "center",
            }}
          >
            Login
          </Text>
          <TextInput
            placeholder="example@std.tiu.edu.iq"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text>Enter</Text>
          </TouchableOpacity>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              margin: mS(20),
            }}
          />
          <TouchableOpacity style={styles.SkipButton} onPress={handleSkip}>
            <Text>Skip Login</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            position: "absolute",
            bottom: mS(10),
            alignSelf: "center",
            color: "#ccc",
            fontSize: mS(12),
            marginBottom: vS(10),
            textAlign: "center",
          }}
        >
          Copyright CC 2025 @Tisk International University
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  button: {
    backgroundColor: "#f2b136",
    borderRadius: vS(22),
    padding: 10,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
  },
  SkipButton: {
    backgroundColor: "#E0E0E0",
    color: "#555555",
    borderRadius: vS(22),
    padding: 10,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "flex-start", // spaces items equally from top to bottom
    padding: mS(30),
    backgroundColor: "#720e3dff",
  },
  loginTitle: {
    fontSize: mS(24),
    marginBottom: mS(40),
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: rS(150),
    height: vS(150),
    borderRadius: 20,
    alignSelf: "center",
    resizeMode: "cover",
  },
  imageContainer: {
    backgroundColor: "rgba(238, 238, 238, 1)",
    height: vS(140),
    width: rS(170),
    marginTop: vS(50),
    marginBottom: vS(40),
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#f9deb0",
    padding: mS(10),
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
    color: "red",
    marginBottom: mS(15),
    textAlign: "center",
  },
});
