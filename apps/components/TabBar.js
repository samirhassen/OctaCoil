import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import color from "../misc/color";

export default function TabBar({ handlePlayerPress, onAboutUsPress }) {
  return (
    <View
      style={{
        height: scale(60),
        backgroundColor: "rgba(0,0,0,0.4)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scale(30),
        paddingTop: scale(10),
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: scale(80),
        }}
      >
        <MaterialIcons name="headset" size={scale(28)} color={"white"} />
        <Text
          style={{
            fontSize: scale(12),
            color: color.FONT,
            fontWeight: "300",
            marginTop: scale(7),
            fontWeight: "500",
          }}
        >
          Audio List
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePlayerPress}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: scale(80),
        }}
      >
        <FontAwesome5 name="compact-disc" size={scale(28)} color={"white"} />
        <Text
          style={{
            fontSize: scale(12),
            color: color.FONT,
            fontWeight: "300",
            marginTop: scale(7),
            fontWeight: "500",
          }}
        >
          Player
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAboutUsPress}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: scale(80),
        }}
      >
        <Entypo name="info-with-circle" size={32} color={"white"} />
        <Text
          style={{
            fontSize: scale(12),
            color: color.FONT,
            fontWeight: "300",
            marginTop: scale(7),
            fontWeight: "500",
          }}
        >
          About Us
        </Text>
      </TouchableOpacity>
    </View>
  );
}
