import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Added for gradient background
import { useNavigation } from "@react-navigation/native";
import { Linkedin } from "lucide-react-native"; // Updated to use lucide-react-native for consistency
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation();

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  const handleArtist = () => {
    showToast("Navigating to Artist Login...");
    setTimeout(() => navigation.navigate("Artistlog"), 1000); // Updated to match your file name
  };

  const handleCustomer = () => {
    showToast("Navigating to Customer Login...");
    setTimeout(() => navigation.navigate("Customerlog"), 1000); // Updated to match your file name
  };

  return (
    <LinearGradient
      colors={["#f5e8d5", "#e0f7fa"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.homeLogo}
          />
          <Text style={styles.siteTitle}>Chitrakar</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContentWrapper}>
          <Image
            source={require("../assets/painting-image.png")}
            style={styles.heroImage}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Unleash Your Creativity</Text>
            <Text style={styles.heroSubtitle}>
              A platform for artists and customers to connect, create, and inspire.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.artistBtn} onPress={handleArtist}>
                <Text style={styles.buttonText}>I am an Artist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.customerBtn} onPress={handleCustomer}>
                <Text style={styles.buttonText}>I am a Customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Why Choose Chitrakar?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureTitle}>Showcase Your Art</Text>
            <Text style={styles.featureDescription}>
              Artists can upload their masterpieces and gain recognition from a global audience.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📤</Text>
            <Text style={styles.featureTitle}>Upload & Store</Text>
            <Text style={styles.featureDescription}>
              Customers can securely upload sketches and store them in the cloud.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🤝</Text>
            <Text style={styles.featureTitle}>Connect & Collaborate</Text>
            <Text style={styles.featureDescription}>
              Bring creativity to life by connecting artists and customers.
            </Text>
          </View>
        </View>
      </View>

      {/* About Us Section */}
      <LinearGradient
        colors={["#3498db", "#e67e22"]}
        style={styles.aboutSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.aboutTitle}>About Us</Text>
        <Text style={styles.aboutDescription}>
          Chitrakar is a unique platform that bridges the gap between{" "}
          <Text style={styles.boldText}>talented artists</Text> and{" "}
          <Text style={styles.boldText}>passionate customers</Text>. Whether you're an artist
          looking to showcase your artwork or a customer seeking personalized sketches, we
          provide the perfect digital space for collaboration and inspiration.
        </Text>
        <View style={styles.socialMedia}>
          <Text style={styles.socialTitle}>Contact Us</Text>
          <TouchableOpacity
            onPress={() => {
              showToast("Opening LinkedIn...");
              // Add linking logic here if needed (e.g., Linking.openURL)
            }}
          >
            <Linkedin size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Chitrakar. All rights reserved.</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    padding: width > 768 ? 40 : 20,
    paddingHorizontal: width > 768 ? 40 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    elevation: 2,
    position: "sticky",
    top: 0,
    zIndex: 1000,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  homeLogo: {
    width: 60,
    height: 60,
  },
  siteTitle: {
    fontSize: width > 768 ? 40 : 32,
    fontWeight: "700",
    color: "#e67e22",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroSection: {
    padding: width > 768 ? 60 : 20,
    minHeight: width > 768 ? "80%" : "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContentWrapper: {
    flexDirection: width > 768 ? "row" : "column",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1200,
    width: "100%",
    gap: width > 768 ? 40 : 20,
  },
  heroImage: {
    width: "100%",
    height: width > 768 ? 300 : 200,
    borderRadius: 15,
    elevation: 10,
    marginBottom: width <= 768 ? 20 : 0,
    maxWidth: width > 768 ? "50%" : "100%",
  },
  heroTextContainer: {
    flex: 1,
    alignItems: width > 768 ? "flex-start" : "center",
    textAlign: width > 768 ? "left" : "center",
  },
  heroTitle: {
    fontSize: width > 768 ? 56 : 40,
    fontWeight: "800",
    color: "#34495e",
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: width > 768 ? 24 : 18,
    color: "#7f8c8d",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 20,
    width: width > 768 ? "auto" : "100%",
    alignItems: "center",
  },
  artistBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#e67e22",
    borderRadius: 25,
    width: width <= 768 ? "100%" : "auto",
    maxWidth: 250,
    alignItems: "center",
  },
  customerBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#3498db",
    borderRadius: 25,
    width: width <= 768 ? "100%" : "auto",
    maxWidth: 250,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  featuresSection: {
    padding: width > 768 ? 60 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  featuresTitle: {
    fontSize: width > 768 ? 40 : 32,
    textAlign: "center",
    color: "#e67e22",
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: "column",
    gap: 30,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    elevation: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 20,
    color: "#3498db",
  },
  featureTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#34495e",
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: width > 768 ? 16 : 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  aboutSection: {
    padding: width > 768 ? 60 : 20,
  },
  aboutTitle: {
    fontSize: width > 768 ? 40 : 32,
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  aboutDescription: {
    fontSize: width > 768 ? 20 : 16,
    color: "#fff",
    textAlign: "center",
    maxWidth: 800,
    alignSelf: "center",
    marginBottom: 40,
  },
  boldText: {
    fontWeight: "bold",
    color: "#f1c40f",
  },
  socialMedia: {
    alignItems: "center",
  },
  socialTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#fff",
    marginBottom: 15,
  },
  footer: {
    padding: 20,
    backgroundColor: "#2c3e50",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default Home;