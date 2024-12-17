import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { API_URL } from "@env";

export default function App() {
  console.log("API_URL:", API_URL);
  return (
    <>
      {/* Cambiar el estilo a "dark" para que el texto de la barra de estado sea oscuro */}
      <StatusBar style="dark" translucent={true} />
      <AppNavigator />
    </>
  );
}
