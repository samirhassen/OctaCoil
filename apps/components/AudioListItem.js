import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Entypo, Ionicons  } from '@expo/vector-icons';
import color from '../misc/color';

const getThumbnailText = filename => filename[0].toUpperCase();

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
      <Ionicons name="md-stop-sharp" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name='controller-play' size={24} color={color.ACTIVE_FONT} />;
};

//Method to display audio list item
const AudioListItem = ({
  title,
  onAudioPress,
  duration,
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
                    : color.FONT_LIGHT,
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
              <Text numberOfLines={1} style={styles.description}>Type: POP, Singer: Jennifer Lopez, Song: {title}</Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        <View style={styles.rightContainer}>
          <Entypo
             onPress={onOptionPress}
            name='dots-three-vertical'
            size={20}
            color={color.FONT_MEDIUM}
            style={{ padding: 10 }}
          />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
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
