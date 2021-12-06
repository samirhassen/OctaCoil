
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
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Energize.m4a?alt=media&token=ac26cc9d-338d-41db-9609-18268a398e76',
      duration: '12:00',
      type: 'heart',
      album: 'SE Therapies'
    },
    {
      id: 2,
      title: 'Focus',
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Focus.m4a?alt=media&token=3de11cd2-6008-4744-9f31-b0605a575f4e',
      duration: '09:00',
      type: 'bone',
      album: 'SE Therapies'
    },
    {
      id: 3,
      title: 'Relax',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Relax.m4a?alt=media&token=194185f7-3f02-49e4-8760-a33642260b75',
      duration: '06:00',
      type: 'healing',
      album: 'SE Therapies'
    },    
    {
      id: 4,
      title: 'Sleep',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Sleep.m4a?alt=media&token=16cd5ee4-48b2-4776-976a-6714ad6e36f8',
      duration: '12:00',
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 5,
      title: 'Bone',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Bones.m4a?alt=media&token=fae5e63c-e89e-4041-b874-8df67f62931e',
      duration: '03:00',
      type: 'Bone',
      album: 'SE Therapies'
    },    
    {
      id: 6,
      title: 'Inflammation',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Inflammation.m4a?alt=media&token=ca76699d-20e0-4f8c-8486-fc34a43cd56d',
      duration: '03:12',
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 7,
      title: 'Performance',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Performance.m4a?alt=media&token=2c8ae0ee-3a65-485b-a185-61f4be92d482',
      duration: '03:10',
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 8,
      title: 'Circulation',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Circulation.m4a?alt=media&token=5c7f6bb7-8c30-404a-9d22-e88db913dcf4',
      duration: '03:22',
      type: 'brain',
      album: 'SE Therapies'
    },
    {
      id: 9,
      title: 'Recovery',
      isRequire: true,
      url: 'https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Recovery.m4a?alt=media&token=b19953a5-0302-4471-80f8-4b65b0de0a97',
      duration: '03:22',
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
