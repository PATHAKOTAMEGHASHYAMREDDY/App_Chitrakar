import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Menu, X } from "lucide-react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const CustomerHome = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const username = route.params?.username;

  // State declarations
  const [paintings, setPaintings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestName, setRequestName] = useState(username || "");
  const [requestAddress, setRequestAddress] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestImage, setRequestImage] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [artists, setArtists] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: username || "",
    address: "",
    phone: "",
  });
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedRequestForChat, setSelectedRequestForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("paintings");

  // Toast Notification
  const showToast = (message, type = "success") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success" : "Error",
      text2: message,
    });
  };

  // Fetch Initial Data
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [paintingsResponse, artistsResponse] = await Promise.all([
        axios.get(`${process.env.API_URL}/api/paintings`),
        axios.get(`${process.env.API_URL}/api/artists`),
      ]);
      setPaintings(paintingsResponse.data || []);
      setArtists(artistsResponse.data || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      showToast("Failed to load paintings and artists", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Customer Requests
  const fetchCustomerRequests = async () => {
    try {
      const email = route.params?.email || `${username}@example.com`;
      const requestsResponse = await axios.get(`${process.env.API_URL}/api/myrequests/${email}`);
      setCustomerRequests(requestsResponse.data || []);
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      showToast("Failed to load custom requests", "error");
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!username) {
      showToast("No username provided. Please log in again.", "error");
      setOrdersLoading(false);
      return;
    }
    try {
      setOrdersLoading(true);
      const response = await axios.get(`${process.env.API_URL}/api/customerorders/${username}`);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to load orders", "error");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Chat Messages
  const fetchChatMessages = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/chat/messages/${requestId}`);
      setChatMessages(response.data || []);
    } catch (error) {
      console.error("Fetch Chat Error:", error);
      showToast("Failed to load chat messages", "error");
    }
  };

  // Initial Data Fetch and Polling
  useEffect(() => {
    fetchInitialData();
    fetchCustomerRequests();
    fetchOrders();
    const interval = setInterval(fetchCustomerRequests, 5000);
    return () => clearInterval(interval);
  }, [username, route.params]);

  useEffect(() => {
    if (selectedRequestForChat) {
      fetchChatMessages(selectedRequestForChat._id);
      const chatInterval = setInterval(() => fetchChatMessages(selectedRequestForChat._id), 5000);
      return () => clearInterval(chatInterval);
    }
  }, [selectedRequestForChat]);

  // Filter Paintings
  const filteredPaintings = paintings.filter((painting) =>
    searchQuery
      ? painting.artist.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Order Handlers
  const handleOrderClick = (painting) => {
    setSelectedPainting(painting);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async () => {
    setIsOrderLoading(true);
    try {
      const orderData = {
        customerName: orderDetails.name,
        artistName: selectedPainting.artist,
        paintingTitle: selectedPainting.title,
        price: selectedPainting.price,
        contact: selectedPainting.contact,
        imageUrl: selectedPainting.imageUrl,
        customerAddress: orderDetails.address,
        customerPhone: orderDetails.phone,
      };
      await axios.post(`${process.env.API_URL}/api/order`, orderData);
      showToast(`Order placed for ${selectedPainting.title}!`);
      fetchOrders();
      setShowOrderModal(false);
      setOrderDetails({ name: username || "", address: "", phone: "" });
      setSelectedPainting(null);
    } catch (error) {
      console.error("Order failed:", error);
      showToast("Failed to place order", "error");
    } finally {
      setIsOrderLoading(false);
    }
  };

  // Custom Request Handlers
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast("Permission to access gallery denied", "error");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setRequestImage(result.assets[0]);
    }
  };

  const handleRequestSubmit = async () => {
    setIsRequestLoading(true);
    const email = route.params?.email || `${username}@example.com`;
    const formData = new FormData();
    formData.append("name", requestName);
    formData.append("address", requestAddress);
    formData.append("phone", requestPhone);
    if (requestImage) {
      formData.append("image", {
        uri: requestImage.uri,
        type: "image/jpeg",
        name: "reference.jpg",
      });
    }
    formData.append("artist", selectedArtist);
    formData.append("customerEmail", email);

    try {
      const response = await axios.post(
        `${process.env.API_URL}/api/custompaintingrequest`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showToast(response.data.message);
      setCustomerRequests([...customerRequests, response.data.request]);
      setRequestAddress("");
      setRequestPhone("");
      setRequestImage(null);
      setSelectedArtist("");
    } catch (error) {
      showToast(error.response?.data?.error || "Request Failed", "error");
    } finally {
      setIsRequestLoading(false);
    }
  };

  // Chat Handlers
  const handleChatClick = (request) => {
    if (request.status === "accepted") {
      setSelectedRequestForChat(request);
      setShowChatModal(true);
    }
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedRequestForChat(null);
    setChatMessages([]);
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRequestForChat) return;
    try {
      await axios.post(`${process.env.API_URL}/api/chat/message`, {
        sender: username,
        receiver: selectedRequestForChat.artist,
        message: newMessage,
        requestId: selectedRequestForChat._id,
      });
      setNewMessage("");
      fetchChatMessages(selectedRequestForChat._id);
      showToast("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message", "error");
    }
  };

  // Sidebar Navigation
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Render Item Functions
  const renderPainting = ({ item }) => (
    <View style={styles.paintingCard}>
      <View style={styles.paintingImageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.paintingImage} />
      </View>
      <Text style={styles.paintingTitle}>{item.title}</Text>
      <Text style={styles.paintingText}>Price: ₹{item.price}</Text>
      <Text style={styles.paintingText}>Artist: {item.artist}</Text>
      <Text style={styles.paintingText}>Contact: {item.contact}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleOrderClick(item)}
      >
        <Text style={styles.buttonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderImageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.orderImage} />
      </View>
      <Text style={styles.orderTitle}>{item.paintingTitle}</Text>
      <Text style={styles.orderText}>Artist: {item.artistName}</Text>
      <Text style={styles.orderText}>Price: ₹{item.price}</Text>
      <Text style={styles.orderText}>Contact: {item.contact}</Text>
    </View>
  );

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestText}>
        <Text style={styles.requestLabel}>Name: </Text>{item.name}
      </Text>
      <Text style={styles.requestText}>
        <Text style={styles.requestLabel}>Address: </Text>{item.address}
      </Text>
      <Text style={styles.requestText}>
        <Text style={styles.requestLabel}>Phone: </Text>{item.phone}
      </Text>
      <Text style={styles.requestText}>
        <Text style={styles.requestLabel}>Artist: </Text>{item.artist}
      </Text>
      <Text style={styles.requestText}>
        <Text style={styles.requestLabel}>Status: </Text>{item.status}
      </Text>
      <View style={styles.requestImageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.requestImage} />
      </View>
      <TouchableOpacity
        style={[styles.chatButton, item.status !== "accepted" && styles.disabledButton]}
        onPress={() => handleChatClick(item)}
        disabled={item.status !== "accepted"}
      >
        <Text style={styles.buttonText}>Chat with Artist</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={styles.sidebarLogo} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSidebarOpen(false)} style={styles.sidebarClose}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "paintings" && styles.activeSidebarItem]}
            onPress={() => handleSectionChange("paintings")}
          >
            <Text style={styles.sidebarText}>Paintings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "requests" && styles.activeSidebarItem]}
            onPress={() => handleSectionChange("requests")}
          >
            <Text style={styles.sidebarText}>Custom Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "orders" && styles.activeSidebarItem]}
            onPress={() => handleSectionChange("orders")}
          >
            <Text style={styles.sidebarText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "chat" && styles.activeSidebarItem]}
            onPress={() => handleSectionChange("chat")}
          >
            <Text style={styles.sidebarText}>Chat with Artists</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setSidebarOpen(true)}>
          <Menu size={30} color="#232f3e" />
        </TouchableOpacity>
        <Text style={styles.welcomeTitle}>Welcome, {username || "Guest"}!</Text>
        <Text style={styles.welcomeSubtitle}>Find and order beautiful paintings</Text>

        {/* Paintings Section */}
        {activeSection === "paintings" && (
          <View style={styles.paintingsContainer}>
            <Text style={styles.sectionTitle}>Explore Paintings</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Search paintings by artist..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#ff9900" />
            ) : filteredPaintings.length > 0 ? (
              <FlatList
                data={filteredPaintings}
                renderItem={renderPainting}
                keyExtractor={(item) => item._id}
                numColumns={width > 768 ? 2 : 1}
                columnWrapperStyle={width > 768 ? styles.paintingsGrid : null}
              />
            ) : (
              <Text style={styles.noPaintings}>No paintings found</Text>
            )}
          </View>
        )}

        {/* Custom Requests Section */}
        {activeSection === "requests" && (
          <View style={styles.requestContainer}>
            <Text style={styles.sectionTitle}>Request a Custom Painting</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={requestName}
                onChangeText={setRequestName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Address"
                value={requestAddress}
                onChangeText={setRequestAddress}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={requestPhone}
                onChangeText={setRequestPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Artist:</Text>
              <ScrollView horizontal style={styles.artistPicker}>
                {artists.map((artist) => (
                  <TouchableOpacity
                    key={artist._id}
                    style={[
                      styles.artistOption,
                      selectedArtist === artist.sname && styles.selectedArtist,
                    ]}
                    onPress={() => setSelectedArtist(artist.sname)}
                  >
                    <Text style={styles.artistText}>{artist.sname}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>
                {requestImage ? "Image Selected" : "Pick Reference Image"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isRequestLoading && styles.disabledButton]}
              onPress={handleRequestSubmit}
              disabled={isRequestLoading}
            >
              {isRequestLoading ? (
                <ActivityIndicator size="small" color="#0f1111" />
              ) : (
                <Text style={styles.buttonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Orders Section */}
        {activeSection === "orders" && (
          <View style={styles.ordersContainer}>
            <Text style={styles.sectionTitle}>Your Orders</Text>
            {ordersLoading ? (
              <ActivityIndicator size="large" color="#ff9900" />
            ) : orders.length > 0 ? (
              <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item._id}
                numColumns={width > 768 ? 2 : 1}
                columnWrapperStyle={width > 768 ? styles.ordersGrid : null}
              />
            ) : (
              <Text style={styles.noOrders}>No orders placed yet</Text>
            )}
          </View>
        )}

        {/* Chat Section */}
        {activeSection === "chat" && (
          <View style={styles.chatContainer}>
            <Text style={styles.sectionTitle}>Your Custom Painting Requests</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#ff9900" />
            ) : customerRequests.length > 0 ? (
              <FlatList
                data={customerRequests}
                renderItem={renderRequest}
                keyExtractor={(item) => item._id}
                numColumns={width > 768 ? 2 : 1}
                columnWrapperStyle={width > 768 ? styles.requestsGrid : null}
              />
            ) : (
              <Text style={styles.noRequests}>No custom requests yet</Text>
            )}
          </View>
        )}
      </View>

      {/* Order Modal */}
      <Modal visible={showOrderModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={orderDetails.name}
                onChangeText={(text) => setOrderDetails({ ...orderDetails, name: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Address"
                value={orderDetails.address}
                onChangeText={(text) => setOrderDetails({ ...orderDetails, address: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={orderDetails.phone}
                onChangeText={(text) => setOrderDetails({ ...orderDetails, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, isOrderLoading && styles.disabledButton]}
              onPress={handleOrderSubmit}
              disabled={isOrderLoading}
            >
              {isOrderLoading ? (
                <ActivityIndicator size="small" color="#0f1111" />
              ) : (
                <Text style={styles.buttonText}>Confirm Order</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOrderModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      <Modal visible={showChatModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Chat with {selectedRequestForChat?.artist}
            </Text>
            <FlatList
              data={chatMessages}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.chatMessage,
                    item.sender === username ? styles.sentMessage : styles.receivedMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.chatMessages}
            />
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message..."
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseChat}
            >
              <Text style={styles.buttonText}>Close Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
  },
  sidebar: {
    width: width > 768 ? 250 : "100%",
    backgroundColor: "#232f3e",
    padding: 20,
    position: width > 768 ? "relative" : "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  sidebarLogo: {
    width: 100,
    height: 40,
  },
  sidebarClose: {
    display: width > 768 ? "none" : "flex",
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 4,
  },
  activeSidebarItem: {
    backgroundColor: "#ff9900",
  },
  sidebarText: {
    fontSize: 16,
    color: "#ffffff",
  },
  mainContent: {
    flex: 1,
    padding: width > 768 ? 40 : 15,
    backgroundColor: "#ffffff",
    width: width > 768 ? width - 250 : "100%",
    marginLeft: width > 768 ? 250 : 0,
  },
  hamburger: {
    display: width > 768 ? "none" : "flex",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1100,
    padding: 5,
  },
  welcomeTitle: {
    fontSize: width > 768 ? 32 : 24,
    fontWeight: "700",
    color: "#0f1111",
    textAlign: "center",
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: width > 768 ? 18 : 14,
    color: "#565959",
    textAlign: "center",
    marginBottom: 30,
  },
  paintingsContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 35 : 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: width > 768 ? 28 : 20,
    color: "#0f1111",
    marginBottom: 20,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  searchBar: {
    width: "100%",
    maxWidth: 500,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    marginBottom: 20,
  },
  paintingsGrid: {
    justifyContent: "space-between",
  },
  paintingCard: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 20 : 15,
    borderRadius: 10,
    elevation: 3,
    margin: width > 768 ? 15 : 10,
    width: width > 768 ? (width - 330) / 2 : "100%",
    alignItems: "center",
  },
  paintingImageWrapper: {
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ff9900",
    overflow: "hidden",
    width: "100%",
  },
  paintingImage: {
    width: "100%",
    height: width > 768 ? 200 : 150,
  },
  paintingTitle: {
    fontSize: width > 768 ? 20 : 16,
    color: "#0f1111",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  paintingText: {
    fontSize: 14,
    color: "#565959",
    textAlign: "center",
    marginVertical: 5,
  },
  button: {
    padding: 10,
    backgroundColor: "#ff9900",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d47f00",
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#f7d9a8",
    borderColor: "#f7d9a8",
  },
  buttonText: {
    color: "#0f1111",
    fontSize: 16,
    fontWeight: "600",
  },
  noPaintings: {
    fontSize: 18,
    color: "#565959",
    textAlign: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    width: "100%",
  },
  requestContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 35 : 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#0f1111",
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
  },
  artistPicker: {
    flexDirection: "row",
  },
  artistOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    marginRight: 10,
  },
  selectedArtist: {
    backgroundColor: "#ff9900",
    borderColor: "#ff9900",
  },
  artistText: {
    fontSize: 16,
    color: "#0f1111",
  },
  ordersContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 35 : 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    alignItems: "center",
    width: "100%",
  },
  ordersGrid: {
    justifyContent: "space-between",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 20 : 15,
    borderRadius: 10,
    elevation: 3,
    margin: width > 768 ? 15 : 10,
    width: width > 768 ? (width - 330) / 2 : "100%",
    alignItems: "center",
  },
  orderImageWrapper: {
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ff9900",
    overflow: "hidden",
    width: "100%",
  },
  orderImage: {
    width: "100%",
    height: width > 768 ? 200 : 150,
  },
  orderTitle: {
    fontSize: width > 768 ? 20 : 16,
    color: "#0f1111",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  orderText: {
    fontSize: 14,
    color: "#565959",
    textAlign: "center",
    marginVertical: 5,
  },
  noOrders: {
    fontSize: 18,
    color: "#565959",
    textAlign: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    width: "100%",
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 35 : 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    alignItems: "center",
    width: "100%",
  },
  requestsGrid: {
    justifyContent: "space-between",
  },
  requestCard: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 20 : 15,
    borderRadius: 10,
    elevation: 3,
    margin: width > 768 ? 15 : 10,
    width: width > 768 ? (width - 330) / 2 : "100%",
    alignItems: "center",
  },
  requestImageWrapper: {
    marginVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ff9900",
    overflow: "hidden",
    width: "100%",
  },
  requestImage: {
    width: "100%",
    height: width > 768 ? 200 : 150,
  },
  requestText: {
    fontSize: 14,
    color: "#0f1111",
    textAlign: "center",
    marginVertical: 5,
  },
  requestLabel: {
    color: "#ff9900",
    fontWeight: "bold",
  },
  chatButton: {
    padding: 10,
    backgroundColor: "#ff9900",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d47f00",
    alignItems: "center",
    marginTop: 15,
  },
  noRequests: {
    fontSize: 18,
    color: "#565959",
    textAlign: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 600,
    maxHeight: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#0f1111",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#d13232",
    borderRadius: 4,
    alignItems: "center",
    marginTop: 15,
  },
  chatMessages: {
    maxHeight: width > 768 ? 300 : 200,
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  chatMessage: {
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    maxWidth: "70%",
  },
  sentMessage: {
    backgroundColor: "#ff9900",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#e8ecef",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
    color: "#0f1111",
  },
  timestamp: {
    fontSize: 12,
    color: "#565959",
    textAlign: "right",
  },
  chatInputContainer: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 10,
    marginBottom: 15,
  },
  chatInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#ff9900",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d47f00",
    alignItems: "center",
    width: width <= 768 ? "100%" : undefined,
  },
});

export default CustomerHome;