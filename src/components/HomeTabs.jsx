// HomeTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Importa los iconos de Ionicons
import VeterinariansScreen from "../screens/VeterinariansScreen"; // Pantalla de Veterinarios
import PetsScreen from "../screens/PetsScreen"; // Pantalla de Mascotas
import ProfileScreen from "../screens/ProfileScreen"; // Pantalla de Perfil
import AppointmentsScreen from "../screens/AppointmentsScreen"; // Nueva pantalla de Citas

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Veterinarios"
      screenOptions={{
        tabBarActiveTintColor: "#3bbba4", // Color para las pestañas activas
        tabBarInactiveTintColor: "#777", // Color para las pestañas inactivas
        tabBarStyle: {
          backgroundColor: "#fff", // Fondo de la barra de pestañas
          borderTopWidth: 1,
          borderTopColor: "#eee", // Color de la línea superior
        },
      }}
    >
      <Tab.Screen
        name="Veterinarios"
        component={VeterinariansScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mascotas"
        component={PetsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        component={AppointmentsScreen} // Nueva pantalla de Citas
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
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
