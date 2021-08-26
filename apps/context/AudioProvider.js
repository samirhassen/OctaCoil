// Play Music / Sound in React Native App for Android and iOS
// https://aboutreact.com/react-native-play-music-sound/

// import React in our code
import React, {useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

// import Sound Component
import Sound from 'react-native-sound';

const App = () => {
  let sound1, sound2, sound3, sound4, sound5, sound6;

  useEffect(() => {
    Sound.setCategory('Playback', true); // true = mixWithOthers
    return () => {
      if (sound1) sound1.release();
      if (sound2) sound2.release();
      if (sound3) sound3.release();
      if (sound4) sound4.release();
      if (sound5) sound5.release();
      if (sound6) sound6.release();
    };
  }, []);

  //List of the dummy sound track
  const audioList = [
    {
      title: 'Bone',
      isRequire: true,
      url: require('../../assets/Bone.wav'),
    },
    {
      title: 'Circulation',
      url: require('../../assets/Circulation.wav'),
    },
    {
      title: 'Energize',
      isRequire: true,
      url: require('../../assets/Energize.wav'),
    },
    {
      title: 'Focus',
      url: require('../../assets/Focus.wav'),
    },
    {
      title: 'Inflammation',
      isRequire: true,
      url: require('../../assets/Inflammation.wav'),
    },
    {
      title: 'Performance',
      url: require('../../assets/Performance.wav'),
    }
  ];

  const playSound = (item, index) => {
    if (index == 0) {
      sound1 = new Sound(item.url, (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound1.play(() => {
          sound1.release();
        });
      });
    } else if (index == 1) {
      sound2 = new Sound(item.url, '', (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound2.play(() => {
          sound2.release();
        });
      });
    } else if (index == 2) {
      sound3 = new Sound(item.url, (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound3.play(() => {
          sound3.release();
        });
      });
    } else if (index == 3) {
      sound4 = new Sound(item.url, '', (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound4.play(() => {
          sound4.release();
        });
      });
    } else if (index == 4) {
      sound5 = new Sound(item.url, (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound5.play(() => {
          sound5.release();
        });
      });
    } else if (index == 5) {
      sound6 = new Sound(item.url, '', (error, _sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound6.play(() => {
          sound6.release();
        });
      });
    }
  };

  const stopSound = (_item, index) => {
    if (index == 0 && sound1) {
      sound1.stop(() => {
        console.log('Stop');
      });
    } else if (index == 1 && sound2) {
      sound2.stop(() => {
        console.log('Stop');
      });
    } else if (index == 2 && sound3) {
      sound3.stop(() => {
        console.log('Stop');
      });
    } else if (index == 3 && sound4) {
      sound4.stop(() => {
        console.log('Stop');
      });
    } else if (index == 4 && sound5) {
      sound5.stop(() => {
        console.log('Stop');
      });
    } else if (index == 5 && sound6) {
      sound6.stop(() => {
        console.log('Stop');
      });
    }
  };

  const ItemView = (item, index) => {
    return (
      <View style={styles.feature} key={index}>
        <Text style={styles.textStyle}>{item.title}</Text>
        <TouchableOpacity onPress={() => playSound(item, index)}>
          <Text style={styles.buttonPlay}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => stopSound(item, index)}>
          <Text style={styles.buttonStop}>Stop</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Play Music / Sound in React Native App for Android and iOS
        </Text>
        <ScrollView style={{flex: 1}}>
          {audioList.map(ItemView)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    flex: 1,
    padding: 5,
  },
  buttonPlay: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(00,80,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  buttonStop: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(80,00,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  feature: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 7,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
  },
});
/*
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
  constructor(props) {
    super(props);
    this.state = {
      filteredAudio : new DataProvider((r1, r2) => r1 !== r2),
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      isPlayListRunning: false,
      activePlayList: [],
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
      isLoop : true,
      isLoggedIn: false
    };
    this.totalAudioCount = 0;
  }

  arrType = ['rock', 'pop', 'jazz', 'blues'];

  permissionAllert = () => {
    Alert.alert('Permission Required', 'This app needs to read audio files!', [
      {
        text: 'I am ready',
        onPress: () => this.getPermission(),
      },
      {
        text: 'cancle',
        onPress: () => this.permissionAllert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles, filteredAudio } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    const dataProviderData = dataProvider.cloneWithRows([
      ...audioFiles,
      ...media.assets,
    ]);

    const filteredAudioData = filteredAudio.cloneWithRows([
      ...audioFiles,
      ...media.assets,
    ]);

    dataProviderData._data.map((audioFile) => {
      audioFile.type = this.arrType[Math.floor(Math.random()*this.arrType.length)];
      return audioFile;
    });

    filteredAudioData._data.map((audioFile) => {
      audioFile.type = this.arrType[Math.floor(Math.random()*this.arrType.length)];
      return audioFile;
    });

    this.setState({
      ...this.state,
      dataProvider: dataProviderData,
      filteredAudio:  filteredAudioData,
      audioFiles: [...audioFiles, ...media.assets],
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

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === 'denied' && canAskAgain) {
        this.permissionAllert();
      }

      if (status === 'granted') {
        this.getAudioFiles();
      }

      if (status === 'denied' && !canAskAgain) {
        this.setState({ ...this.state, permissionError: true });
      }
    }
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
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      permissionError,
      playbackObj,
      isLoggedIn,
      soundObj,
      currentAudio,
      filteredAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
      isPlayListRunning,
      activePlayList,
    } = this.state;
    if (permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>
            It looks like you haven't accept the permission.
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          playList,
          addToPlayList,
          dataProvider,
          playbackObj,
          filteredAudio,
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
*/