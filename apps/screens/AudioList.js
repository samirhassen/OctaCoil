import React, { Component, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OptionModal from "../components/OptionModal";
import { selectAudio } from "../misc/audioController";
import { musicControlListener } from "../misc/audioController";

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
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
    musicControlListener({ context: this.context });
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <Functional
        type={type}
        item={item}
        index={index}
        extendedState={extendedState}
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
    this.props.navigation.navigate("PlayList");
  };

  onPressAudioType = (dataProvider, type) => {
    if (dataProvider._data.length > 0) {
      var filteredSong = dataProvider._data.filter(
        (song) => song.type === type
      );
      const tempData1 =
        filteredSong.length == 0
          ? dataProvider
          : dataProvider.cloneWithRows([...filteredSong]);
      this.context.updateState({}, { filteredAudio: tempData1 });
    }
  };
  /*
              <View style={styles.category}>
              <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'all')}>
                  <Text style={styles.btnText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'brain')}>
                  <Text style={styles.btnText}>Brain</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'heart')}>
                  <Text style={styles.btnText}>Heart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'bone')}>
                  <Text style={styles.btnText}>Bone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnstyle} onPress = {() => this.onPressAudioType(dataProvider, 'Healing')}>
                  <Text style={styles.btnText}>Healing</Text>
                </TouchableOpacity>
              </View>
*/
  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying, filteredAudio }) => {
          if (!filteredAudio._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                style={styles.marginFromTop}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  {
                    title: "Add to playlist",
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

const Functional = ({
  type,
  item,
  index,
  extendedState,
  onAudioPress,
  onOptionPress,
}) => {
  const context = useContext(AudioContext);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  return (
    <AudioListItem
      isSoundPlaying={isSoundPlaying}
      setIsSoundPlaying={setIsSoundPlaying}
      item={item}
      title={item.filename}
      type={item.type}
      album={item.album}
      url={Platform.OS == "android" ? item.urlAndroid : item.urlIOS}
      isDownlaod={item?.isDownloaded}
      isPlaying={extendedState.isPlaying}
      duration={item.duration}
      activeListItem={context.currentAudioIndex === index}
      onAudioPress={onAudioPress}
      onOptionPress={onOptionPress}
    />
  );
};

const styles = StyleSheet.create({
  marginFromTop: {
    marginTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    height: 90,
    marginLeft: 24,
    marginTop: 45,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  btnstyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingBottom: 2,
    marginLeft: 5,
    borderRadius: 4,
    elevation: 3,
    opacity: 0.7,
    backgroundColor: "white",
  },
  iconStyle: {
    marginLeft: 20,
    marginTop: 10,
  },
  btnText: {
    fontSize: 20,
  },
});

export default AudioList;
