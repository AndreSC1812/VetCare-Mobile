import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen"; // Login screen
import RegisterScreen from "../screens/RegisterScreen"; // Register screen
import CompleteProfileScreen from "../screens/CompleteProfileScreen"; // Complete profile screen
import CreateFirstPetScreen from "../screens/CreateFirstPetScreen"; // Create first pet screen
import UploadPetImageScreen from "../screens/UploadPetImageScreen"; // Upload pet image screen
import HomeTabs from "../components/HomeTabs"; // Tabs showing main content
import CreatePetScreen from "../screens/CreatePetScreen"; // Create pet screen
import PetDetailScreen from "../screens/PetDetailScreen"; // Pet details screen
import UpdatePetScreen from "../screens/UpdatePetScreen"; // Update pet screen
import VeterinarianDetailScreen from "../screens/VeterinarianDetailScreen"; // Veterinarian details screen
import EditClientDataScreen from "../screens/EditClientDataScreen"; // Edit client data screen
import ChangeProfileImageScreen from "../screens/ChangeProfileImageScreen"; // Change profile image screen
import PetReportsScreen from "../screens/PetReportsScreen"; // Pet reports screen
import ReportDetailScreen from "../screens/ReportDetailScreen"; // Report detail screen
import AppointmentScreen from "../screens/AppointmentScreen"; // Appointment screen

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen
          name="VeterinarianDetail"
          component={VeterinarianDetailScreen}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="PetReports" component={PetReportsScreen} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
        <Stack.Screen
          name="ChangeProfileImage"
          component={ChangeProfileImageScreen}
        />
        <Stack.Screen name="EditClientData" component={EditClientDataScreen} />
        <Stack.Screen name="UpdatePet" component={UpdatePetScreen} />
        <Stack.Screen name="CreateFirstPet" component={CreateFirstPetScreen} />
        <Stack.Screen name="UploadPetImage" component={UploadPetImageScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="CreatePet" component={CreatePetScreen} />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
