import React, { useRef, useState } from "react";
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
import { audioItems } from "../context/AudioProvider";
import { convertTime } from "../misc/helper";

const { width, height } = Dimensions.get("window");

const PlayerComponent = () => {
  let playerRef = useRef();
  const [isPlay, setPlay] = useState(true);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setcurrentTime] = useState(0);

  const [songLoaded, setSongLoaded] = useState(false);

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
          uri: "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/M3U8%2FHarryStyles%2FHarry_Styles_-_As_It_Was_Official_Video.m3u8",
          type: "m3u8",
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
  container: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,

    backgroundColor: "#6200EE",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  innerContainer: {
    textAlign: "center",
    marginLeft: 35,
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
  audioControllers: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    marginTop: 10,
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  audioTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: color.FONT,
    padding: 15,
  },
  audioSubTitle: {
    fontSize: 18,
    color: color.FONT,
    padding: 15,
  },
});

export default TestAudio;
