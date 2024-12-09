import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen"; // Pantalla de inicio de sesión
import RegisterScreen from "../screens/RegisterScreen"; // Pantalla de registro
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import CreateFirstPetScreen from "../screens/CreateFirstPetScreen";
import UploadPetImageScreen from "../screens/UploadPetImageScreen";
import HomeTabs from "../components/HomeTabs"; //Nuestas tabs que muestran el contenido
import CreatePetScreen from "../screens/CreatePetScreen";
import PetDetailScreen from "../screens/PetDetailScreen";
import UpdatePetScreen from "../screens/UpdatePetScreen";

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
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UpdatePet" component={UpdatePetScreen} />
        <Stack.Screen name="CreateFirstPet" component={CreateFirstPetScreen} />
        <Stack.Screen name="UploadPetImage" component={UploadPetImageScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="CreatePetScreen" component={CreatePetScreen} />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
