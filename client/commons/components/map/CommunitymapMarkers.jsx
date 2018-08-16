import React, {Component, PropTypes} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import _ from 'lodash';

import {render} from 'react-dom';

const K_SIZE = 80;

const mapMarkerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates

  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  border: '5px solid #f44336',
  borderRadius: K_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer'
};

const mapMarkerStyleHover = {
  ...mapMarkerStyle,
  border: '5px solid #3f51b5',
  color: '#f44336'
};

export default class MapMarkers extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, data: {}, isHover: false};
    this.onMouseEnterHandlerCallback.bind(this);
  }

  onMouseEnterHandlerCallback(data){
   this.setState({loading: false, data: data});
  };

  onMouseEnterContent(customHoverHandler) {
    this.setState({isHover: true});
    let resp=[];
    if(customHoverHandler){
      customHoverHandler(this.props,this.onMouseEnterHandlerCallback.bind(this));
    }
      return resp;
  }

  onMouseLeaveContent() {
    this.setState({isHover: false});
  }


  /*async findModuleDetails() {
    let json = {
      moduleName: this.props.module,
      id: this.props.markerId
    }
    const response = await findMapDetailsTypeActionHandler(json);
    this.setState({loading: false, data: response});
    return response;
  }*/

  render() {
    const style = this.props.hover ? mapMarkerStyleHover : mapMarkerStyle;

    let actionConfig = this.props.actionConfiguration|| [];
    let hoverInConfig = _.find(actionConfig, {actionName: 'onMouseEnter'});
    let hoverActionHandler=hoverInConfig&&hoverInConfig.handler?hoverInConfig.handler:null;
    let markerClickConfig = _.find(actionConfig, {actionName: 'onMarkerClick'});
    let markerClickActionHandler=markerClickConfig&&markerClickConfig.handler?markerClickConfig.handler:null;
    let hoverComp = hoverInConfig&&hoverInConfig.hoverComponent?hoverInConfig.hoverComponent:"";
    let data = this.state.data && this.state.data ? this.state.data : [];
    let HoverComponent = React.cloneElement(hoverComp, {data: data});

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

    let className = ''
    if(this.props.text == "IDE"){
      className = "community_icon"+" id"
    }else if(this.props.text == "FUN"){
      className = "community_icon"+" fu"
    }else if(this.props.text == "STU"){
      className = "community_icon"+" st"
    }else if(this.props.text == "INS"){
      className = "community_icon"+" br"
    }else if(this.props.text == "CMP"){
      className = "community_icon"+" co"
    }else if(this.props.text == "SPS"){
      className = "community_icon"+" pr"
    }else{
      className = "community_icon"+" ot"
    }

    return (
      <div>
        <div className={className}></div>
        </div>
    );
  }
}
MapMarkers.propTypes = {
  text: PropTypes.string
}
MapMarkers.defaultProps = {};
MapMarkers.shouldComponentUpdate = shouldPureComponentUpdate;

