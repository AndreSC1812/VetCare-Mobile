// HomeTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons icons
import VeterinariansScreen from "../screens/VeterinariansScreen"; // Veterinarians screen
import PetsScreen from "../screens/PetsScreen"; // Pets screen
import ProfileScreen from "../screens/ProfileScreen"; // Profile screen
import AppointmentsScreen from "../screens/AppointmentsScreen"; // Appointments screen

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Veterinarians"
      screenOptions={{
        tabBarActiveTintColor: "#3bbba4", // Active tab color
        tabBarInactiveTintColor: "#777", // Inactive tab color
        tabBarStyle: {
          backgroundColor: "#fff", // Tab bar background
          borderTopWidth: 1,
          borderTopColor: "#eee", // Top border color
        },
      }}
    >
      <Tab.Screen
        name="Veterinarians"
        component={VeterinariansScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen} // Appointments screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
