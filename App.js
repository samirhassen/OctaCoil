import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { AudioProvider } from "./apps/context/AudioProvider";
import AppNavigator from "./apps/navigation/AppNavigator";

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <StatusBar backgroundColor={"black"} />
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
    alignItems: "center",
    justifyContent: "center",
  },
});
