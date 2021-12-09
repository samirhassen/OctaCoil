
import React, { Component, createContext } from 'react';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/audioController';
import * as MediaLibrary from 'expo-media-library';

export const AudioContext = createContext();

export class AudioProvider extends Component {
  audioItems = [
    {
      id: 1,
      filename: 'Energize',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Energize.wav?alt=media&token=171dd93b-c563-43f7-8109-3529f746f39f',
      iOSURL: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Energize.m4a?alt=media&token=245f01a5-f091-4015-b83b-0631d1762092',
      duration: 30.01,
      type: 'heart',
      album: 'SE Therapies'
    },
    {
      id: 2,
      filename: 'Focus',
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Focus.wav?alt=media&token=954b3b3f-4ca2-4fa8-b80c-9cdadc090685',
      iosURL: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Focus.m4a?alt=media&token=49fa5caa-76b3-42d3-96cf-4ee6a957935f',
      duration: 30.01,
      type: 'bone',
      album: 'SE Therapies'
    },
    {
      id: 3,
      filename: 'Relax',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Relax.wav?alt=media&token=44925134-2bf3-4ced-b103-4a2eda6b4879',
      iosURL: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Relax.m4a?alt=media&token=d618d1e2-7437-4379-af7f-2b02a1610425',
      duration: 20.00,
      type: 'healing',
      album: 'SE Therapies'
    },    
    {
      id: 4,
      filename: 'Sleep',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Sleep.wav?alt=media&token=58b67a58-4d00-4b35-a3bd-046bd49f6ad6',
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Sleep.m4a?alt=media&token=923c8e0a-39f1-4521-bebb-38481f87a5ea',
      duration: 32.00,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 5,
      filename: 'Bone',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Bone.wav?alt=media&token=e92f107f-e55a-4b64-a836-12ccf202ac5e',
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Bone.m4a?alt=media&token=008cab1e-ff27-4fc6-bf5b-0295109f30fe',
      duration: 0.60,
      type: 'Bone',
      album: 'SE Therapies'
    },    
    {
      id: 6,
      filename: 'Inflammation',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Inflammation.wav?alt=media&token=6cfbfda8-b44e-437e-81c9-58740e01306a',
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Inflammation.m4a?alt=media&token=6becda90-a0fc-49ff-822e-da80cff4a4c0',
      duration: 0.00,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 7,
      filename: 'Performance',
      isRequire: true,
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Performance.m4a?alt=media&token=dc4f9e62-5db8-4514-a96a-376f72af4045',
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Performance.wav?alt=media&token=afa0ae22-154c-45a3-aeaf-1275e14a5b4f',
      duration: 0.60,
      type: 'brain',
      album: 'SE Therapies'
    },    
    {
      id: 8,
      filename: 'Circulation',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Circulation.wav?alt=media&token=50088af6-c570-436e-86df-5ccce4907674',
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Circulation.m4a?alt=media&token=ff67f0c3-d9b2-4c75-bcc4-cffab70d0d9d',
      duration: 0.00,
      type: 'brain',
      album: 'SE Therapies'
    },
    {
      id: 9,
      filename: 'Recovery',
      isRequire: true,
      uri: 'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Recovery.wav?alt=media&token=eb24f439-0dc2-483b-bde7-6582a30661a0',
      iosURL:'https://firebasestorage.googleapis.com/v0/b/octacoil.appspot.com/o/Recovery.m4a?alt=media&token=6d5f3e0b-73b4-4937-b1fd-5fb746cd5b96',
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
  media;
  album;
  dataProviderData;
  filterAudioData;

  getAudioFiles = async () => {
    let {dataProvider, audioFiles, audioLists, filteredAudio } = this.state;
    audioFiles = [];
    this.album = await MediaLibrary.getAlbumAsync("octaCoil");
    this.media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      album:this.album
    });
    this.media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      album:this.album,
      first: this.media.totalCount,
    });

    this.media.assets.map((item) => {
      item.isDownloaded = true;
      item.type= 'brain';
      item.album = 'SE Therapies';
      item.filename = item.filename.split('.').slice(0, -1).join('.');
      return this.media.assets;
    });

    for( let i=this.media.assets.length - 1; i>=0; i--){
      for( let j=0; j<audioLists.length; j++){
          if(this.media.assets[i] && (this.media.assets[i].filename === audioLists[j].filename)){
              audioLists.splice(j,1);
          }
      }
    }

    this.dataProviderData = dataProvider.cloneWithRows([...audioFiles, ...audioLists, ...this.media.assets]);
    this.filterAudioData = filteredAudio.cloneWithRows([...audioFiles, ...audioLists, ...this.media.assets]);
    this.totalAudioCount = audioLists.length+this.media.assets.length;
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
      dataProvider: this.dataProviderData,
      filteredAudio:  this.filterAudioData,
      audioFiles: [...audioFiles, ...audioLists, ...this.media.assets],
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

    if (playbackStatus.didJustFinish) {
      if (this.state.isPlayListRunning) {
        let audio;
        
        const indexOnPlayList = this.state.activePlayList.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );

        const nextIndex =  indexOnPlayList;
        audio = this.state.activePlayList.audios[nextIndex];

        if (!audio) audio = this.state.activePlayList.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(this.state.playbackObj, Platform.OS == 'android' ? audio.uri : audio.iOSURL);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex =  this.state.currentAudioIndex;
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
      const status = await playNext(this.state.playbackObj, Platform.OS == 'android' ? audio.uri : audio.iOSURL);
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
          getAudioFiles:this.getAudioFiles,
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
