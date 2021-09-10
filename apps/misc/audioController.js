import { storeAudioForNextOpening } from './helper';
import { Audio } from 'expo-av';
// play audio
export const play = async ( uri) => {
  try {
    
      return await Audio.Sound.createAsync(
         uri 
     );
    
  } catch (error) {
    console.log('error inside play helper method', error.message);
  }
};

// pause audio
export const pause = async audio => {
  try {
    return await audio.pauseAsync();
  } catch (error) {
    console.log('error inside pause helper method', error.message);
  }
};

// resume audio
export const resume = async playbackObj => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log('error inside resume helper method', error.message);
  }
};

// select another audio
export const playNext = async (playbackObj, uri, lastPosition, isPlaying) => {
  try {
    const { sound: soundObject } = await Audio.Sound.createAsync(
      uri
    );
    if (isPlaying) {
      await playbackObj.stopAsync();
      await playbackObj.unloadAsync();
    }
    return await soundObject.setStatusAsync({ shouldPlay: true });

  } catch (error) {
    console.log('error inside playNext helper method', error.message);
  }
};

export const selectAudio = async (audio, context, playListInfo = {}) => {
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
    // playing audio for the first time.
    if (soundObj === null) {
      const uri = audio.url;
      const { sound: soundObject } = await Audio.Sound.createAsync(
        uri
      );
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: soundObject,
        isPlaying: true,
        currentAudioIndex: index
      });
      await soundObject.setStatusAsync({ shouldPlay: true });
      soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }
    // pause audio
    if (
      isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log('--------pause-----------');
      // await soundObject.unloadAsync();
      const { sound: soundObject } = await soundObj.setStatusAsync({shouldPlay: false }); 
      return updateState(context, {
        soundObj: soundObject,
        isPlaying: false,
      });
    }

    // resume audio
    if (
      !isPlaying &&
      currentAudio.id === audio.id
    ) {
      const uri = audio.url;
      console.log('--------resume-------');
      const { sound: soundObject } = await Audio.Sound.createAsync(
        uri 
    );
       await soundObject.setStatusAsync({shouldPlay: true }); 
       updateState(context, { soundObj: soundObject, isPlaying: true });
       soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }

    // select another audio
    if (currentAudio.id !== audio.id) {
      console.log('----------next-------------');
      const uri = audio.url;
      const { sound: soundObject } = await Audio.Sound.createAsync(
        uri
      );
      if (isPlaying) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      await soundObject.setStatusAsync({ shouldPlay: true });
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: soundObject,
        isPlaying: true,
        currentAudioIndex: index
      });
      soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log('error inside select audio method.', error.message);
  }
};

const selectAudioFromPlayList = async (context, select) => {
  const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex;
  let nextIndex;

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );

  if (select === 'next') {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }

  if (select === 'previous') {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }
  audio = activePlayList.audios[nextIndex];

  if (!audio) audio = activePlayList.audios[defaultIndex];

  const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);

  const status = await playNext(playbackObj, audio.uri);
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
    if (select === 'next') {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    // for previous
    if (select === 'previous') {
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
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
    console.log('error inside cahnge audio method.', error.message);
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
    console.log('error inside onSlidingComplete callback', error);
  }
};
