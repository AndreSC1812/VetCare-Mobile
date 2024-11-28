import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen"; // Pantalla de inicio de sesión
import RegisterScreen from "../screens/RegisterScreen"; // Pantalla de registro
import HomeScreen from "../screens/HomeScreen"; // Pantalla Home
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import CreateFirstPetScreen from "../screens/CreateFirstPetScreen";
import UploadPetImageScreen from "../screens/UploadPetImageScreen";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta el header para todas las pantallas
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateFirstPet" component={CreateFirstPetScreen} />
        <Stack.Screen name="UploadPetImage" component={UploadPetImageScreen} />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
