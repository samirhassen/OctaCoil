import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import {
  selectAudio,
} from '../misc/audioController';

export class AudioList extends Component {
  static contextType = AudioContext;
  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }

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


  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        type = {item.type}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('PlayList');
  };

  onPressAudioType = (dataProvider, type) => {
    if(dataProvider._data.length > 0) {
        var filteredSong = dataProvider._data.filter((song) => song.type === type);
        const tempData1 = filteredSong.length == 0 ? dataProvider : dataProvider.cloneWithRows([...filteredSong])
        this.context.updateState({}, {filteredAudio : tempData1});
    }
  }

  render() {
    
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying, filteredAudio }) => {
          if (!filteredAudio._data.length) return null;
          return (
            <Screen>
              <View style={styles.category}>
              <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'all')}>
                  <Text style={styles.btnText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'rock')}>
                  <Text style={styles.btnText}>Rock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'pop')}>
                  <Text style={styles.btnText}>Pop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'jazz')}>
                  <Text style={styles.btnText}>Jazz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'blues')}>
                  <Text style={styles.btnText}>Blues</Text>
                </TouchableOpacity>
              </View>
              <RecyclerListView
                dataProvider={filteredAudio}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
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
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    height: 90,
    marginLeft: 15,
    marginTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  btnstyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 2,
    marginLeft: 5,
    borderRadius: 4,
    elevation: 3,
    opacity: 0.5,
    backgroundColor: 'white',
  },
  iconStyle: {
    marginLeft: 20,
    marginTop: 10 
  },
  btnText: {
    fontSize: 24,
  }
});

export default AudioList;
