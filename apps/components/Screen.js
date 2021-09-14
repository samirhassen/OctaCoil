import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import color from '../misc/color';

const Screen = ({ children }) => {
  return <SafeAreaView style={styles.container}>
    <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={styles.image}>
    {children}
    </ImageBackground>
    </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  }
});

export default Screen;
