import React, { useContext, useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  View,
  ActivityIndicator,
} from "react-native";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import { AudioContext, audioItems } from "../context/AudioProvider";
import PlayerButton from "../components/PlayerButton";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import color from "../misc/color";

import { convertTime } from "../misc/helper";

const { width, height } = Dimensions.get("window");

export const AudioList = () => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const { audioFiles } = useContext(AudioContext);
  const [playerModalVisible, setplayerModalVisible] = useState(false);
  let playerRef = useRef();
  const [isPlay, setPlay] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setcurrentTime] = useState(0);
  const [currentSongUrl, setCurrentSongUrl] = useState("");
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
  // rowRenderer = (type, item, index, extendedState) => {
  //   return (
  //     <AudioListFunc
  //       type={type}
  //       item={item}
  //       index={index}
  //       extendedState={extendedState}
  //       onOptionPress={() => {
  //         this.currentItem = item;
  //         this.setState({ ...this.state, optionModalVisible: true });
  //       }}
  //     />
  //   );
  // };

  return (
    <Screen>
      <View style={{ flex: 1, marginTop: 20 }}>
        <FlatList
          data={audioFiles}
          renderItem={({ item, index }) => {
            const fileExtension =
              Platform.OS === "ios"
                ? item.fileNameExtIOS
                : item.fileNameExtAndroid;
            return (
              <AudioListItem
                key={fileExtension + index}
                openPlayer={() => setplayerModalVisible(true)}
                fileNameExtension={fileExtension}
                type={item.type}
                title={item.filename}
                album={item.album}
                url={Platform.OS == "android" ? item.urlAndroid : item.urlIOS}
                isDownloaded={item?.isDownloaded}
                duration={item.duration}
                activeListItem={currentSong === index}
                isPlaying={isPlay}
                // onAudioPress={onAudioPress}
              />
            );
          }}
        />
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
            uri: audioFiles[currentSong]?.url,
          }}
          ref={(ref) => {
            playerRef = ref;
          }} // Store reference
          // Callback when video cannot be loaded
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={playerModalVisible}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "flex-end",
              paddingBottom: 30,
              marginTop: 100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setplayerModalVisible(false);
              }}
              style={{
                backgroundColor: "white",
                alignSelf: "flex-start",
                height: 30,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text>close</Text>
            </TouchableOpacity>

            <Text numberOfLines={1} style={styles.audioTitle}>
              {audioFile.filename}
            </Text>
            <Text style={styles.audioSubTitle}>
              <Text style={{ fontWeight: "bold" }}>Tag: </Text> {audioFile.type}
              ,<Text style={{ fontWeight: "bold" }}> Song: </Text>{" "}
              {audioFile.filename}
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
              <PlayerButton
                iconType="PREV"
                onPress={() => previousButtonHandle()}
              />
              <View
                style={{
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
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

              <PlayerButton
                iconType="NEXT"
                onPress={() => nextButtonHandle()}
              />
              <PlayerButton
                iconType="NEXT"
                onPress={() => console.log(audioFiles)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
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

export default AudioList;
