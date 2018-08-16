import React, {Component, PropTypes} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import _ from 'lodash';
import {render} from 'react-dom';


export default class MlAppClusterMapMarker extends Component {
  constructor(props) {
    super(props);
  }

  onMouseEnterContent(customHoverHandler) {
    if(customHoverHandler){
    this.props.onMouseEnterContent(customHoverHandler);
    }
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
        <div style={{'width': '200px'}} className={`cluster_map ${this.props.isActive?"active":"inactive"}`} id={this.props.markerId}
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
MlAppClusterMapMarker.propTypes = {
  text: PropTypes.string
}
MlAppClusterMapMarker.defaultProps = {};
MlAppClusterMapMarker.shouldComponentUpdate = shouldPureComponentUpdate;

