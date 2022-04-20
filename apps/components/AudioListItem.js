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
import RNFetchBlob from "rn-fetch-blob";
import { AudioContext } from "../context/AudioProvider";
import { pause, play, stop } from "../misc/audioController";
import color from "../misc/color";

const getThumbnailText = () => {
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
const AudioListItem = ({
  fileNameExtension,
  duration,
  url,
  activeListItem,
  isPlaying,
  openPlayer,
  isDownloaded,
  title,
}) => {
  const [loader, setLoader] = useState(false);
  const context = useContext(AudioContext);
  const { getAudioFiles } = context;
  const [audioLoading, setAudioLoading] = useState(false);

  const onDownloadPress = async (url, fileNameExtension) => {
    try {
      setLoader(true);
      await RNFetchBlob.config({
        fileCache: true,
        // addAndroidDownloads: {
        //   useDownloadManager: true,
        //   notification: false,
        //   mime: "text/plain",
        //   description: "File downloaded by download manager.",
        // },
        path: RNFetchBlob.fs.dirs.DocumentDir + `/${fileNameExtension}`,
      }).fetch("GET", url);
      setLoader(false);
      getAudioFiles();
      alert("File Download Sucessfully!");
    } catch (e) {
      console.log("error while downloading", e);
      console.error(e);
    }
  };

  const handlePlayAudio = async () => {};

  return (
    <>
      <TouchableWithoutFeedback onPress={openPlayer}>
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
                  ? renderPlayPauseIcon(isPlaying, audioLoading)
                  : getThumbnailText(fileNameExtension)}
              </Text>
            </View>
            <View
              style={[
                isDownloaded
                  ? styles.fileNameExtensionDownloadContainer
                  : styles.fileNameExtensionContainer,
              ]}
            >
              <Text numberOfLines={1} style={styles.fileNameExtension}>
                {title}
              </Text>

              <Text numberOfLines={1} style={styles.description}>
                {/* {isDownloaded ? (
                  <FontAwesome name="check-circle" size={20} color="white" />
                ) : null}{" "} */}
                {/* Tag: {type}, Album: {album}, Song: {fileNameExtension} */}
                {/* Album: {album}, Song: {fileNameExtension} */}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
          {!isDownloaded ? (
            <View style={styles.rightContainer}>
              {!loader ? (
                <Feather
                  onPress={() => onDownloadPress(url, fileNameExtension)}
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
    marginVertical: 5,
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
  fileNameExtensionContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  fileNameExtensionDownloadContainer: {
    width: width - 130,
    paddingLeft: 10,
  },
  description: {
    fontSize: 14,
    color: color.FONT_MEDIUM,
  },
  fileNameExtension: {
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
