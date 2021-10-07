import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Entypo, Ionicons  } from '@expo/vector-icons';
import color from '../misc/color';

const getThumbnailText = (filename) => {
  return <Image source = {require('../../assets/cg.png')} style = {{ width: 35, height: 35, paddingBottom:20 }}/>
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
  type,
  onOptionPress,
  isPlaying,
  activeListItem,
}) => {
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
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.description}>Type: {type}, Album: {album}, Song: {title}</Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
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
    backgroundColor: color.FONT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: color.FONT,
  },
  titleContainer: {
    width: width - 130,
    paddingLeft: 10
  },
  description: {
    fontSize: 14,
    color: color.FONT_MEDIUM
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: '#333',
    opacity: 0.3,
    height: 0.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
});

export default AudioListItem;
