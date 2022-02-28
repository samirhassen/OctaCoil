import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  await AsyncStorage.setItem(
    "previousAudio",
    JSON.stringify({ audio: { ...audio, lastPosition }, index })
  );
};

export const convertTime = (seconds) => {
  let s = parseInt(seconds);
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
};
