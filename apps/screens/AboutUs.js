import React from "react";
import color from "../misc/color";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Screen from "../components/Screen";
import { scale } from "react-native-size-matters";
import * as Linking from "expo-linking";
import { URLS } from "../misc/config";

const { width, height } = Dimensions.get("window");

const AboutUs = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
      <ImageBackground
        source={require("../../assets/yoga.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <TouchableOpacity
          style={{
            width: scale(100),

            justifyContent: "center",
            alignItems: "center",
            marginBottom: scale(10),
          }}
          onPress={() => props.navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={scale(30)} color={"black"} />
        </TouchableOpacity>
        <View style={styles.maincontainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.header}></Text>
            <Text style={styles.version}></Text>
            <Text style={styles.info}>
              Spectrum Energy Therapies is dedicated to bringing life-changing
              therapeutic devices to everyone, so that they can take charge of
              their own health and well-being. We feel passionate about making
              products that harness technologies that utilize energy to support
              the body’s innate healing processes in a way that anyone can
              readily implement. We believe in providing high-quality devices
              based on the most current scientific research at affordable prices
              so that everyone can have access to these amazing healing
              technologies. With a highly qualified and dedicated team working
              behind the scenes, we guarantee that any device you receive from
              us will be effective in recharging your cells and optimizing your
              physiology, empowering you to live your life to the fullest.
            </Text>
            <View style={[styles.policyContainer, { marginTop: 30 }]}>
              <TouchableOpacity onPress={() => Linking.openURL(URLS.terms)}>
                <Text style={styles.policyText}>Terms & Conditions</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(URLS.privacy)}>
                <Text style={styles.policyText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.policyContainer,
                { justifyContent: "center", marginTop: 10 },
              ]}
            >
              <TouchableOpacity
                onPress={() => Linking.openURL("mailto: info@spectrumpemf.com")}
              >
                <Text style={styles.policyText}>Contact Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maincontainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: height - 150,
    marginHorizontal: 40,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    paddingHorizontal: 40,
    borderRadius: 10,
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
  innerContainer: {
    textAlign: "center",
  },
  header: {
    marginTop: 20,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  version: {
    marginTop: 10,
    color: "#fff",
  },
  info: {
    fontSize: 15,
    marginTop: 10,
    paddingRight: 10,
    color: "#fff",
  },
  policyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  policyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default AboutUs;
