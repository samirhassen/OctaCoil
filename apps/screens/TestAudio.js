import React, { useContext, useRef, useState } from "react";
import color from "../misc/color";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import PlayerButton from "../components/PlayerButton";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";

import Screen from "../components/Screen";
import { AudioContext, audioItems } from "../context/AudioProvider";
import { convertTime } from "../misc/helper";

const { width, height } = Dimensions.get("window");
import storage from "@react-native-firebase/storage";

const PlayerComponent = () => {
  let playerRef = useRef();
  const [isPlay, setPlay] = useState(true);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setcurrentTime] = useState(0);
  const [currentSongUrl, setCurrentSongUrl] = useState("");
  const [songLoaded, setSongLoaded] = useState(false);
  const context = useContext(AudioContext);
  const formatedTime = (time) => {
    var minutes = "0" + Math.floor(time / 60);
    var seconds = "0" + (time - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  };
  const nextButtonHandle = () => {
    if (currentSong >= 0 && currentSong < audioItems.length) {
      console.log("set current song", currentSong + 1);

      setCurrentSong(currentSong + 1);
    }
  };
  const previousButtonHandle = () => {
    if (currentSong >= 1) {
      console.log("set current song", currentSong + 1);

      setCurrentSong(currentSong - 1);
    }
  };
  const audioFile = audioItems[currentSong];
  // const reference = storage()
  //   .ref("/M3U8/Focus/playlist.m3u8")
  //   .getDownloadURL()
  //   .then((val) => {
  //     console.log(val);
  //     setCurrentSongUrl(val);
  //   });
  return (
    <View style={styles.audioPlayerContainer}>
      <Video
        bufferConfig={{
          minBufferMs: 2000,
          maxBufferMs: 5000,
          bufferForPlaybackMs: 2000,
          bufferForPlaybackAfterRebufferMs: 2000,
        }}
        playInBackground={false}
        paused={!isPlay}
        onLoad={(val) => {
          setDuration(val.duration);
          setSongLoaded(true);
        }}
        onProgress={(prog) => {
          setcurrentTime(prog.currentTime);
        }}
        audioOnly={true}
        onLoadStart={() => {
          setSongLoaded(false);
          setDuration(0);
          setcurrentTime(0);
        }}
        onEnd={() => nextButtonHandle()}
        // source={{
        //   uri: audioItems[currentSong].urlIOS,
        // }} // Can be a URL or a local file.
        source={{
          uri:
            Platform.OS == "android" ? audioFile.urlAndroid : audioFile.urlIOS,
        }}
        ref={(ref) => {
          playerRef = ref;
        }} // Store reference
        // Callback when video cannot be loaded
      />
      <Text numberOfLines={1} style={styles.audioTitle}>
        {audioFile.filename}
      </Text>
      <Text style={styles.audioSubTitle}>
        <Text style={{ fontWeight: "bold" }}>Tag: </Text> {audioFile.type},
        <Text style={{ fontWeight: "bold" }}> Song: </Text> {audioFile.filename}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ color: "#fff" }}>{convertTime(currentTime)}</Text>
        <Text style={{ color: "#fff" }}>{convertTime(duration)}</Text>
      </View>

      <Slider
        style={{ width: width, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        value={currentTime && duration ? currentTime / duration : 0}
        minimumTrackTintColor={color.FONT_MEDIUM}
        maximumTrackTintColor={color.ACTIVE_BG}
        onValueChange={(val) => {
          currentTime && duration ? playerRef.seek(duration * val) : null;
        }}
        onSlidingStart={async () => {}}
        onSlidingComplete={(val) => {
          console.log(duration * val);
          currentTime && duration ? playerRef.seek(duration * val) : null;
        }}
      />
      <View style={styles.audioControllers}>
        <PlayerButton iconType="PREV" onPress={() => previousButtonHandle()} />
        <View
          style={{ width: 100, justifyContent: "center", alignItems: "center" }}
        >
          {!songLoaded ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <PlayerButton
              onPress={() => {
                setPlay(!isPlay);
              }}
              style={{ marginHorizontal: 25 }}
              iconType={isPlay ? "PLAY" : "PAUSE"}
            />
          )}
        </View>

        <PlayerButton iconType="NEXT" onPress={() => nextButtonHandle()} />
        <PlayerButton iconType="NEXT" onPress={() => console.log(context)} />
      </View>
    </View>
  );
};

const TestAudio = () => {
  const playerRef = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="rgba(0,0,0,0)"
        barStyle="dark-content"
        transculent={true}
      />
      <View style={styles.maincontainer}>
        <PlayerComponent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  marginFromTop: {
    marginTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    height: 90,
    marginLeft: 24,
    marginTop: 45,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  btnstyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingBottom: 2,
    marginLeft: 5,
    borderRadius: 4,
    elevation: 3,
    opacity: 0.7,
    backgroundColor: "white",
  },
  iconStyle: {
    marginLeft: 20,
    marginTop: 10,
  },
  btnText: {
    fontSize: 20,
  },
});

export default TestAudio;
