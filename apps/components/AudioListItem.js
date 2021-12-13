import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Entypo, Ionicons, Feather,FontAwesome  } from '@expo/vector-icons';
import color from '../misc/color';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {Audio} from 'expo-av';
import { AudioContext } from '../context/AudioProvider';

const getThumbnailText = (filename) => {
  return <Image source={require('../../assets/cg.png')} style={{ width: 35, height: 35, paddingBottom: 20 }} />
}

//Audio time display in format mm:ss
const convertTime = minutes => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split('.')[0];
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
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
const renderPlayPauseIcon = isPlaying => {
  if (isPlaying)
    return (
      <Ionicons name="pause" size={30} color={color.ACTIVE_FONT} />
    );
  return <Entypo name='controller-play' size={30} color={color.ACTIVE_FONT} />;
};




//Method to display audio list item
const AudioListItem = ({
  title,
  onAudioPress,
  duration,
  album,
  isDownlaod,
  type,
  url,
  onOptionPress,
  isPlaying,
  activeListItem,
}) => {
  const [loader, setLoader] = useState(false);
  const {getAudioFiles } = useContext(AudioContext);
  const saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('octaCoil', asset, true);
    }
  };
  
  const onDownloadPress = async (url, title) => {
    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    };
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + title + '.wav',
      {},
      callback
    );
    try {
      setLoader(true);
      const { uri } = await downloadResumable.downloadAsync();
      await saveFile(uri).then((rs) => {
        setLoader(false);
        getAudioFiles();
        alert('File Download Sucessfully!');
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={onAudioPress}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.ACTIVE_BG
                    : '#d6d6d6',
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={[isDownlaod ? styles.titleDownloadContainer : styles.titleContainer]} >
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              
              <Text numberOfLines={1} style={styles.description}>{isDownlaod ? <FontAwesome name="check-circle" size={20} color="white" /> : null}  Tag: {type}, Album: {album}, Song: {title}</Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
          {!isDownlaod ? <View style={styles.rightContainer}>
            {!loader ? <Feather
              onPress={() => onDownloadPress(url, title)}
              id="downlink"
              name="download" size={24}
              color={color.FONT_MEDIUM}
              style={{ padding: 10 }} /> : <ActivityIndicator size="small" color="#fff" />}
            
          </View> : null}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.separator} />
    </>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 80,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    paddingTop: 5,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10
  },
  titleDownloadContainer: {
    width: width-130,
    paddingLeft:10
  },
  description: {
    fontSize: 14,
    color: color.FONT_MEDIUM
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: '#fff',
    opacity: 0.3,
    height: 1,
    alignSelf: 'center',
    marginTop: 3,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});

export default AudioListItem;
