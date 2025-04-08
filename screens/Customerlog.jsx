import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Import for gradient
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const Customerlog = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // States for Signup Form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // States for Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  // Toggle Password Visibility Functions
  const toggleLoginPassword = () => setShowLoginPassword(!showLoginPassword);
  const toggleSignupPassword = () => setShowSignupPassword(!showSignupPassword);

  // Handle Signup Submit
  const handleSignupSubmit = async () => {
    setIsSignupLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/customersignup`, {
        cname: signupName,
        cemail: signupEmail,
        cpassword: signupPassword,
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

  // Handle Login Submit
  const handleLoginSubmit = async () => {
    setIsLoginLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/customerlogin`, {
        cemail: loginEmail,
        cpassword: loginPassword,
      });
      showToast(response.data.message);
      setLoginEmail("");
      setLoginPassword("");
      setTimeout(() => {
        setIsLoginLoading(false);
        navigation.navigate("CustomerHome", { username: response.data.username });
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.error || "Login Failed", "error");
      setIsLoginLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f5e8d5", "#e0f7fa"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Customer Introduction Section */}
      <View style={styles.customerIntro}>
        <Text style={styles.customerTitle}>Hey Art Enthusiast</Text>
        <Text style={styles.customerDescription}>
          🛍️ <Text style={styles.bold}>Chitrakar</Text> is a platform for art lovers to discover and purchase unique, handcrafted paintings.
          Whether you're looking to decorate your space or support talented artists, join our growing art community!
        </Text>
        <Text style={styles.customerHighlight}>
          Sign up today and explore a world where <Text style={styles.bold}>art meets passion!</Text> 🎨✨
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
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={require("../assets/customer.png")} style={styles.centerImage} />
        </View>

        {/* Signup Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign Up</Text>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter your full name"
              value={signupName}
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
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width > 768 ? 40 : 20,
    alignItems: "center",
  },
  customerIntro: {
    maxWidth: 800,
    marginBottom: 40,
    alignItems: "center",
  },
  customerTitle: {
    fontSize: width > 768 ? 48 : 40,
    fontWeight: "800",
    color: "#e67e22",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  customerDescription: {
    fontSize: width > 768 ? 20 : 16,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 15,
  },
  customerHighlight: {
    fontSize: width > 768 ? 18 : 14,
    color: "#3498db",
    textAlign: "center",
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
    color: "#e67e22",
  },
  formsImageWrapper: {
    flexDirection: width > 1024 ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1200,
    gap: 30,
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
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
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
    marginTop: 10,
    alignItems: "center",
  },
  forgotText: {
    fontSize: 14,
    color: "#3498db",
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
  homeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#e67e22",
    borderRadius: 25,
    alignItems: "center",
    elevation: 5,
    marginTop: 20,
    alignSelf: "center",
  },
});

export default Customerlog;