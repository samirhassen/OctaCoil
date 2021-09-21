
import React, { Component, createContext } from 'react';
import { Text, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
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
      url: require('../../assets/Energize.wav'),
      duration: 30.00,
      type: 'heart',
      album: 'SE Therapies'
    },
    {
      id: 2,
      title: 'Focus',
      url: require('../../assets/Focus.wav'),
      duration: 30.00,
      type: 'bone',
      album: 'SE Therapies'
    },
    {
      id: 3,
      title: 'Relax',
      isRequire: true,
      url: require('../../assets/Relax.wav'),
      duration: 20.00,
      type: 'brain',
      album: 'SE Therapies'
    },
    {
      id: 4,
      title: 'Astronut',
      url: require('../../assets/astronaut.mp3'),
      duration: 25.00,
      type: 'blues',
      album: 'Masked Wolf'
    },
    {
      id: 5,
      title: 'Shaky Shaky',
      isRequire: true,
      url: require('../../assets/shaky.mp3'),
      duration: 11.00,
      type: 'heart',
      album: 'Daddy Yenky'
    },
    {
      id: 6,
      title: 'Six days',
      url: require('../../assets/sixdays.mp3'),
      duration: 23.00,
      type: 'bone',
      album: 'F&F Tokyo Drift'
    },
    {
      id: 7,
      title: 'Ve mahi',
      isRequire: true,
      url: require('../../assets/vemahi.mp3'),
      duration: 30.11,
      type: 'brain',
      album: 'Keshari The Movie'
    },
    {
      id: 8,
      title: 'Tokyo Drift',
      url: require('../../assets/tokyo.mp3'),
      duration: 29.00,
      type: 'blues',
      album: 'F&F3 Tokyo Drift'
    },
    {
      id: 9,
      title: 'Let me Love you',
      url: require('../../assets/letmelove.mp3'),
      duration: 19.15,
      type: 'heart',
      album: 'Justin Bieber'
    },
    {
      id: 10,
      title: 'KGF maa',
      isRequire: true,
      url: require('../../assets/kgf.mp3'),
      duration: 24.37,
      type: 'bone',
      album: 'KGF Capture 1'
    },
    {
      id: 11,
      title: 'Shiv Tandav Storm',
      url: require('../../assets/Shiv.mp3'),
      duration: 18.12,
      type: 'brain',
      album: 'Shiva Tandav'
    },
    {
      id: 12,
      title: 'Bamboo',
      isRequire: true,
      url: require('../../assets/bamboo.mp3'),
      duration: 30.01,
      type: 'blues',
      album: 'Shakira'
    },
    {
      id: 13,
      title: 'Sample2',
      url: require('../../assets/sample2.wav'),
      duration: 13.10,
      type: 'heart',
      album: 'Unknown'
    },
    {
      id: 14,
      title: 'Sample3',
      isRequire: true,
      url: require('../../assets/sample3.wav'),
      duration: 87.00,
      type: 'bone',
      album: 'Unknown'
    },
    {
      id: 15,
      title: 'deja Vu',
      url: require('../../assets/dejaVU.mp3'),
      duration: 148.20,
      type: 'brain',
      album: 'Shakira'
    },
    {
      id: 16,
      title: 'Despacito',
      isRequire: true,
      url: require('../../assets/despacito.mp3'),
      duration: 29.12,
      type: 'bone',
      album: 'Daddy Yenky'
    },
    {
      id: 17,
      title: 'Get Low',
      url: require('../../assets/getLow.mp3'),
      duration: 30.02,
      type: 'brain',
      album: 'DJ Snake'
    },
    {
      id: 18,
      title: 'Lean on',
      isRequire: true,
      url: require('../../assets/leanOn.mp3'),
      duration: 20.01,
      type: 'blues',
      album: 'DJ Snake'
    },
    {
      id: 19,
      title: 'Middle rythm',
      url: require('../../assets/middle.mp3'),
      duration: 29.01,
      type: 'heart',
      album: 'DJ Snake'
    },
    {
      id: 20,
      title: 'Sleep',
      isRequire: true,
      url: require('../../assets/Sleep.wav'),
      duration: 32.01,
      type: 'Brain',
      album: 'SE Therapies'
    },
    {
      id: 21,
      title: 'Taki Taki',
      url: require('../../assets/taki.mp3'),
      duration: 30.01,
      type: 'brain',
      album: 'Selena Gomez'
    },
    {
      id: 22,
      title: 'Yummy Yummy',
      url: require('../../assets/yummy.mp3'),
      duration: 26.01,
      type: 'Bone',
      album: 'Justin Bieber'
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

  arrType = ['rock', 'pop', 'jazz', 'blues'];


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

    if (playbackStatus.didJustFinish) {
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
    setTimeout(()=> {
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
