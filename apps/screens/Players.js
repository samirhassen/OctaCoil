import Slider from "@react-native-community/slider";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Sound from "react-native-sound";
import RNFetchBlob from "rn-fetch-blob";
import PlayerButton from "../components/PlayerButton";
import Screen from "../components/Screen";
import { AudioContext } from "../context/AudioProvider";
import {
  pause,
  play,
  stop,
  musicControlListener,
  selectAudio,
} from "../misc/audioController";
import color from "../misc/color";
import { convertTime } from "../misc/helper";
import Video from "react-native-video";

Sound.setActive(true);
Sound.setCategory("Playback", false);
const { width } = Dimensions.get("window");

const Player = () => {
  const context = useContext(AudioContext);
  const {
    currentAudio,
    updateState,
    isAudioPlaying,
    currentAudioIndex,
    sound,
    audioFiles,
    soundTimer,
  } = context;
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [seekbarCurrentValue, setSeekbarCurrentValue] = useState(0);

  useEffect(() => {
    if (!currentAudio) {
      context.loadPreviousAudio();
    } // musicControlListener({ context: context });
    // checkIfDownloaded();
  }, []);

  useEffect(() => {
    if (currentAudio) {
      currentAudioChangedCondition();
      // checkIfDownloaded();
    }
  }, [reRender]);

  const currentAudioChangedCondition = async () => {
    const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);
    if (isAudioPlaying) {
      // await stop({
      //   context,
      // });
      // clearInterval(soundTimer.current);
      // await play({
      //   uri: currentAudio.url,
      //   context,
      //   index: index,
      //   audio: currentAudio,
      //   isPlayer: true,
      // });
      return activateInterval();
    } else {
      return;
    }
  };

  const handlePlayPause = async () => {
    const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);
    if (currentAudioIndex === null) {
      await play({
        uri: currentAudio.url,
        context,
        index,
        audio: currentAudio,
        playDirectly: true,
      });
      return activateInterval();
    }

    if (currentAudioIndex === index) {
      if (isAudioPlaying) {
        return await pause({ context });
      } else {
        await play({
          uri: currentAudio.url,
          context,
          index,
          audio: currentAudio,
          playDirectly: true,
        });
        return activateInterval();
      }
    } else {
      if (isAudioPlaying) {
        await stop({ context });
        clearInterval(soundTimer.current);
        await play({
          uri: currentAudio.url,
          context,
          index,
          audio: currentAudio,
        });
        return activateInterval();
      } else {
        await play({
          uri: currentAudio.url,
          context,
          index,
          audio: currentAudio,
        });
        return activateInterval();
      }
    }
  };
  const handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };

  async function handleNext() {
    setCurrentTime(0);

    try {
      console.log(context, "holaaaaa");
      const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);

      if (index === audioFiles.length - 1) return;
      const nextAudio = audioFiles[index + 1];

      if (isAudioPlaying) {
        setReRender(!reRender);
        await stop({ context });
        await play({
          context,
          uri: nextAudio.url,
          index: index + 1,
          audio: nextAudio,
        });
        // return setReRender(!reRender);
      } else {
        console.log(
          "playing next song an file index is",
          index,
          "context is ",
          context
        );
        await play({
          context,
          uri: nextAudio.url,
          index: index + 1,
          audio: nextAudio,
        });
        // return setReRender(!reRender);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handlePrevious = async () => {
    setCurrentTime(0);

    const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);
    if (index === 0) return;

    if (index === audioFiles.length - 1) return;
    const previousAudio = audioFiles[index - 1];

    if (isAudioPlaying) {
      setReRender(!reRender);
      await stop({ context });
      await play({
        context,
        uri: previousAudio.url,
        index: index - 1,
        audio: previousAudio,
      });
      // return setReRender(!reRender);
    } else {
      await play({
        context,
        uri: previousAudio.url,
        index: index - 1,
        audio: previousAudio,
      });
      // return setReRender(!reRender);
    }
  };

  if (!context.currentAudio) return null;

  const onValueChange = (value) => {
    if (isAudioPlaying && sound.current) {
      setCurrentTime(value * currentAudio.duration);
    }
  };

  const onSlidingComplete = async (value) => {
    if (isAudioPlaying && sound.current) {
      // if (value === 1) {
      //   return handleNext();
      // }
      sound.current.setCurrentTime(value * currentAudio.duration);
    }
  };
  const activateInterval = () => {
    soundTimer.current = setInterval(() => {
      console.log("running interval");

      sound.current &&
        sound.current.getCurrentTime((seconds) => {
          if (seconds + 1 >= currentAudio.duration) {
            // stop({ context });
            // clearInterval(soundTimer.current);
            return handleNext();
          } else {
            setCurrentTime(seconds);
          }
        });
    }, 1000);
  };

  const calculateSeebBar = () => {
    if (currentTime && currentAudio.duration) {
      return currentTime / currentAudio.duration;
    }

    return 0;
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold" }}>From Playlist: </Text>
                <Text>{context.activePlayList.filename}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${
            context.currentAudioIndex + 1
          } / ${context.totalAudioCount}`}</Text>
        </View>
        <View style={styles.midBannerContainer}>
          {!context.isPlaying ? (
            <Image
              source={require("../../assets/yoga.png")}
              style={{ width: 350, height: 280 }}
            />
          ) : (
            <Image
              source={require("../../assets/yoga.png")}
              style={{ width: 350, height: 280 }}
            />
          )}
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <Text style={styles.audioSubTitle}>
            <Text style={{ fontWeight: "bold" }}>Description: </Text>{" "}
            {currentAudio.type},
            {/* <Text style={{ fontWeight: "bold" }}> Song: </Text>{" "}
            {currentAudio.filename} */}
           </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#fff" }}>{convertTime(currentTime)}</Text>
            <Text style={{ color: "#fff" }}>
              {convertTime(currentAudio.duration)}
            </Text>
          </View>

          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={onValueChange}
            onSlidingStart={async () => {
              if (!isAudioPlaying) return;

              try {
                // await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error);
              }
            }}
            onSlidingComplete={onSlidingComplete}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            {audioLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <PlayerButton
                onPress={handlePlayPause}
                style={{ marginHorizontal: 25 }}
                iconType={isAudioPlaying ? "PLAY" : "PAUSE"}
              />
            )}
            <PlayerButton iconType="NEXT" onPress={handleNext} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
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

export default Player;
