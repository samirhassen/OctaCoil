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
  Image,
  LayoutAnimation,
  UIManager,
} from "react-native";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import { AudioContext, audioItems } from "../context/AudioProvider";
import PlayerButton from "../components/PlayerButton";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import color from "../misc/color";

import { convertTime } from "../misc/helper";
import TabBar from "../components/TabBar";
import { mod, moderateScale, scale } from "react-native-size-matters";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");
const yoga = require("../../assets/yoga.png");
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Banner = () => (
  <LottieView
    style={{
      width: moderateScale(300),
      height: moderateScale(350),
      alignSelf: "center",
    }}
    source={require("../../assets/Lottie/Yoga.json")}
    autoPlay
    loop
  />
  // <Image
  //   source={yoga}
  //   resizeMode="contain"
  //   style={{
  //     width: moderateScale(300),
  //     height: moderateScale(350),
  //     alignSelf: "center",
  //   }}
  // />
);

export const AudioList = (props) => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const { audioFiles } = useContext(AudioContext);
  const [playerModalVisible, setplayerModalVisible] = useState(false);
  let playerRef = useRef();
  const [isPlay, setPlay] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentSongTempValue, setCurrentSongTempValue] = useState(0);

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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      setCurrentSongTempValue(0);
      setcurrentTime(0);

      setCurrentSong(currentSong + 1);
    }
  };
  const previousButtonHandle = () => {
    if (currentSong >= 1) {
      console.log("set current song", currentSong + 1);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      setCurrentSongTempValue(0);
      setcurrentTime(0);
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
  const handleItemClick = (index) => {
    console.log("set current song", index + 1);

    if (index >= 0 && index < audioItems.length) {
      console.log("set current song", index + 1);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      setCurrentSongTempValue(0);

      setCurrentSong(index);
      setPlay(true);
    }
  };
  const repeatHandle = () => {
    currentTime && duration ? playerRef.seek(0) : null;
    setCurrentSongTempValue(0);
    setcurrentTime(0);

    setPlay(true);
  };
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
                handleItemClick={handleItemClick}
                index={index}
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
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

            setDuration(val.duration);
            setSongLoaded(true);
          }}
          onProgress={(prog) => {
            setcurrentTime(prog.currentTime);
            setCurrentSongTempValue(prog.currentTime);
          }}
          audioOnly={true}
          onLoadStart={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

            setSongLoaded(false);
            setDuration(0);
            setcurrentTime(0);
            setCurrentSongTempValue(0);
          }}
          onEnd={() => (repeat ? repeatHandle() : nextButtonHandle())}
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
        <TabBar
          handlePlayerPress={() => setplayerModalVisible(true)}
          onAboutUsPress={() => props.navigation.navigate("AboutUs")}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={playerModalVisible}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.9)",
              padding: moderateScale(20),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setplayerModalVisible(false);
              }}
              style={{
                marginTop: moderateScale(50),
                height: moderateScale(100),
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="chevron-down"
                size={moderateScale(28)}
                color={"white"}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <Banner />
              {!songLoaded ? (
                <Text numberOfLines={1} style={styles.loadingText}>
                  Loading high quality sound...
                </Text>
              ) : null}
              <Text numberOfLines={1} style={styles.audioTitle}>
                {audioFile.filename}
              </Text>
              <Text style={styles.audioSubTitle}>
                <Text style={{ fontWeight: "bold" }}>Tag: </Text>{" "}
                {audioFile.type},
                <Text style={{ fontWeight: "bold" }}> Song: </Text>{" "}
                {audioFile.filename}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {convertTime(currentSongTempValue)}
                </Text>
                <Text style={{ color: "#fff" }}>{convertTime(duration)}</Text>
              </View>

              <Slider
                style={{ height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={currentTime && duration ? currentTime / duration : 0}
                minimumTrackTintColor={color.FONT_MEDIUM}
                maximumTrackTintColor={color.ACTIVE_BG}
                onValueChange={(val) => setCurrentSongTempValue(duration * val)}
                onSlidingComplete={(val) => {
                  currentTime && duration
                    ? playerRef.seek(duration * val)
                    : null;
                }}
              />
              <View style={styles.audioControllers}>
                <View
                  style={{
                    width: scale(100),
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></View>
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
                <TouchableOpacity
                  style={{
                    width: scale(100),

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setRepeat(!repeat)}
                >
                  <MaterialIcons
                    name="repeat"
                    size={scale(30)}
                    color={repeat ? color.ACTIVE_BG : color.FONT_MEDIUM}
                  />
                </TouchableOpacity>
              </View>
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 10,
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
  },
  audioTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 15,
  },
  audioSubTitle: {
    fontSize: 18,
    color: color.FONT,
    paddingVertical: 15,
  },
  loadingText: {
    fontSize: scale(14),
    color: color.FONT,
    paddingBottom: scale(15),
    alignSelf: "center",
    fontWeight: "300",
  },
});

export default AudioList;
