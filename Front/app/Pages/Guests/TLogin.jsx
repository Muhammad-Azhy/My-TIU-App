import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { mS, rS, vS } from "../../Styles/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import { setRole } from "../../Redux/Slices/User/userSlice";
import useTheme from "../../Hooks/useTheme";

const Login = ({ onLogin, onSkip }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleLogin = () => {
    let role = "guest";
    if (email.endsWith("@std.tiu.edu.iq")) role = "student";
    else if (email.endsWith("@tiu.edu.iq")) role = "lecturer";
    else if (email.endsWith("@admin.tiu.edu.iq")) role = "admin";

    dispatch(setRole(role));
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
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
            <Text style={{ color: theme.text, fontWeight: "bold" }}>Enter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    borderRadius: vS(22),
    padding: 10,
    width: rS(190),
    alignSelf: "center",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
    padding: mS(30),
    justifyContent: "center",
  },
  loginTitle: {
    fontSize: mS(24),
    marginBottom: mS(40),
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: mS(15),
    marginBottom: mS(15),
    borderRadius: 20,
  },
  inputContainer: {
    height: rS(350),
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
  },
});