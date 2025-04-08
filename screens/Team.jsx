import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Added for gradient background
import { Linking } from "react-native"; // For opening LinkedIn URLs
import { Linkedin } from "lucide-react-native"; // Using lucide-react-native for LinkedIn icon

const { width } = Dimensions.get("window");

const Team = () => {
  // Sample team data
  const teamMembers = [
    {
      name: "PATHAKOTA MEGHA SHYAM REDDY",
      linkedin: "https://www.linkedin.com/in/megha-shyam-reddy-pathakota-b0703b265/",
    },
    {
      name: "P MANJUNATH",
      linkedin: "https://www.linkedin.com/in/manjunath-reddy-36972a268",
    },
    {
      name: "K BALA RAJESH",
      linkedin: "https://www.linkedin.com/in/kunapareddy-bala-rajesh-137a21214",
    },
    {
      name: "SAYED ABDUL BIYA BANI",
      linkedin: "http://www.linkedin.com/in/abdul-biya-bani-sayed-4b5b05253",
    },
    {
      name: "R MANI KUMAR",
      linkedin: "https://www.linkedin.com/in/rajana-mani-kumar-2bbb59323/",
    },
  ];

  // Render Team Member
  const renderTeamMember = ({ item }) => (
    <View style={styles.teamMember}>
      <Text style={styles.memberName}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.linkedin)}
        style={styles.linkedinButton}
      >
        <Linkedin name="linkedin" size={width > 480 ? 32 : 24} color="#3498db" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#f5f7fa", "#c3cfe2"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>Meet Our Team</Text>
      <FlatList
        data={teamMembers}
        renderItem={renderTeamMember}
        keyExtractor={(item, index) => index.toString()}
        numColumns={width > 768 ? 2 : 1} // 2 columns on larger screens, 1 on smaller
        columnWrapperStyle={width > 768 ? styles.row : null}
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width > 768 ? 40 : 20,
    paddingHorizontal: width > 768 ? 20 : 10,
  },
  title: {
    fontSize: width > 768 ? 45 : width > 480 ? 35 : 28,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 40,
    textAlign: "center",
  },
  teamMember: {
    backgroundColor: "#fff",
    padding: width > 768 ? 20 : width > 480 ? 15 : 10,
    borderRadius: 10,
    margin: 5,
    elevation: 4,
    flexDirection: width > 480 ? "row" : "column", // Row on larger screens, column on smaller
    justifyContent: "space-between",
    alignItems: "center",
    width: width > 768 ? "47%" : "100%", // 47% width for 2 columns, full width for 1 column
    maxWidth: 600,
    gap: width <= 480 ? 10 : 0,
  },
  memberName: {
    fontSize: width > 768 ? 19 : width > 480 ? 18 : 16,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: width > 480 ? "left" : "center",
    marginBottom: width <= 480 ? 10 : 0,
  },
  linkedinButton: {
    padding: 5,
  },
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
});

export default Team;