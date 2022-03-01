import Slider from "@react-native-community/slider";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Sound from "react-native-sound";
import { useTrackPlayerEvents, Event } from "react-native-track-player";
Sound.setActive(true);
import RNFetchBlob from "rn-fetch-blob";
import PlayerButton from "../components/PlayerButton";
import Screen from "../components/Screen";
import { AudioContext } from "../context/AudioProvider";
import { getDuration, pause, play, stop } from "../misc/audioController";
import color from "../misc/color";
import { convertTime } from "../misc/helper";
Sound.setCategory("Playback");
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
  const [audioLoading, setAudioLoading] = useState(false);
  const firstRender = useRef(true);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === "loading")
      return !audioLoading && setAudioLoading(true);
    else if (event.state === "playing")
      return audioLoading && setAudioLoading(false);
  });

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
    if (firstRender.current && currentAudio) {
      firstTimeDuration();
    }
  }, [currentAudio]);

  const firstTimeDuration = async () => {
    firstRender.current = false;
    const localPath =
      RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
    const _isDownloaded = await checkIfDownloaded();
    const uri = !_isDownloaded
      ? Platform.OS === "ios"
        ? currentAudio.urlIOS
        : currentAudio.urlAndroid
      : Platform.OS === "ios"
      ? "file://" + localPath
      : localPath;
    const _duration = await getDuration({
      uri,
      isDownloaded: _isDownloaded,
    });
    return updateState(context, {
      currentAudio: { ...currentAudio, realDuration: _duration },
    });
  };

  useEffect(() => {
    if (currentAudio) {
      checkIfDownloaded();
    }
  }, []);

  useEffect(() => {
    if (currentAudio) {
      currentAudioChangedCondition();
    }
  }, [currentAudioIndex]);

  const currentAudioChangedCondition = async () => {
    console.log("audio index changed");
    const localPath =
      RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
    const _isDownloaded = await checkIfDownloaded();
    const uri = !_isDownloaded
      ? Platform.OS === "ios"
        ? currentAudio.urlIOS
        : currentAudio.urlAndroid
      : Platform.OS === "ios"
      ? "file://" + localPath
      : localPath;
    if (isAudioPlaying) {
      if (!currentAudio.realDuration) {
        const _duration = await getDuration({
          uri,
          isDownloaded: _isDownloaded,
        });
        return updateState(context, {
          currentAudio: { ...currentAudio, realDuration: _duration },
        });
      }
      await stop({
        context,
        uri,
        isDownloaded: _isDownloaded,
        isPreviousDownloaded: isDownloaded,
      });
      clearInterval(soundTimer.current);

      await play({
        context,
        isDownloaded: _isDownloaded,
        uri,
        index: currentAudioIndex,
        audio: currentAudio,
      });
      activateInterval();
    } else {
      if (!currentAudio.realDuration) {
        const _duration = await getDuration({
          uri,
          isDownloaded: _isDownloaded,
        });
        return updateState(context, {
          currentAudio: { ...currentAudio, realDuration: _duration },
        });
      }

      await play({
        context,
        isDownloaded: _isDownloaded,
        uri,
        index: currentAudioIndex,
        audio: currentAudio,
      });
      activateInterval();
    }
  };

  const checkIfDownloaded = async () => {
    const exists = await RNFetchBlob.fs.exists(
      RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`
    );
    exists && setisDownloaded(exists);
    return exists;
  };

  const activateInterval = () => {
    soundTimer.current = setInterval(() => {
      if (currentTime >= currentAudio.realDuration) {
        stop({ context, isDownloaded });
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

  const handlePlayPause = async () => {
    const localPath =
      RNFetchBlob.fs.dirs.MusicDir + `/${currentAudio.filename}`;
    const uri = !isDownloaded
      ? Platform.OS === "ios"
        ? currentAudio.urlIOS
        : currentAudio.urlAndroid
      : Platform.OS === "ios"
      ? "file://" + localPath
      : localPath;
    const index = audioFiles.findIndex(({ id }) => id === currentAudio.id);
    if (currentAudioIndex === null) {
      await play({
        context,
        uri,
        index,
        isDownloaded,
        audio: currentAudio,
      });
      return activateInterval();
    }

    if (currentAudioIndex === index) {
      if (isAudioPlaying) {
        await pause({ context, isDownloaded, uri });
        return clearInterval(soundTimer.current);
      } else {
        await play({
          context,
          uri,
          index,
          isDownloaded,
          audio: currentAudio,
        });
        return activateInterval();
      }
    } else {
      if (isAudioPlaying) {
        await stop({ context, isDownloaded });
        clearInterval(soundTimer.current);
        await play({
          context,
          uri,
          index,
          isDownloaded,
          audio: currentAudio,
        });
        return activateInterval();
      } else {
        await play({
          context,
          uri,
          index,
          isDownloaded,
          audio: currentAudio,
        });
        return activateInterval();
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

  const onValueChange = (value) => {
    if (isAudioPlaying && sound.current) {
      sound.current.setCurrentTime(value * currentAudio.realDuration);
      setCurrentTime(value * currentAudio.realDuration);
    }
    setCurrentPosition(convertTime(value * currentAudio.realDuration));
  };

  const onSlidingComplete = async (value) => {
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
            <Text style={{ color: "#fff" }}>{convertTime(currentTime)}</Text>
            <Text style={{ color: "#fff" }}>
              {convertTime(currentAudio.realDuration)}
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
