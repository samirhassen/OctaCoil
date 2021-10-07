import React from 'react';
import color from '../misc/color';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import Screen from '../components/Screen';

const { width, height } = Dimensions.get('window');

const AboutUs = () => {
    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>OctaCoil Audio Player</Text>
                    <Text style={styles.version}>Version: 1.0.0</Text>
                    <Text style={{fontSize: 20, marginTop: 10, fontWeight:'bold'}}>About Us</Text>
                    <Text style={styles.info}>This Audio player have 3 screen.</Text>
                        <Text style={styles.info}>AudioList</Text>
                        <Text style={styles.info}>Players</Text>
                        <Text style={styles.info}>Login</Text>

                        <Text style={styles.info}>*  AudioList is list of all audio fetching from assest folder. In audio list there are audio file name, time duration and audio details.User can play and pause audio from tap on audio list.</Text>
                        <Text style={styles.info}>*  Players screen is used to control the audio like play, pause, next and previous. Looping functionality, seeking bar is also given in player screen.</Text>
                        <Text style={styles.info}>*  Login screen used to login the user first the user. Required field is EmailID and Password.</Text>
                        <Text style={styles.info}>*  Registration screen is used to register the user. Required field is full Name, emailID, password and confirm Password. password and confirm password should be same.</Text>
                </View>
            </View>
        </Screen>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        width:  width-70,
        height: height-150,
        marginLeft: 35,
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    innerContainer: {
        textAlign: 'center',
        marginLeft: 35
    },
    header: {
        marginTop:20,
        fontSize: 24,
        fontWeight: 'bold'
    },
    version: {
        marginTop: 10
    },
    info: {
        fontSize: 15,
        marginTop:10,
        paddingRight:10
    }
});

export default AboutUs;