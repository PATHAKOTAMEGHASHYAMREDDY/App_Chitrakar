import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";

const Home = require("../screens/Home.jsx");
const Artistlog = require("../screens/Artistlog.jsx");
const ArtistHome = require("../screens/ArtistHome.jsx");
const CustomerHome = require("../screens/CustomerHome.jsx");
const Customerlog = require("../screens/Customerlog.jsx");
const CustomerOrders = require("../screens/CustomerOrders.jsx");
const ForgotPassword = require("../screens/ForgotPassword.jsx");
const Team = require("../screens/Team.jsx");

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Artistlog" component={Artistlog} />
        <Stack.Screen name="ArtistHome" component={ArtistHome} />
        <Stack.Screen name="CustomerHome" component={CustomerHome} />
        <Stack.Screen name="Customerlog" component={Customerlog} />
        <Stack.Screen name="CustomerOrders" component={CustomerOrders} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Team" component={Team} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}