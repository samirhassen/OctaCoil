
import React, { Component, createContext } from 'react';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/audioController';


export const AudioContext = createContext();

export class AudioProvider extends Component {
  audioItems = [
    {
      id: 1,
      title: 'Energize',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Energize.wav?alt=media&token=171dd93b-c563-43f7-8109-3529f746f39f',
      duration: 30.01,
      type: 'heart',
      album: 'SE Therapies'
    },
    {
      id: 2,
      title: 'Focus',
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Focus.wav?alt=media&token=954b3b3f-4ca2-4fa8-b80c-9cdadc090685',
      duration: 30.01,
      type: 'bone',
      album: 'SE Therapies'
    },
    {
      id: 3,
      title: 'Relax',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Relax.wav?alt=media&token=44925134-2bf3-4ced-b103-4a2eda6b4879',
      duration: 20.00,
      type: 'healing',
      album: 'SE Therapies'
    },    
    {
      id: 4,
      title: 'Sleep',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Sleep.wav?alt=media&token=58b67a58-4d00-4b35-a3bd-046bd49f6ad6',
      duration: 32.00,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 5,
      title: 'Bone',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Bone.wav?alt=media&token=e92f107f-e55a-4b64-a836-12ccf202ac5e',
      duration: 0.60,
      type: 'Bone',
      album: 'SE Therapies'
    },    
    {
      id: 6,
      title: 'Inflammation',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Inflammation.wav?alt=media&token=6cfbfda8-b44e-437e-81c9-58740e01306a',
      duration: 0.00,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 7,
      title: 'Performance',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Performance.wav?alt=media&token=afa0ae22-154c-45a3-aeaf-1275e14a5b4f',
      duration: 0.60,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 8,
      title: 'Circulation',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Circulation.wav?alt=media&token=50088af6-c570-436e-86df-5ccce4907674',
      duration: 0.00,
      type: 'brain',
      album: 'SE Therapies'
    },
    {
      id: 9,
      title: 'Recovery',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Recovery.wav?alt=media&token=eb24f439-0dc2-483b-bde7-6582a30661a0',
      duration: 0.00,
      type: 'brain',
      album: 'SE Therapies'
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      dataProvider: new DataProvider((r1, r2) => r1.url !== r2.url),
      filteredAudio : new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      isPlayListRunning: false,
      activePlayList: [],
      currentAudioIndex: 0,
      playbackPosition: null,
      playbackDuration: null,
      audioLists: this.audioItems,
      isLoop : true,
      isLoggedIn: false
    };
    this.totalAudioCount = 0;
  }


  getAudioFiles = async () => {
    const {dataProvider, audioFiles, audioLists, filteredAudio } = this.state;
    const dataProviderData = dataProvider.cloneWithRows([...audioFiles, ...audioLists]);
    const filterAudioData = filteredAudio.cloneWithRows([...audioFiles, ...audioLists]);
    this.totalAudioCount = audioLists.length;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
    });
    this.setState({
      dataProvider: dataProviderData,
      filteredAudio:  filterAudioData,
      audioFiles: [...audioFiles, ...audioLists],
    });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem('previousAudio');
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };


  onPlaybackStatusUpdate = async playbackStatus => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      storeAudioForNextOpening(
        this.state.currentAudio,
        this.state.currentAudioIndex,
        playbackStatus.positionMillis
      );
    }
    let durationSeconds = playbackStatus.durationMillis/1000;
    let positionSeconds = playbackStatus.positionMillis/1000;

    if (playbackStatus.didJustFinish ||  (parseInt(durationSeconds)-2 === parseInt(positionSeconds))) {
      if (this.state.isPlayListRunning) {
        let audio;
        
        const indexOnPlayList = this.state.activePlayList.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );
        const nextIndex = this.state.isLoop ? indexOnPlayList : indexOnPlayList + 1;
        audio = this.state.activePlayList.audios[nextIndex];

        if (!audio) audio = this.state.activePlayList.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(this.state.playbackObj, audio.url);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex = this.state.isLoop ? this.state.currentAudioIndex : this.state.currentAudioIndex + 1;
      // there is no next audio to play or the current audio is the last
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      // otherwise we want to select the next audio
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.url);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });

      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  playbackObjMethod = () => {
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  componentDidMount() {
    this.getAudioFiles();
    setTimeout(() => {
      this.playbackObjMethod();
    }, 0);
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState },()=>{
    });
  };

  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      filteredAudio,
      playbackObj,
      isLoggedIn,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
      isPlayListRunning,
      activePlayList,
    } = this.state;

    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          playList,
          addToPlayList,
          dataProvider,
          filteredAudio,
          playbackObj,
          isLoggedIn,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          isPlayListRunning,
          activePlayList,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
