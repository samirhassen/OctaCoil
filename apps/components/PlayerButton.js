import React from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";
import { scale } from "react-native-size-matters";

const PlayerButton = (props) => {
  const { iconType, size = scale(38), iconColor = color.FONT, onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "forward";
      case "PREV":
        return "banckward";
    }
  };
  return (
    <AntDesign
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
