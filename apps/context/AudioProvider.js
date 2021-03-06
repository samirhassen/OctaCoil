import React, { Component, createContext, createRef } from "react";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../misc/helper";
import { playNext } from "../misc/audioController";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

export const AudioContext = createContext();
export const audioItems = [
  {
    id: 0,
    filename: "Energize",
    isRequire: true,
    fileNameExtAndroid: "Energize.flac",
    fileNameExtIOS: "Energize.m4a",

    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Energize.m4a?alt=media&token=ac26cc9d-338d-41db-9609-18268a398e76",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FEnergize.flac?alt=media&token=0712342c-54d5-4d65-96a3-9366b53a895d",
    duration: 720.013,
    type: "Gamma brainwaves for alertness and mental processing",
    urlIOS_hls:
      "https://firebasestorage.googleapis.com:443/v0/b/octacoil-app.appspot.com/o/M3U8%2FEnergise%2Fplaylist.m3u8?alt=media&token=72842bb4-9bca-4d87-8ebd-6dba3b93cdcb",
  },

  {
    id: 1,
    filename: "Focus",
    fileNameExtAndroid: "Focus.flac",
    fileNameExtIOS: "Focus.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Focus.m4a?alt=media&token=3de11cd2-6008-4744-9f31-b0605a575f4e",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FFocus.flac?alt=media&token=c80a9eed-8709-48f3-8392-419cae34e396",
    duration: 540.033,
    type: "Beta brainwaves for attention and focus",
    urlIOS_hls:
      "https://firebasestorage.googleapis.com:443/v0/b/octacoil-app.appspot.com/o/M3U8%2FFocus%2Fplaylist.m3u8?alt=media&token=b9e4df83-22e9-4a85-9613-bc08f8fdd1e4",
  },

  {
    id: 2,
    filename: "Relax",
    isRequire: true,
    fileNameExtAndroid: "Relax.flac",
    fileNameExtIOS: "Relax.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Relax.m4a?alt=media&token=194185f7-3f02-49e4-8760-a33642260b75",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FRelax.flac?alt=media&token=eb71c46f-1f42-4780-835f-10e20d3605ea",
    duration: 360.12,
    type: "Theta brainwaves for meditation and creativity",
  },
  {
    id: 3,
    filename: "Sleep",
    isRequire: true,
    fileNameExtAndroid: "Sleep.flac",
    fileNameExtIOS: "Sleep.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Sleep.m4a?alt=media&token=16cd5ee4-48b2-4776-976a-6714ad6e36f8",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FSleep.flac?alt=media&token=92517e44-c911-4f61-b859-41ee3b9a63d0",
    duration: 720.001,
    type: "Delta brainwaves for deep sleep and relaxation",
  },
  {
    id: 4,
    filename: "Bones",
    isRequire: true,
    fileNameExtAndroid: "Bones.flac",
    fileNameExtIOS: "Bones.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Bones.m4a?alt=media&token=fae5e63c-e89e-4041-b874-8df67f62931e",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FBones.flac?alt=media&token=448b7d2e-d0a7-4d9c-a5ba-17d7da8ef96f",
    duration: 180.001,
    type: "Stimulate bone growth for fracture repair and increased density",
  },
  {
    id: 5,
    filename: "Inflammation",
    isRequire: true,
    fileNameExtAndroid: "Inflammation.flac",
    fileNameExtIOS: "Inflammation.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Inflammation.m4a?alt=media&token=ca76699d-20e0-4f8c-8486-fc34a43cd56d",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FInflammation.flac?alt=media&token=9f39a5c8-d7d9-445a-8c3d-61e40650428b",
    duration: 188.4,
    type: "Reduce inflammation for pain management and tissue healing",
  },
  {
    id: 6,
    filename: "Performance",
    isRequire: true,
    fileNameExtAndroid: "Performance.flac",
    fileNameExtIOS: "Performance.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Performance.m4a?alt=media&token=2c8ae0ee-3a65-485b-a185-61f4be92d482",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FPerformance.flac?alt=media&token=b67f091a-9e35-44e5-bf98-51a04c2befa5",
    duration: 187.2,
    type: "Nitric Oxide production for performance and health",
  },
  {
    id: 7,
    filename: "Circulation",
    isRequire: true,
    fileNameExtAndroid: "Circulation.flac",
    fileNameExtIOS: "Circulation.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Circulation.m4a?alt=media&token=5c7f6bb7-8c30-404a-9d22-e88db913dcf4",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FCirculation.flac?alt=media&token=61eac8c1-68c8-4fb3-9bc5-acb84de9c3f0",
    duration: 194.4,
    type: "Heart and blood vessel support for circulation",
  },
  {
    id: 8,
    filename: "Recovery",
    isRequire: true,
    fileNameExtAndroid: "Recovery.flac",
    fileNameExtIOS: "Recovery.m4a",
    urlIOS:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Recovery.m4a?alt=media&token=b19953a5-0302-4471-80f8-4b65b0de0a97",
    urlAndroid:
      "https://firebasestorage.googleapis.com/v0/b/octacoil-app.appspot.com/o/Flac%2FRecovery.flac?alt=media&token=82f27073-e6f5-4704-b483-421d0cf26c1c",
    duration: 194.4,
    type: "Boost anabolic cellular activity for tissue growth and recovery",
  },
];

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      dataProvider: new DataProvider((r1, r2) => r1.url !== r2.url),
      filteredAudio: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      isPlayListRunning: false,
      activePlayList: [],
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
      audioLists: audioItems,
      isLoop: true,
      isLoggedIn: false,
      isAudioPlaying: false,
    };
    this.totalAudioCount = 0;

    this.sound = createRef(null);
    this.soundTimer = createRef(null);
  }
  media;
  album;
  dataProviderData;
  filterAudioData;

  getAudioFiles = async () => {
    let { dataProvider, audioFiles, filteredAudio } = this.state;
    audioFiles = [];
    this.album = await MediaLibrary.getAlbumAsync("octaCoil");
    this.media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      album: this.album,
    });
    this.media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      album: this.album,
      first: this.media.totalCount,
    });

    this.media.assets.map((item) => {
      item.isDownloaded = true;
      item.audioType = "brain";
      item.album = "SE Therapies";
      item.urlAndroid = item.uri;
      item.urlIOS = item.uri;
      delete item.uri;
      let fileExtension =
        Platform.OS === "ios" ? item.fileNameExtIOS : item.fileNameExtAndroid;
      fileExtension = fileExtension?.split(".").slice(0, -1).join(".");
      return this.media.assets;
    });

    const checkIfDownloaded = async (name) => {
      return await RNFetchBlob.fs.exists(
        RNFetchBlob.fs.dirs.DocumentDir + `/${name}`
      );
    };
    let tracks = [];
    for (var i = 0; i <= audioItems.length; i++) {
      const item = audioItems[i];
      if (item) {
        const fileExtension =
          Platform.OS === "ios" ? item.fileNameExtIOS : item.fileNameExtAndroid;
        const isDownloaded = await checkIfDownloaded(fileExtension);

        const localPath = RNFetchBlob.fs.dirs.DocumentDir + `/${fileExtension}`;

        let url;
        if (isDownloaded) {
          url = "file://" + localPath;
        } else {
          url = Platform.OS === "ios" ? item.urlIOS : item.urlAndroid;
        }
        tracks.push({
          ...item,
          isDownloaded,
          url,
        });
      }
    }
    this.dataProviderData = dataProvider.cloneWithRows([
      ...tracks,
      ...this.media.assets,
    ]);
    this.filterAudioData = filteredAudio.cloneWithRows([
      ...tracks,
      ...this.media.assets,
    ]);

    this.setState({
      audioFiles: tracks,
      filteredAudio: this.filterAudioData,
      dataProvider: this.dataProviderData,
    });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
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

  onPlaybackStatusUpdate = async (playbackStatus) => {
    console.log("playbackstatus", playbackStatus);
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

        const nextIndex = indexOnPlayList;
        audio = this.state.activePlayList.audios[nextIndex];

        if (!audio) audio = this.state.activePlayList.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(
          this.state.playbackObj,
          Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS
        );
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex = this.state.currentAudioIndex;
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
      const status = await playNext(
        this.state.playbackObj,
        Platform.OS == "android" ? audio.urlAndroid : audio.urlIOS
      );
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
  };

  async componentDidMount() {
    const status = await MediaLibrary.requestPermissionsAsync();
    if (status.granted) {
      this.getAudioFiles();
    } else {
      Alert("Media permission not granted");
    }

    setTimeout(() => {
      this.playbackObjMethod();
    }, 0);
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState }, () => {});
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
      isAudioPlaying,
    } = this.state;
    console.log("updatingsaudioprovider", currentAudioIndex);

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
          isAudioPlaying,
          sound: this.sound,
          soundTimer: this.soundTimer,
          updateState: this.updateState,
          getAudioFiles: this.getAudioFiles,
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
