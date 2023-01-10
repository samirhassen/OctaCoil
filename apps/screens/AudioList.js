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
  Platform,
  Switch,
  SafeAreaView,
} from "react-native";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import { AudioContext, audioItems } from "../context/AudioProvider";
import PlayerButton from "../components/PlayerButton";
import Slider from "@react-native-community/slider";
// import Video from "react-native-video";
import color from "../misc/color";
import { Video, AVPlaybackStatus } from "expo-av";

import { convertTime } from "../misc/helper";
import TabBar from "../components/TabBar";
import {
  mod,
  moderateScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
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
function secondsToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  var obj = {
    h: hours,
    m: minutes,
    s: seconds,
  };
  var str = "";
  if (obj.h > 0) {
    str = obj.h + " hr ";
  }
  if (obj.m > 0) {
    str = str + obj.m + " mins";
  }
  return str;
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
  const [position, setPosition] = useState(undefined);

  const [currentSongUrl, setCurrentSongUrl] = useState("");
  const [slidingStart, setSlidingStart] = useState(false);
  const [songLoaded, setSongLoaded] = useState(false);
  const formatedTime = (time) => {
    var minutes = "0" + Math.floor(time / 60);
    var seconds = "0" + (time - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  };
  // TIMER

  const [timer, setTimer] = useState(false);
  const [timerModal, setTimerModal] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  console.log(currentTime, "yoyo");
  const nextButtonHandle = async (index) => {
    clearTimeout();
    console.log("audioItems.length", audioItems.length);
    await setPlay(false);

    if (currentSong >= 0 && currentSong < audioItems.length - 1) {
      console.log("set current song", currentSong + 1);
      (await Platform.OS) === "ios"
        ? LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        : null;
      await setCurrentSong(index ? index : currentSong + 1);

      await setCurrentSongTempValue(0);
      await setcurrentTime(0);
      await setTimerValue(0);

      await setPosition(0);
    } else if (currentSong === audioItems.length - 1) {
      await setCurrentSong(0);

      await setCurrentSongTempValue(0);
      await setcurrentTime(0);
      await setTimerValue(0);

      await setPosition(0);
    }
    setTimeout(async () => {
      await setPlay(true);
    }, 200);
  };
  const previousButtonHandle = async () => {
    await setPlay(false);

    if (currentSong >= 1) {
      console.log("set current song", currentSong + 1);
      (await Platform.OS) === "ios"
        ? LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        : null;
      await setCurrentSongTempValue(0);
      await setcurrentTime(0);
      await setPosition(0);

      await setCurrentSong(currentSong - 1);
    }
    await setPlay(true);
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
  const handleItemClick = async (index) => {
    console.log("set current songfdsfs", index);

    if (index >= 0 && index < audioItems.length) {
      console.log("set current song", index);
      (await Platform.OS) === "ios"
        ? LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        : null;
      await setcurrentTime(0);

      await setCurrentSongTempValue(0);
      await setPosition(0);
      await setTimerValue(0);

      await setCurrentSong(index);
    }
    await setPlay(true);
  };
  const repeatHandle = async () => {
    setPlay(true);

    console.log("hello", playerRef.seek);
    // playerRef.seek(0);
    setCurrentSongTempValue(0);
    setPosition(0);
    setTimerValue(0);
    // setPlay(true);
  };
  const timerRef = useRef(null);

  const setTimerTimeout = (seconds) => {
    console.log(seconds);
    timerRef.current = setTimeout(() => {
      console.log("setting false");
      setTimerValue(0);
      setPlay(false);
      /** Your logic goes here */
    }, seconds);
  };

  return (
    <Screen>
      <View style={{ flex: 1, marginTop: verticalScale(40) }}>
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
                openPlayer={async () => {
                  await setplayerModalVisible(true);
                }}
                fileNameExtension={fileExtension}
                type={item.type}
                title={item.filename}
                album={item.album}
                url={Platform.OS == "android" ? item.urlAndroid : item.urlIOS}
                isDownloaded={item?.isDownloaded}
                duration={item.duration}
                activeListItem={currentSong === index}
                isPlaying={isPlay}
                handleItemClick={nextButtonHandle}
                index={index}
                // onAudioPress={onAudioPress}
              />
            );
          }}
        />
        {/* <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      /> */}
        <Video
          // bufferConfig={{
          //   minBufferMs: 2000,
          //   maxBufferMs: 5000,
          //   bufferForPlaybackMs: 2000,
          //   bufferForPlaybackAfterRebufferMs: 2000,
          // }}
          progressUpdateIntervalMillis={1000}
          isLooping={repeat}
          // playInBackground={true}
          shouldPlay={isPlay}
          onError={(err) => {
            console.log(err);
          }}
          positionMillis={position}
          onLoad={(val) => {
            Platform.OS === "ios"
              ? LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
              : null;

            setDuration(val.durationMillis / 1000);
            setSongLoaded(true);
          }}
          onPlaybackStatusUpdate={(prog) => {
            !slidingStart &&
              setCurrentSongTempValue(prog.positionMillis / 1000);

            console.log(prog.positionMillis / 1000);

            setcurrentTime(prog.positionMillis / 1000);

            if (
              prog.durationMillis === prog.positionMillis &&
              prog.durationMillis > 0 &&
              prog.positionMillis > 0
            ) {
              console.log(
                currentTime === duration && duration > 0 && currentTime > 0,
                duration,
                currentTime
              );
              repeat ? repeatHandle() : nextButtonHandle();
              return;
            }
          }}
          useNativeControls={true}
          audioOnly={true}
          onLoadStart={() => {
            Platform.OS === "ios"
              ? LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
              : null;

            setSongLoaded(false);
            setDuration(0);
            setcurrentTime(0);
            setCurrentSongTempValue(0);
          }}
          // one={() => (repeat ? repeatHandle() : nextButtonHandle())}
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
          {!timerModal ? (
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
                  paddingTop: moderateScale(50),
                  alignItems: "center",
                  flex: 1,
                }}
                activeOpacity={1}
              >
                <FontAwesome5
                  name="chevron-down"
                  size={moderateScale(28)}
                  color={"white"}
                />
                <Banner />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
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
                    {convertTime(currentTime)}
                  </Text>
                  <Text style={{ color: "#fff" }}>{convertTime(duration)}</Text>
                </View>

                <Slider
                  style={{ height: 40 }}
                  minimumValue={0}
                  maximumValue={duration}
                  value={currentTime || 0}
                  // onSlidingStart={() => setSlidingStart(true)}
                  minimumTrackTintColor={color.FONT_MEDIUM}
                  maximumTrackTintColor={color.ACTIVE_BG}
                  // onValueChange={(val) => setPosition(Math.round(val * 1000))}
                  onSlidingComplete={async (val) => {
                    // console.log(val, "___");

                    setPosition(val * 1000);

                    setcurrentTime(val * 1000);
                    // setSlidingStart(false);
                    // setCurrentSongTempValue(Math.round(val * 1000));
                    // currentTime && duration
                    //   ? playerRef.seek(duration * val)
                    //   : null;
                  }}
                />
                <View style={styles.audioControllers}>
                  <TouchableOpacity
                    onPress={() => setTimerModal(true)}
                    style={{
                      width: scale(100),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name="timer"
                      size={scale(30)}
                      color={color.FONT_MEDIUM}
                    />
                  </TouchableOpacity>
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
                          setPosition(currentTime * 1000);
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
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                padding: moderateScale(20),
              }}
            >
              <SafeAreaView
                style={{ flex: 1, justifyContent: "space-between" }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: "white",
                    alignSelf: "center",
                    fontSize: 20,
                    paddingVertical: 10,
                  }}
                >
                  Set Sleep Timer:
                </Text>
                <View style={{ minHeight: 100 }}>
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "white",
                      alignSelf: "center",
                      fontSize: 40,
                    }}
                  >
                    {secondsToTime(timerValue) || "Off"}
                  </Text>
                  <Slider
                    style={{ height: 40 }}
                    minimumValue={0}
                    maximumValue={43200}
                    step={60}
                    value={timerValue}
                    // onSlidingStart={() => setSlidingStart(true)}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                    onValueChange={setTimerValue}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: color.ACTIVE_BG,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      if (timerValue < 60) {
                        setTimerModal(false);

                        return;
                      }
                      if (timerRef.current) {
                        clearTimeout(timerRef.current);
                      }
                      setTimerModal(false);

                      setTimerTimeout(timerValue * 1000);
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      CONFIRM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setTimerModal(false);
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 5,
                      marginTop: 8,
                      borderWidth: 2,
                      backgroundColor: "white",
                    }}
                  >
                    <Text
                      style={{ color: color.ACTIVE_BG, fontWeight: "bold" }}
                    >
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </View>
          )}
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
