import React from 'react';
import color from '../misc/color';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  View,
  Dimensions
} from 'react-native';

import Screen from '../components/Screen';

const { width, height } = Dimensions.get('window');

const AboutUs = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
            <ImageBackground source={require('../../assets/yoga.png')} resizeMode="cover" style={styles.image}>
            <View style={styles.maincontainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.header}>OctaCoil Audio Player</Text>
                    <Text style={styles.version}>Version: 1.0.0</Text>
                    <Text style={{fontSize: 20, marginTop: 10, fontWeight:'bold', color: '#fff'}}>About Us</Text>                        
                        <Text style={styles.info}>Spectrum Energy Therapies is dedicated to bringing life-changing 
                        therapeutic devices to everyone, so that they can take charge of their own health and well-being. 
                        We feel passionate about making products that harness technologies that utilize energy to support 
                        the body’s innate healing processes in a way that anyone can readily implement. 
                        We believe in providing high-quality devices based on the most current scientific research at affordable prices so that 
                        everyone can have access to these amazing healing technologies. With a highly qualified and dedicated team working 
                        behind the scenes, we guarantee that any device you receive from us will be effective in recharging your cells and optimizing 
                        your physiology, empowering you to live your life to the fullest.</Text>
                </View>
            </View>
            </ImageBackground>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex:1
    },
    maincontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width:  width-70,
        height: height-150,
        marginLeft: 35,
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
      image: {
        flex: 1,
        justifyContent: "center"
      },
    innerContainer: {
        textAlign: 'center',
        marginLeft: 35
    },
    header: {
        marginTop:20,
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold'
    },
    version: {
        marginTop: 10,
        color: '#fff'
    },
    info: {
        fontSize: 15,
        marginTop:10,
        paddingRight:10,
        color: '#fff'
    }
});

export default AboutUs;