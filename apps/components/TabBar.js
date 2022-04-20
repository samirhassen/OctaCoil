import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";

export default function TabBar({ handlePlayerPress }) {
  return (
    <View
      style={{
        height: scale(50),
        backgroundColor: "rgba(0,0,0,0.2)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scale(50),
      }}
    >
      <TouchableOpacity>
        <MaterialIcons name="headset" size={scale(28)} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayerPress}>
        <FontAwesome5 name="compact-disc" size={scale(28)} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Entypo name="info-with-circle" size={32} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}
