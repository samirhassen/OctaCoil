import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Sound from "react-native-sound";
import RNFetchBlob from "rn-fetch-blob";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, stop } from "../misc/audioController";
import color from "../misc/color";
Sound.setActive(true);

const getThumbnailText = (filename) => {
  return (
    <Image
      source={require("../../assets/cg.png")}
      style={{ width: 35, height: 35, paddingBottom: 20 }}
    />
  );
};

//Audio time display in format mm:ss
const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

/**
 * Method to show play/pause icon based on song play/pause
 * @param {*} isPlaying
 * @returns
 */
const renderPlayPauseIcon = (isPlaying, loading) => {
  if (loading) return <ActivityIndicator size="small" color="#fff" />;
  if (isPlaying)
    return <Ionicons name="pause" size={30} color={color.ACTIVE_FONT} />;
  return <Entypo name="controller-play" size={30} color={color.ACTIVE_FONT} />;
};

//Method to display audio list item
const AudioListItem = ({ item, title, duration, url, activeListItem }) => {
  const [loader, setLoader] = useState(false);
  const { getAudioFiles } = useContext(AudioContext);
  const context = useContext(AudioContext);
  const { audioFiles, currentAudioIndex, isAudioPlaying } = context;
  const [isDownloaded, setisDownloaded] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    checkIfDownloaded();
  }, []);

  const checkIfDownloaded = async () => {
    const exists = await RNFetchBlob.fs.exists(
      RNFetchBlob.fs.dirs.DocumentDir + `/${title}`
    );
    exists && setisDownloaded(exists);
  };

  const onDownloadPress = async (url, title) => {
    try {
      setLoader(true);
      await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: false,
          mime: "text/plain",
          description: "File downloaded by download manager.",
        },
        path: RNFetchBlob.fs.dirs.DocumentDir + `/${title}`,
      }).fetch("GET", url);
      setLoader(false);
      setisDownloaded(true);
      setLoader(false);
      getAudioFiles();
      alert("File Download Sucessfully!");
    } catch (e) {
      console.log("error while downloading", e);
      console.error(e);
    }
  };

  const handlePlayAudio = async () => {
    const localPath = RNFetchBlob.fs.dirs.DocumentDir + `/${title}`;
    const uri = !isDownloaded
      ? url
      : Platform.OS === "ios"
      ? "file://" + localPath
      : localPath;
    const index = audioFiles.findIndex(({ id }) => id === item.id);
    if (currentAudioIndex === null) {
      return await play({ context, uri, index, isDownloaded, audio: item });
    }

    if (currentAudioIndex === index) {
      if (isAudioPlaying) {
        return await pause({ context, isDownloaded, uri });
      } else {
        return await play({ context, uri, index, isDownloaded, audio: item });
      }
    } else {
      if (isAudioPlaying) {
        await stop({ context, isDownloaded });
        return await play({ context, uri, index, isDownloaded, audio: item });
      } else {
        return await play({ context, uri, index, isDownloaded, audio: item });
      }
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePlayAudio}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem ? color.ACTIVE_BG : "#d6d6d6",
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isAudioPlaying, audioLoading)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View
              style={[
                isDownloaded
                  ? styles.titleDownloadContainer
                  : styles.titleContainer,
              ]}
            >
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>

              <Text numberOfLines={1} style={styles.description}>
                {/* {isDownloaded ? (
                  <FontAwesome name="check-circle" size={20} color="white" />
                ) : null}{" "} */}
                {/* Tag: {type}, Album: {album}, Song: {title} */}
                {/* Album: {album}, Song: {title} */}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
          {!isDownloaded ? (
            <View style={styles.rightContainer}>
              {!loader ? (
                <Feather
                  onPress={() => onDownloadPress(url, title)}
                  id="downlink"
                  name="download"
                  size={24}
                  color={color.FONT_MEDIUM}
                  style={{ padding: 10 }}
                />
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </View>
          ) : (
            <FontAwesome
              name="check-circle"
              size={20}
              color="white"
              style={{ marginRight: 20, alignSelf: "center" }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.separator} />
    </>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 80,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    paddingTop: 5,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 50,
    fontWeight: "bold",
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  titleDownloadContainer: {
    width: width - 130,
    paddingLeft: 10,
  },
  description: {
    fontSize: 14,
    color: color.FONT_MEDIUM,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: "#fff",
    opacity: 0.3,
    height: 1,
    alignSelf: "center",
    marginTop: 3,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});

export default AudioListItem;
