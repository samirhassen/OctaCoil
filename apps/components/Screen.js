import React, {useEffect} from 'react';
import { ImageBackground, View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import color from '../misc/color';

const Screen = ({ children }) => {

  useEffect(()=> {
      StatusBar.setHidden(false);
  },[]);

  return <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="#192438" barStyle="light-content" />
    <ImageBackground source={require('../../assets/bg.png')} resizeMode="cover" style={styles.image}>
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
