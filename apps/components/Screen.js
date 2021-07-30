import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar } from 'react-native';
import color from '../misc/color';

const Screen = ({ children }) => {
  return <View style={styles.container}>
    <ImageBackground source={require('../../assets/bg.jpg')} resizeMode="cover" style={styles.image}>
    {children}
    </ImageBackground>
    </View>;
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
