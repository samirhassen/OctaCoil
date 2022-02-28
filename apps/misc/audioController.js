import { storeAudioForNextOpening } from "./helper";
import { Audio } from "expo-av";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

// play audio
export const play = async (playbackObj, uri, lastPosition, newPlaybackObj) => {
  console.log("playing from", uri);
  try {
    if (!lastPosition) {
      console.log("playbackObj", newPlaybackObj);
      var sound = new Sound(uri, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        sound.play();
      });
      return;
    }

    // but if there is lastPosition then we will play audio from the lastPosition
    var sound = new Sound(uri, "", (error) => {
      if (error) {
        console.log("failed to load the sound", error);
        se;
        return;
      }
      sound.setCurrentTime(lastPosition);
      sound.play();
      return;
    });
  } catch (error) {
    console.log("error inside play helper method", error.message);
  }
};

// pause audio
export const pause = async (playbackObj) => {
  try {
    // return await playbackObj.setStatusAsync({
    //   shouldPlay: false,
    // });
    return playbackObj.pause();
  } catch (error) {
    console.log("error inside pause helper method", error.message);
  }
};

// resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error inside resume helper method", error.message);
  }
};

// select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error inside playNext helper method", error.message);
  }
};

export const selectAudio = async (
  audio,
  context,
  playListInfo = {},
  newPlaybackObj
) => {
  const {
    soundObj,
    playbackObj,
    currentAudio,
    isPlaying,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
  } = context;
  try {
    const currentAudioUrl =
      Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;

    // playing audio for the first time.
    if (soundObj === null) {
      const status = await play(
        playbackObj,
        Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS,
        audio.lastPosition,
        newPlaybackObj
      );
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: newPlaybackObj,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }

    // pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log("--------pause-----------");
      newPlaybackObj.pause();
      const status = await pause(newPlaybackObj);
      return updateState(context, {
        soundObj: newPlaybackObj,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }

    // resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log("--------resume-------");
      const status = await resume(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: true });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      console.log("----------next-------------");
      const status = await playNext(playbackObj, currentAudioUrl);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      return storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log("error inside select audio method.", error.message);
  }
};

const selectAudioFromPlayList = async (context, select) => {
  const currentAudioUrl =
    Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;

  const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex;
  let nextIndex;

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );

  if (select === "next") {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }

  if (select === "previous") {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }
  audio = activePlayList.audios[nextIndex];

  if (!audio) audio = activePlayList.audios[defaultIndex];

  const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);
  const status = await playNext(playbackObj, currentAudioUrl);
  return updateState(context, {
    soundObj: status,
    isPlaying: true,
    currentAudio: audio,
    currentAudioIndex: indexOnAllList,
  });
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    isPlayListRunning,
  } = context;

  if (isPlayListRunning) return selectAudioFromPlayList(context, select);

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;

    // for next
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      let currentAudioUrl = "";
      if (!isLoaded && !isLastAudio) {
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        index = currentAudioIndex + 1;
        status = await play(playbackObj, currentAudioUrl);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isLastAudio) {
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, currentAudioUrl);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        if (isLoaded) {
          status = await playNext(playbackObj, currentAudioUrl);
        } else {
          status = await play(playbackObj, currentAudioUrl);
        }
      }
    }

    // for previous
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];
      let currentAudioUrl = "";

      if (!isLoaded && !isFirstAudio) {
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        index = currentAudioIndex - 1;
        status = await play(playbackObj, currentAudioUrl);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isFirstAudio) {
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, currentAudioUrl);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        currentAudioUrl =
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS;
        if (isLoaded) {
          status = await playNext(playbackObj, currentAudioUrl);
        } else {
          status = await play(playbackObj, currentAudioUrl);
        }
      }
    }

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log("error inside cahnge audio method.", error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying) return;

  try {
    const status = await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
    });

    await resume(playbackObj);
  } catch (error) {
    console.log("error inside onSlidingComplete callback", error);
  }
};
