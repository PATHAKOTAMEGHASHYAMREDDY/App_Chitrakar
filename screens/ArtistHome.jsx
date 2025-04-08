import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Menu, X } from "lucide-react-native";

const { width } = Dimensions.get("window");

const ArtistHome = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const username = route.params?.username;

  const [activeSection, setActiveSection] = useState("upload");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Upload Painting States
  const [paintingTitle, setPaintingTitle] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Custom Requests States
  const [customRequests, setCustomRequests] = useState([]);

  // Paintings States
  const [paintings, setPaintings] = useState([]);

  // Orders States
  const [orders, setOrders] = useState([]);

  // Chat States
  const [chatRequests, setChatRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(true);

  // Toast Notification
  const showToast = (message, type = "success") => {
    Alert.alert(type === "success" ? "Success" : "Error", message);
  };

  // Fetch Data Based on Active Section
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeSection === "custom" || activeSection === "chat") {
          const response = await axios.get(`${process.env.API_URL}/api/customrequests/${username}`);
          setCustomRequests(response.data);
          if (activeSection === "chat") {
            const acceptedRequests = response.data.filter((req) => req.status === "accepted");
            setChatRequests(acceptedRequests);
            setChatLoading(false);
          }
        }
        if (activeSection === "paintings") {
          const response = await axios.get(`${process.env.API_URL}/api/paintings`);
          setPaintings(response.data.filter((painting) => painting.artist === username));
        }
        if (activeSection === "orders") {
          const response = await axios.get(`${process.env.API_URL}/api/orders`);
          setOrders(response.data.filter((order) => order.artistName === username));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to fetch data", "error");
      }
    };
    fetchData();
  }, [username, activeSection]);

  // Chat Messages Polling
  useEffect(() => {
    if (selectedRequest) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${process.env.API_URL}/api/chat/messages/${selectedRequest._id}`);
          setChatMessages(response.data || []);
        } catch (error) {
          showToast("Failed to load messages", "error");
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRequest]);

  // Upload Painting Handler with ImagePicker
  const handleSubmit = async () => {
    if (!image) {
      showToast("Please select an image", "error");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", paintingTitle);
    formData.append("image", {
      uri: image.uri,
      type: "image/jpeg",
      name: "painting.jpg",
    });
    formData.append("price", price);
    formData.append("contact", contact);
    formData.append("artist", username);

    try {
      const response = await axios.post(`${process.env.API_URL}/api/uploadpainting`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast(response.data.message);
      setPaintingTitle("");
      setImage(null);
      setPrice("");
      setContact("");
      setIsUploading(false);
    } catch (error) {
      showToast(error.response?.data?.error || "Upload Failed", "error");
      setIsUploading(false);
    }
  };

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
      setImage(result.assets[0]);
    }
  };

  // Custom Request Handlers
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/api/customrequests/${requestId}`, {
        status: "accepted",
      });
      showToast(response.data.message);
      setCustomRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "accepted" } : req))
      );
    } catch (error) {
      showToast("Failed to accept request", "error");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/api/customrequests/${requestId}`, {
        status: "rejected",
      });
      showToast(response.data.message);
      setCustomRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "rejected" } : req))
      );
    } catch (error) {
      showToast("Failed to reject request", "error");
    }
  };

  // Painting Delete Handler
  const handleDelete = (paintingId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this painting?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${process.env.API_URL}/api/paintings/${paintingId}`, {
              params: { artist: username },
            });
            setPaintings((prev) => prev.filter((painting) => painting._id !== paintingId));
            showToast("Painting deleted successfully");
          } catch (error) {
            showToast("Failed to delete painting", "error");
          }
        },
      },
    ]);
  };

  // Chat Handlers
  const handleSelectChat = (request) => {
    setSelectedRequest(request);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return;
    try {
      await axios.post(`${process.env.API_URL}/api/chat/message`, {
        sender: username,
        receiver: selectedRequest.name,
        message: newMessage,
        requestId: selectedRequest._id,
      });
      setNewMessage("");
      const response = await axios.get(`${process.env.API_URL}/api/chat/messages/${selectedRequest._id}`);
      setChatMessages(response.data || []);
    } catch (error) {
      showToast("Failed to send message", "error");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return (
          <ScrollView style={styles.uploadFormContainer}>
            <Text style={styles.sectionTitle}>Upload Your Painting</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Painting Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Painting Title"
                value={paintingTitle}
                onChangeText={setPaintingTitle}
              />
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.buttonText}>{image ? "Image Selected" : "Pick an Image"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price (in ₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Price (in ₹)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact Details"
                value={contact}
                onChangeText={setContact}
              />
            </View>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#0f1111" />
              ) : (
                <Text style={styles.buttonText}>Upload Painting</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        );
      case "custom":
        return (
          <View style={styles.customRequestsContainer}>
            <Text style={styles.sectionTitle}>Custom Requests</Text>
            <FlatList
              data={customRequests}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.requestCard}>
                  <Text style={styles.requestText}>
                    <Text style={styles.requestLabel}>Customer: </Text>{item.name}
                  </Text>
                  <Text style={styles.requestText}>
                    <Text style={styles.requestLabel}>Address: </Text>{item.address}
                  </Text>
                  <Text style={styles.requestText}>
                    <Text style={styles.requestLabel}>Status: </Text>{item.status}
                  </Text>
                  <Text style={styles.requestText}>
                    <Text style={styles.requestLabel}>Phone: </Text>{item.phone}
                  </Text>
                  <View style={styles.requestImageWrapper}>
                    <Image source={{ uri: item.imageUrl }} style={styles.requestImage} />
                  </View>
                  {item.status === "pending" && (
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAcceptRequest(item._id)}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleRejectRequest(item._id)}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.noRequests}>No custom requests yet.</Text>}
            />
          </View>
        );
      case "paintings":
        return (
          <View style={styles.paintingsContainer}>
            <Text style={styles.sectionTitle}>Your Paintings</Text>
            <FlatList
              data={paintings}
              keyExtractor={(item) => item._id}
              numColumns={width > 768 ? 2 : 1}
              columnWrapperStyle={width > 768 ? styles.paintingsGrid : null}
              renderItem={({ item }) => (
                <View style={styles.paintingCard}>
                  <View style={styles.paintingImageWrapper}>
                    <Image source={{ uri: item.imageUrl }} style={styles.paintingImage} />
                  </View>
                  <Text style={styles.paintingTitle}>{item.title}</Text>
                  <Text style={styles.paintingText}>Price: ₹{item.price}</Text>
                  <Text style={styles.paintingText}>Contact: {item.contact}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.noPaintings}>No paintings uploaded yet!</Text>}
            />
          </View>
        );
      case "orders":
        return (
          <View style={styles.ordersContainer}>
            <Text style={styles.sectionTitle}>Your Orders</Text>
            <FlatList
              data={orders}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  <View style={styles.orderImageWrapper}>
                    <Image source={{ uri: item.imageUrl }} style={styles.orderImage} />
                  </View>
                  <Text style={styles.orderTitle}>{item.paintingTitle}</Text>
                  <Text style={styles.orderText}>Price: ₹{item.price}</Text>
                  <Text style={styles.orderText}>Ordered by: {item.customerName}</Text>
                  <Text style={styles.orderText}>Customer Address: {item.customerAddress}</Text>
                  <Text style={styles.orderText}>Customer Phone: {item.customerPhone}</Text>
                  <Text style={styles.orderText}>Artist Contact: {item.contact}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.noRequests}>No orders received yet!</Text>}
            />
          </View>
        );
      case "chat":
        return (
          <View style={styles.chatContainer}>
            <Text style={styles.sectionTitle}>Chat with Customers</Text>
            <View style={styles.chatDashboard}>
              <FlatList
                data={chatRequests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.chatItem,
                      selectedRequest?._id === item._id && styles.selectedChat,
                    ]}
                    onPress={() => handleSelectChat(item)}
                  >
                    <Text style={styles.chatItemText}>{item.name}</Text>
                    <Text style={styles.chatItemSpan}>Request ID: {item._id.slice(-6)}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  chatLoading ? (
                    <Text style={styles.noRequests}>Loading chats...</Text>
                  ) : (
                    <Text style={styles.noRequests}>No accepted requests to chat about yet.</Text>
                  )
                }
                horizontal={width > 768}
                style={styles.chatList}
              />
              {selectedRequest && (
                <View style={styles.chatWindow}>
                  <Text style={styles.chatWindowTitle}>Chat with {selectedRequest.name}</Text>
                  <FlatList
                    data={chatMessages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.chatMessage,
                          item.sender === username ? styles.sentMessage : styles.receivedMessage,
                        ]}
                      >
                        <Text style={styles.chatMessageText}>{item.message}</Text>
                        <Text style={styles.chatMessageSpan}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    )}
                    style={styles.chatMessages}
                  />
                  <View style={styles.chatInput}>
                    <TextInput
                      style={styles.chatInputField}
                      value={newMessage}
                      onChangeText={setNewMessage}
                      placeholder="Type your message..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                      <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>{username}</Text>
            <TouchableOpacity onPress={() => setSidebarOpen(false)} style={styles.sidebarClose}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "upload" && styles.activeSidebarItem]}
            onPress={() => {
              setActiveSection("upload");
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.sidebarText}>Upload Painting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "custom" && styles.activeSidebarItem]}
            onPress={() => {
              setActiveSection("custom");
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.sidebarText}>Custom Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "paintings" && styles.activeSidebarItem]}
            onPress={() => {
              setActiveSection("paintings");
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.sidebarText}>Your Paintings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "orders" && styles.activeSidebarItem]}
            onPress={() => {
              setActiveSection("orders");
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.sidebarText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, activeSection === "chat" && styles.activeSidebarItem]}
            onPress={() => {
              setActiveSection("chat");
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.sidebarText}>Chat with Customers</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setSidebarOpen(true)}>
          <Menu size={30} color="#232f3e" />
        </TouchableOpacity>
        <Text style={styles.welcomeTitle}>Welcome, {username}!</Text>
        <Text style={styles.welcomeSubtitle}>Showcase your beautiful paintings to the world!</Text>
        <View style={styles.contentWrapper}>{renderContent()}</View>
      </View>
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
    transform: width <= 768 && !sidebarOpen ? { translateX: -width } : { translateX: 0 },
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  sidebarTitle: {
    fontSize: 24,
    color: "#ff9900",
    fontWeight: "700",
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
    color: "#ffffff",
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    padding: width > 768 ? 40 : 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
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
  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 1200,
  },
  uploadFormContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 30 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    maxWidth: 500,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: width > 768 ? 32 : 24,
    color: "#0f1111",
    marginBottom: 20,
    fontWeight: "700",
    textAlign: "left",
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
  uploadButton: {
    padding: 12,
    backgroundColor: "#ff9900",
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d47f00",
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
  customRequestsContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 30 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    width: "100%",
  },
  requestCard: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 20 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 1,
    marginBottom: 15,
  },
  requestText: {
    fontSize: 16,
    color: "#0f1111",
    marginVertical: 5,
  },
  requestLabel: {
    color: "#ff9900",
    fontWeight: "bold",
  },
  requestImageWrapper: {
    marginVertical: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  requestImage: {
    width: "100%",
    height: width > 768 ? 200 : 150,
  },
  buttonGroup: {
    flexDirection: width > 768 ? "row" : "column",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#ff9900",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#d13232",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
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
    height: 200,
  },
  paintingTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#0f1111",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  paintingText: {
    fontSize: 16,
    color: "#565959",
    textAlign: "center",
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#d13232",
    padding: 10,
    borderRadius: 6,
    marginTop: 15,
    alignItems: "center",
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
  ordersContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 30 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    width: "100%",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 20 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 1,
    marginBottom: 15,
  },
  orderImageWrapper: {
    marginVertical: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  orderImage: {
    width: "100%",
    height: width > 768 ? 200 : 150,
  },
  orderTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#0f1111",
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    color: "#0f1111",
    marginVertical: 5,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    padding: width > 768 ? 30 : 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    width: "100%",
    flex: 1,
  },
  chatDashboard: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 20,
    flex: 1,
  },
  chatList: {
    flex: width > 768 ? 1 : undefined,
    minWidth: width > 768 ? 250 : "100%",
  },
  chatItem: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 4,
    marginRight: width > 768 ? 10 : 0,
    marginBottom: width <= 768 ? 10 : 0,
  },
  selectedChat: {
    backgroundColor: "#ff9900",
  },
  chatItemText: {
    fontSize: 16,
    color: "#0f1111",
  },
  chatItemSpan: {
    fontSize: 14,
    color: "#565959",
  },
  chatWindow: {
    flex: width > 768 ? 2 : 1,
    minWidth: width > 768 ? 300 : "100%",
    flexDirection: "column",
  },
  chatWindowTitle: {
    fontSize: width > 768 ? 24 : 20,
    color: "#0f1111",
    marginBottom: 15,
  },
  chatMessages: {
    flex: 1,
    maxHeight: width > 768 ? 400 : 200,
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
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
  chatMessageText: {
    fontSize: 16,
    color: "#0f1111",
  },
  chatMessageSpan: {
    fontSize: 12,
    color: "#565959",
  },
  chatInput: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 10,
    marginTop: 15,
  },
  chatInputField: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
  },
  sendButton: {
    backgroundColor: "#ff9900",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d47f00",
    alignItems: "center",
    width: width <= 768 ? "100%" : undefined,
  },
  noRequests: {
    fontSize: 16,
    color: "#565959",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ArtistHome;