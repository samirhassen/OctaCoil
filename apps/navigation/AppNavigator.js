import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AudioList from "../screens/AudioList";
import { AudioContext } from "../context/AudioProvider";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import AboutUs from "../screens/AboutUs";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  const context = useContext(AudioContext);
  const { isLoggedIn } = context;

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="headset" size={28} color={color} />
          ),
        }}
      />

      <Stack.Screen
        headerMode="none"
        name="AboutUs"
        component={AboutUs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
