import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AudioList} from '../screens/AudioList';
import Players from '../screens/Players';
import PlayList from '../screens/PlayList';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator =() => {
    return (
        <Tab.Navigator>
            <Tab.Screen name = "AudioList" component = {AudioList} options ={{
                tabBarIcon: ({color, size}) => {
                    return <MaterialIcons name="headset" size={size} color={color} />
                }
            }}/>
            <Tab.Screen name = "players" component = {Players} options ={{
                tabBarIcon: ({color, size}) => {
                    return <FontAwesome5 name="compact-disc" size={size} color={color} />
                }
            }}/>
            <Tab.Screen name = "PlayList" component = {PlayList} options ={{
                tabBarIcon: ({color, size}) => {
                    return <MaterialIcons name="library-music" size={size} color={color} />
                }
            }}/>
        </Tab.Navigator>
    )
    
}

export default AppNavigator;