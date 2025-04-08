import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const commonStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5e8d5", // Base color from Chitrakar's gradient
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent white from Chitrakar
    borderRadius: 15, // Rounded corners consistent with Chitrakar
    padding: width > 768 ? 30 : 20, // Responsive padding
    marginVertical: 10,
    elevation: 5, // Increased elevation for shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: "#3498db", // Primary blue from Chitrakar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // More rounded for Chitrakar aesthetic
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // Slightly larger for emphasis
    fontWeight: "600",
  },
  title: {
    fontSize: width > 768 ? 40 : 32, // Responsive, aligns with Chitrakar titles
    fontWeight: "800", // Bolder for emphasis
    color: "#2c3e50", // Dark neutral from Chitrakar
    marginBottom: 20, // Increased spacing
    textAlign: "center",
  },
  subtitle: {
    fontSize: width > 768 ? 24 : 20, // Responsive, aligns with Chitrakar subtitles
    fontWeight: "600",
    color: "#7f8c8d", // Lighter gray from Chitrakar
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#34495e", // Slightly darker text color from Chitrakar
    lineHeight: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 2, // Slightly thicker border from Chitrakar
    borderColor: "#e0e0e0", // Light gray from Chitrakar
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  screenWidth: width,
  screenHeight: height,
});

export default commonStyles;