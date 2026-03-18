import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Button,
  Image,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Logo from "../../../assets/TIU.webp";
import { mS, rS, vS } from "../../Styles/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../Redux/Slices/User/userSlice";

const Login = ({ onLogin, onSkip }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    let role = "guest";
    if (email.endsWith("@std.tiu.edu.iq")) role = "student";
    else if (email.endsWith("@tiu.edu.iq")) role = "lecturer";
    else if (email.endsWith("@admin.tiu.edu.iq")) role = "admin";

    dispatch(setRole(role)); // update Redux
    // no navigation.replace() needed
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <Text
            style={{
              marginVertical: mS(20),
              fontSize: mS(20),
              textAlign: "center",
              color: "rgba(238, 238, 238, 1)",
            }}
          >
            TLogin
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text>Enter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: mS(20),
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
  loginContainer: {
    flex: 1,
    padding: mS(30),
    justifyContent: "center",
    backgroundColor: "rgba(238, 238, 238, 1)",
  },
  loginTitle: {
    fontSize: mS(24),
    marginBottom: mS(40),
    textAlign: "center",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#f9deb0",
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
    backgroundColor: "#7e1646",
  },
  error: {
    color: "#ff1900ff",
    marginBottom: mS(15),
    textAlign: "center",
  },
});
