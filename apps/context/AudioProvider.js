import React, { Component, createContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Text } from 'react-native';
import {DataProvider} from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export const AudioContext = createContext();

export class AudioProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            playbackDuration: null
        };
        this.totalAudioCount = 0;
    }

    permissionAlert = () => {
        Alert.alert('Permission Required!' , 'This App need to require audio file', [
           {
               text : "I am ready.",
               onPress: this.getPermission()
           },{
               text : 'cancel',
               onPress: this.permissionAlert()
           }
        ])
    }

    getAudioFiles = async () => {
        const { dataProvider, audioFiles } = this.state;
        let media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
        });
        media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: media.totalCount,
        });
        this.totalAudioCount = media.totalCount;
    
        this.setState({
          ...this.state,
          dataProvider: dataProvider.cloneWithRows([
            ...audioFiles,
            ...media.assets,
          ]),
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

        if(!permission.granted && !permission.canAskAgain) {
            this.setState({...this.state, permissionError: true})
        }

        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

            if (status == 'denied' && canAskAgain) {
                this.permissionAlert();
            }

            if (status == 'granted') {
                this.getAudioFiles();
            }

            if (status == 'denied' && !canAskAgain) {
                this.setState({...this.state, permissionError: true})
            }
        }

    }


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
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration,
            isPlayListRunning,
            activePlayList} = this.state;
            if(permissionError) {
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
            }
            return (
                <AudioContext.Provider
                    value={{
                        audioFiles,
                        playList,
                        addToPlayList,
                        dataProvider,
                        playbackObj,
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
                        onPlaybackStatusUpdate: this.onPlaybackStatusUpdate
                    }}>
                    {this.props.children}
                </AudioContext.Provider>
            )
    }
}