import React from 'react';
import { Meteor } from 'meteor/meteor';
import videojs from 'video.js'

export default class MlVideoPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state={
      videoUrl: ""
    }
  }
  // componentDidMount() {
  //     this.player = videojs(this.props, function onPlayerReady() {
  //     console.log('onPlayerReady', this)
  //   });
  // }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }
  componentWillReceiveProps(nextProps){
      let temp = nextProps.videoAttributes[0].sources[0].src;
    this.setState({videoUrl: temp })
    }
  render() {
    return (
      <div data-vjs-player>
        <video width="100%" controls autoPlay={true} src={this.props.videoAttributes[0].sources[0].src}></video>
      </div>
    )
  }
}

