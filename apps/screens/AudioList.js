import React, { Component, useContext, useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
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
    () => "audio",
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
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

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
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const Functional = ({ item, index, extendedState, onOptionPress }) => {
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
      // onAudioPress={onAudioPress}
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
