import React, { useEffect } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import color from "../misc/color";

const bgImage = require("../../assets/bg.png");
const Screen = ({ children }) => {
  useEffect(() => {
    StatusBar.setHidden(false);
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: "rgba(0,0,0,0)" }}
        translucent={true}
      />
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        translucent={true}
      />
      {children}
      <SafeAreaView
        style={{ flex: 0, backgroundColor: "rgba(0,0,0,0)" }}
        backgroundColor="rgba(0,0,0,0.4)"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Screen;
