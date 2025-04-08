import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const Artistlog = () => {
  const navigation = useNavigation();

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup Form States
  const [sname, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Toast Notification
  const showToast = (message, type = "success") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  // Toggle Password Visibility
  const toggleLoginPassword = () => setShowLoginPassword(!showLoginPassword);
  const toggleSignupPassword = () => setShowSignupPassword(!showSignupPassword);

  // Handle Login Submit
  const handleLoginSubmit = async () => {
    setIsLoginLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/artistlogin`, {
        semail: loginEmail,
        spassword: loginPassword,
      });
      showToast(response.data.message);
      setLoginEmail("");
      setLoginPassword("");
      setTimeout(() => {
        setIsLoginLoading(false);
        navigation.navigate("ArtistHome", { username: response.data.username });
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.error || "Login Failed", "error");
      setIsLoginLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async () => {
    setIsSignupLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/artistsignup`, {
        sname,
        semail: signupEmail,
        spassword: signupPassword,
      });
      showToast(response.data.message);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setTimeout(() => {
        setIsSignupLoading(false);
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.error || "Signup Failed", "error");
      setIsSignupLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Artist Introduction Section */}
      <View style={styles.artistIntro}>
        <Text style={styles.artistTitle}>Hey Chitrakar</Text>
        <Text style={styles.artistDescription}>
          🎨 <Text style={styles.boldText}>Chitrakar</Text> is a platform for artists to showcase
          their talent, sell unique paintings, and connect with art lovers worldwide. Whether
          you're a passionate creator or an art enthusiast, join us in celebrating creativity
          and craftsmanship.
        </Text>
        <Text style={styles.artistHighlight}>
          Join today and be part of a vibrant community where{" "}
          <Text style={styles.boldText}>art meets passion!</Text>
        </Text>
      </View>

      {/* Forms and Image Container */}
      <View style={styles.formsImageWrapper}>
        {/* Login Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry={!showLoginPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={toggleLoginPassword}
              >
                {showLoginPassword ? (
                  <Eye size={20} color="#7f8c8d" />
                ) : (
                  <EyeOff size={20} color="#7f8c8d" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.formButton, isLoginLoading && styles.disabledButton]}
            onPress={handleLoginSubmit}
            disabled={isLoginLoading}
          >
            {isLoginLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/artist.png")}
            style={styles.centerImage}
          />
        </View>

        {/* Signup Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign Up</Text>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your full name"
              value={sname}
              onChangeText={setSignupName}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your password"
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry={!showSignupPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={toggleSignupPassword}
              >
                {showSignupPassword ? (
                  <Eye size={20} color="#7f8c8d" />
                ) : (
                  <EyeOff size={20} color="#7f8c8d" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.formButton, isSignupLoading && styles.disabledButton]}
            onPress={handleSignupSubmit}
            disabled={isSignupLoading}
          >
            {isSignupLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e8d5", // Gradient not fully supported, using base color
    padding: width > 768 ? 40 : 20,
  },
  artistIntro: {
    padding: 20,
    alignItems: "center",
    maxWidth: 800,
    alignSelf: "center",
    marginBottom: 40,
  },
  artistTitle: {
    fontSize: width > 768 ? 48 : 40,
    fontWeight: "800",
    color: "#e67e22",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  artistDescription: {
    fontSize: width > 768 ? 20 : 16,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 15,
  },
  artistHighlight: {
    fontSize: width > 768 ? 18 : 14,
    color: "#3498db",
    textAlign: "center",
    fontStyle: "italic",
  },
  boldText: {
    fontWeight: "bold",
    color: "#e67e22",
  },
  formsImageWrapper: {
    flexDirection: width > 1024 ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 30,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: width > 768 ? 30 : 20,
    borderRadius: 15,
    elevation: 5,
    width: "100%",
    maxWidth: 350,
  },
  formTitle: {
    fontSize: width > 768 ? 32 : 24,
    color: "#34495e",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 5,
  },
  formInput: {
    padding: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  passwordWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordToggle: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  formButton: {
    padding: 12,
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordLink: {
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  imageContainer: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    marginVertical: width > 1024 ? 0 : 20,
  },
  centerImage: {
    width: "100%",
    height: width > 768 ? 400 : 300,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#e67e22",
    elevation: 10,
  },
  homeButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#e67e22",
    borderRadius: 25,
    elevation: 5,
    alignSelf: "flex-end",
    margin: 20,
  },
});

export default Artistlog;