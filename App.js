import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { API_URL } from "@env";

export default function App() {
  console.log("API_URL:", API_URL); // Logs the API URL from the environment variables

  return (
    <>
      {/* Set the status bar style to "dark" for dark text */}
      <StatusBar style="dark" translucent={true} />
      <AppNavigator />
    </>
  );
}
