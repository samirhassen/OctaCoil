import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AudioList from "../screens/AudioList";
import Player from "../screens/Players";
import { AudioContext } from "../context/AudioProvider";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import AboutUs from "../screens/AboutUs";
import TestAudio from "../screens/TestAudio";
import { View } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  const context = useContext(AudioContext);
  const { isLoggedIn } = context;

  return (
    <Tab.Navigator tabBar={() => <View />}>
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="headset" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" size={28} color={color} />
          ),
        }}
      />
      {/*
      <Tab.Screen
        name={isLoggedIn ? "Logout" : "Login"}
        component={isLoggedIn ? Logout : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name ={isLoggedIn ? "logout" : "login"} size={28} color={color} />
          ),
        }}
      />
      */}
      <Tab.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="TestAudio"
        component={TestAudio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="headset" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
