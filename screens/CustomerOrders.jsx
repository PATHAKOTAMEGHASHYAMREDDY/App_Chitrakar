import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";

const CustomerOrders = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const username = route.params?.username; // Safely access username

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {
    if (!username) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No username provided. Please log in again.",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.API_URL}/api/customerorders/${username}`);
      setOrders(response.data || []); // Ensure orders is always an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load your orders. Please try again later.",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [username]); // Dependency on username

  // Render Order Item
  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.orderImage} />
      <Text style={styles.orderTitle}>{item.paintingTitle}</Text>
      <Text style={styles.orderText}>Artist: {item.artistName}</Text>
      <Text style={styles.orderText}>Price: ₹{item.price}</Text>
      <Text style={styles.orderText}>Contact: {item.contact}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders, {username || "Guest"}!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders placed yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    width: "47%",
    elevation: 2,
    alignItems: "center",
  },
  orderImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  orderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  noOrdersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CustomerOrders;