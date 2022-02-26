import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  changeAudio,
  moveAudio,
  pause,
  playNext,
} from "../misc/audioController";
import { convertTime } from "../misc/helper";
import { selectAudio } from "../misc/audioController";
import RNFetchBlob from "rn-fetch-blob";
import Sound from "react-native-sound";

const { width } = Dimensions.get("window");

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const {
    playbackPosition,
    playbackDuration,
    currentAudio,
    updateState,
    isAudioPlaying,
    currentAudioIndex,
    sound,
    audioFiles,
    soundTimer,
  } = context;
  const [isDownloaded, setisDownloaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const calculateSeebBar = () => {
    if (currentTime && currentAudio.realDuration) {
      return currentTime / currentAudio.realDuration;
    }

    return 0;
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  useEffect(() => {
    checkIfDownloaded();
  }, []);

  useEffect(() => {
    currentAudioChangedCondition();
  }, [currentAudio]);

  const currentAudioChangedCondition = async () => {
    if (isAudioPlaying) {
      if (currentAudio && currentAudio.realDuration) return;
      const _isDownloaded = await checkIfDownloaded();
      sound.current.stop();
      clearInterval(soundTimer.current);
      const uri = !_isDownloaded
        ? Platform.OS === "ios"
          ? currentAudio.urlIOS
          : currentAudio.urlAndroid
        : RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
      sound.current = new Sound(uri, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        sound.current.play();
        activateInterval();
        updateState(context, {
          currentAudio: {
            ...currentAudio,
            realDuration: sound.current.getDuration(),
          },
        });
      });
    } else {
      if (currentAudio && currentAudio.realDuration) return;
      const _isDownloaded = await checkIfDownloaded();
      console.log("isDownloaded", _isDownloaded);
      const uri = !_isDownloaded
        ? Platform.OS === "ios"
          ? currentAudio.urlIOS
          : currentAudio.urlAndroid
        : RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
      console.log("uri", uri);
      sound.current = new Sound(uri, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        updateState(context, {
          currentAudio: {
            ...currentAudio,
            realDuration: sound.current.getDuration(),
          },
        });
      });
    }
  };

  const checkIfDownloaded = async () => {
    const exists = await RNFetchBlob.fs.exists(
      RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`
    );
    exists && setisDownloaded(exists);
    console.log(currentAudio.filename, "exists", exists);
    return exists;
  };

  const playSoundWithUri = (uri, index) => {
    updateState(context, {
      currentAudioIndex: index,
      isAudioPlaying: true,
    });
    sound.current = new Sound(uri, "", (error) => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      if (currentTime !== 0) sound.current.setCurrentTime(currentTime);
      sound.current.setNumberOfLoops(0);
      sound.current.play();
      activateInterval();
    });
  };

  const activateInterval = () => {
    soundTimer.current = setInterval(() => {
      if (currentTime >= currentAudio.realDuration) {
        stopPlayingSound();
        clearInterval(soundTimer.current);
        return;
      }
      if (sound.current) {
        sound.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }
    }, 1000);
  };

  const stopPlayingSound = async () => {
    await sound.current.pause();
    await updateState(context, {
      isAudioPlaying: false,
    });
    sound.current = null;
    clearInterval(soundTimer.current);
  };

  const handlePlayPause = async () => {
    const uri = !isDownloaded
      ? Platform.OS === "ios"
        ? currentAudio.urlIOS
        : currentAudio.urlAndroid
      : RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
    const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);
    if (currentAudioIndex === null) {
      return playSoundWithUri(uri, index);
    }

    if (currentAudioIndex === index) {
      if (isAudioPlaying) {
        return stopPlayingSound();
      } else {
        return playSoundWithUri(uri, index);
      }
    } else {
      if (isAudioPlaying) {
        await stopPlayingSound();
        return playSoundWithUri(uri, index);
      } else {
        return playSoundWithUri(uri, index);
      }
    }
  };

  const handleNext = async () => {
    if (currentAudioIndex === audioFiles.length - 1) return;
    updateState(context, {
      currentAudioIndex: currentAudioIndex + 1,
      currentAudio: audioFiles[currentAudioIndex + 1],
    });
  };

  const handlePrevious = async () => {
    if (currentAudioIndex === 0) return;
    updateState(context, {
      currentAudioIndex: currentAudioIndex - 1,
      currentAudio: audioFiles[currentAudioIndex - 1],
    });
  };

  if (!context.currentAudio) return null;

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
            <Text style={{ fontWeight: "bold" }}>Tag: </Text>{" "}
            {currentAudio.type},
            <Text style={{ fontWeight: "bold" }}> Song: </Text>{" "}
            {currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#fff" }}>
              {convertTime(currentAudio.realDuration)}
            </Text>
            <Text style={{ color: "#fff" }}>{convertTime(currentTime)}</Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              if (isAudioPlaying && sound.current) {
                sound.current.setCurrentTime(value * currentAudio.realDuration);
                setCurrentTime(value * currentAudio.realDuration);
              }
              setCurrentPosition(
                convertTime(value * currentAudio.realDuration)
              );
            }}
            onSlidingStart={async () => {
              if (!isAudioPlaying) return;

              try {
                // await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error);
              }
            }}
            onSlidingComplete={async (value) => {
              console.log(
                "onSlidingComplete",
                value * currentAudio.realDuration,
                currentAudio.realDuration
              );
              // await moveAudio(context, value);
              if (isAudioPlaying && sound.current) {
                if (value === 1) {
                  return handleNext();
                }
                sound.current.setCurrentTime(value * currentAudio.realDuration);
              }
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={isAudioPlaying ? "PLAY" : "PAUSE"}
            />
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
