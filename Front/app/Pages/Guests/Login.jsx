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
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setRole } from "../../Redux/Slices/User/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.userRole);
  const navigation = useNavigation();

  const handleLogin = () => {
    let role = "guest";
    if (email.endsWith("@std.tiu.edu.iq")) role = "student";
    else if (email.endsWith("@tiu.edu.iq")) role = "lecturer";
    else if (email.endsWith("@admin.tiu.edu.iq")) role = "admin";

    dispatch(setRole(role)); // update Redux
    // no navigation.replace() needed
  };

  const handleSkip = () => {
    dispatch(setRole("guest"));
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
