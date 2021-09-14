
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
      id: 3,
      title: 'Energize',
      isRequire: true,
      url: require('../../assets/Energize.wav'),
      duration: 30.00,
      type: 'heart'
    },
    {
      id: 4,
      title: 'Focus',
      url: require('../../assets/Focus.wav'),
      duration: 30.00,
      type: 'bone'
    },
    {
      id: 5,
      title: 'Relax',
      isRequire: true,
      url: require('../../assets/Relax.wav'),
      duration: 20.00,
      type: 'brain'
    },
    {
      id: 6,
      title: 'Performance',
      url: require('../../assets/Performance.wav'),
      duration: 10.00,
      type: 'blues'
    },
    {
      id: 7,
      title: 'Shaky Shaky',
      isRequire: true,
      url: require('../../assets/shaky.mp3'),
      duration: 11.00,
      type: 'heart'
    },
    {
      id: 8,
      title: 'Six days',
      url: require('../../assets/sixdays.mp3'),
      duration: 23.00,
      type: 'bone'
    },
    {
      id: 9,
      title: 'Ve mahi',
      isRequire: true,
      url: require('../../assets/vemahi.mp3'),
      duration: 30.11,
      type: 'brain'
    },
    {
      id: 10,
      title: 'Tokyo Drift',
      url: require('../../assets/tokyo.mp3'),
      duration: 29.00,
      type: 'blues'
    },
    {
      id: 11,
      title: 'Let me Love you',
      url: require('../../assets/letmelove.mp3'),
      duration: 19.15,
      type: 'heart'
    },
    {
      id: 12,
      title: 'KGF maa',
      isRequire: true,
      url: require('../../assets/kgf.mp3'),
      duration: 24.37,
      type: 'bone'
    },
    {
      id: 13,
      title: 'Shiv Tandav Storm',
      url: require('../../assets/Shiv.mp3'),
      duration: 18.12,
      type: 'brain'
    },
    {
      id: 14,
      title: 'Sample1',
      isRequire: true,
      url: require('../../assets/sample1.wav'),
      duration: 121.20,
      type: 'blues'
    },
    {
      id: 15,
      title: 'Sample2',
      url: require('../../assets/sample2.wav'),
      duration: 13.10,
      type: 'heart'
    },
    {
      id: 16,
      title: 'Sample3',
      isRequire: true,
      url: require('../../assets/sample3.wav'),
      duration: 87.00,
      type: 'bone'
    },
    {
      id: 17,
      title: 'Sample4',
      url: require('../../assets/sample4.wav'),
      duration: 148.20,
      type: 'brain'
    },
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

        const status = await playNext(this.state.playbackObj, audio.uri);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex =  this.state.currentAudioIndex + 1;
      // there is no next audio to play or the current audio is the last
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.soundObj.unloadAsync();
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
      // const status = await playNext(this.state.soundObj, audio.url);

      const uri = audio.url;
      const { sound: soundObject } = await Audio.Sound.createAsync(
        uri
      );
      // console.log('soundObj---',this.state.soundObj);
      if (this.state.isPlaying) {
        await this.state.soundObj.stopAsync();
        await this.state.soundObj.unloadAsync();
      }
      await soundObject.setStatusAsync({ shouldPlay: true });

      this.updateState(this, {
        soundObj: soundObject,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      soundObject.setOnPlaybackStatusUpdate(this.state.onPlaybackStatusUpdate);
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  playbackObjMethod = async () => {
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj:  await Audio.Sound.createAsync(
        require('../../assets/kgf.mp3')
     ) });
    }
  }

   componentDidMount() {
    this.getAudioFiles();
    setTimeout(()=> {
      this.playbackObjMethod();
    }, 2000);
    
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
