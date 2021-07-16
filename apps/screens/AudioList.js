import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import Screen from '../components/Screen';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import OptionModal from '../components/OptionModal';
import { selectAudio } from '../misc/audioController';

 export class AudioList extends Component {
   constructor(props) {
     super(props);
     this.state = {
      optionModalVisible: false,
    };
    this.currentItem = {};
   }

     static contextType = AudioContext;
     layoutProvider = new LayoutProvider(
        i => 'audio',
        (type, dim) => {
          switch (type) {
            case 'audio':
              dim.width = Dimensions.get('window').width;
              dim.height = 70;
              break;
            default:
              dim.width = 0;
              dim.height = 0;
          }
        }
      );

      componentDidMount() {
        this.context.loadPreviousAudio();
      }

      handleAudioPress = async audio => {
        await selectAudio(audio, this.context);
      }

     rowRenderer =(type, item, index, extendedState) => {
        return (
          <AudioListItem  title={item.filename}
            isPlaying={extendedState.isPlaying}
            activeListItem={this.context.currentAudioIndex === index}
            duration={item.duration}
            onAudioPress={() => this.handleAudioPress(item)}
            onOptionPress={() => {
              this.currentItem = item;
              this.setState({ ...this.state, optionModalVisible: true });
            }} />
        )
     }

     navigateToPlaylist = () => {
      this.context.updateState(this.context, {
        addToPlayList: this.currentItem,
      });
      this.props.navigation.navigate('PlayList');
    };
  

     render() {
         return (
             <AudioContext.Consumer>
                 {({dataProvider, isPlaying}) => {
                   if (!dataProvider._data.length) return null;
                     return (
                         <Screen>
                            <RecyclerListView dataProvider ={dataProvider}
                            extendedState={{ isPlaying }}
                            layoutProvider ={this.layoutProvider} 
                            rowRenderer = {this.rowRenderer} 
                            />
                            <OptionModal
                              options={[
                                {
                                  title: 'Add to playlist',
                                  onPress: this.navigateToPlaylist,
                                },
                              ]}
                              currentItem={this.currentItem}
                              onClose={() =>
                                this.setState({ ...this.state, optionModalVisible: false })
                              }
                              visible={this.state.optionModalVisible}
                            />
                          </Screen>
                     )
                 }}
             </AudioContext.Consumer>
         );
     }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

