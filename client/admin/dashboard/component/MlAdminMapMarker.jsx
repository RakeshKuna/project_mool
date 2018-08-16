import React, {Component, PropTypes} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import _ from 'lodash';

import {render} from 'react-dom';
//
// const K_SIZE = 80;
//
// const mapMarkerStyle = {
//   // initially any map object has left top corner at lat lng coordinates
//   // it's on you to set object origin to 0,0 coordinates
//
//   position: 'absolute',
//   width: K_SIZE,
//   height: K_SIZE,
//   left: -K_SIZE / 2,
//   top: -K_SIZE / 2,
//
//   border: '5px solid #f44336',
//   borderRadius: K_SIZE,
//   backgroundColor: 'white',
//   textAlign: 'center',
//   color: '#3f51b5',
//   fontSize: 16,
//   fontWeight: 'bold',
//   padding: 4,
//   cursor: 'pointer'
// };
//
// const mapMarkerStyleHover = {
//   ...mapMarkerStyle,
//   border: '5px solid #3f51b5',
//   color: '#f44336'
// };

export default class MlAdminMapMarker extends Component {
  constructor(props) {
    super(props);
  }

  onMouseEnterContent(customHoverHandler) {
    this.props.onMouseEnterContent(customHoverHandler);
  }

  onMouseLeaveContent() {
    this.props.onMouseLeaveContent();
  }

  markerClickActionHandler(){
    this.props.markerClickActionHandler(this.props.data)
  }

  render() {
    let status = "";
    if(this.props.status && (this.props.status.code == 100)){
      status = "tobeassign"
    }
    if(this.props.status && (this.props.status.code == 101)){
      status = "workinprogress"
    }
    if(this.props.status && (this.props.status.code == 110)){
      status = "inactive"
    }
    if(this.props.status && (this.props.status.code == 111)){
      status = "active"
    }

    if(_.isBoolean(this.props.status)){
      if(this.props.isActive && !this.props.status){
        status = "workinprogress"
      }
      if(!this.props.isActive && !this.props.status){
        status = "inactive"
      }
      if(this.props.isActive && this.props.status){
        status = "active"
      }
    }

    // console.log(this.props.flag);
    // console.log(this.props.text);
    return (
      <div>{this.props.status?
        <div style={{'width': '200px'}} className={`cluster_map ${status}`} id={this.props.markerId}
             onMouseOver={this.onMouseEnterContent.bind(this,this.props.hoverActionHandler)} onMouseOut={this.onMouseLeaveContent.bind(this)}
             onClick={this.markerClickActionHandler.bind(this, this.props)}>
          <div className="hex_btn hex_btn_in">
            <span>
              {this.props.showImage && this.props.showImage===true?<img src={Meteor.settings.public.countriesFlagBaseUrl+this.props.text}/>:<b>{this.props.text}</b>}</span>
            <div className="indec"></div>
          </div>
          {/*{this.state.isHover ? (<div><MapDetails data={this.state.data}/></div>) : ""}*/}
          {this.props.isHover ? (<div>{this.props.HoverComponent}</div>) : ""}
        </div>
        :
        <div style={{'width': '200px'}} className={`cluster_map ${status}`} id={this.props.markerId}
             onMouseOver={this.onMouseEnterContent.bind(this,this.props.hoverActionHandler)} onMouseOut={this.onMouseLeaveContent.bind(this)}
             onClick={this.markerClickActionHandler.bind(this, this.props)}>
          <div className="hex_btn hex_btn_in">
          <span>
           {this.props.showImage && this.props.showImage===true?<img src={Meteor.settings.public.countriesFlagBaseUrl+this.props.text}/>:<b>{this.props.text}</b>}</span>
            <div className="indec"></div>
          </div>
          {/*{this.state.isHover ? (<div><MapDetails data={this.state.data}/></div>) : ""}*/}
          {this.props.isHover ? (<div>{this.props.HoverComponent}</div>) : ""}
        </div>
      }</div>
    );
  }
}
MlAdminMapMarker.propTypes = {
  text: PropTypes.string
}
MlAdminMapMarker.defaultProps = {};
MlAdminMapMarker.shouldComponentUpdate = shouldPureComponentUpdate;

