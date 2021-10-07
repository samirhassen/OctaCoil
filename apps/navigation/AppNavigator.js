import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from '../screens/AudioList';
import Player from '../screens/Players';
import { AudioContext } from '../context/AudioProvider';
import PlayList from '../screens/PlayList';
import Login from '../screens/Login';
import {
  View,
  Alert
} from 'react-native';
import Screen from '../components/Screen';
import { MaterialIcons, FontAwesome5, Entypo  } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';
import Registration from '../screens/Registration';
import AboutUs from '../screens/AboutUs';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LoginScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Registration' component={Registration} />
    </Stack.Navigator>
  );
};


const Logout = () => {
  const context = useContext(AudioContext);
  const { isLoggedIn, updateState } = context;

  const onLogout = (type) => {
    if(type == 'yes') {
      updateState({}, { isLoggedIn: false });
    }
  }

  Alert.alert(
    "Logout",
    "You have successfully logged out.",
    [
      { text: "Ok", onPress: () => onLogout('yes') }
    ]
  )
  return(
    <Screen></Screen>
  );
};



const AppNavigator = () => {
  const context = useContext(AudioContext);
  const { isLoggedIn } = context;

  return (
    <Tab.Navigator>
      <Tab.Screen name ='AudioList'
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='headset' size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Player'
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='compact-disc' size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={isLoggedIn ? "Logout" : "Login"}
        component={isLoggedIn ? Logout : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name ={isLoggedIn ? "logout" : "login"} size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='AboutUs'
        component={AboutUs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;