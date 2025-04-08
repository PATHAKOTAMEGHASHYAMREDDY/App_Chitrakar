import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Eye, EyeOff } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const ForgotPassword = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("customer");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  // Handle Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/forgot-password`, {
        email,
        userType,
      });
      showToast(response.data.message);
      setStep(2);
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/reset-password`, {
        email,
        userType,
        otp,
        newPassword,
      });
      showToast(response.data.message);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setStep(1);
        navigation.navigate("Customerlog"); // Redirect to login after success
      }, 2000); // Show success message for 2 seconds before redirecting
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {/* Step 1: Send OTP */}
      {step === 1 && (
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>User Type:</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  userType === "customer" && styles.selectedOption,
                ]}
                onPress={() => setUserType("customer")}
              >
                <Text style={styles.optionText}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  userType === "artist" && styles.selectedOption,
                ]}
                onPress={() => setUserType("artist")}
              >
                <Text style={styles.optionText}>Artist</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Reset Password */}
      {step === 2 && (
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>OTP:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                {showNewPassword ? (
                  <Eye size={20} color="#666" />
                ) : (
                  <EyeOff size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <Eye size={20} color="#666" />
                ) : (
                  <EyeOff size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPassword;