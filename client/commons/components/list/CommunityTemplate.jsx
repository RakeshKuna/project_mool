import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  $ from 'jquery'
export default class MoolyaCommunityTemplate extends Component {

  render(){
    return(
      <div className="col-md-2">
        <div className={`list_block ${this.props.communityType}_block`}>
          <div className={`cluster_status ${this.props.statusField}_cl `} />
         <a href={this.props.listRouterPath}> <div className={`${this.props.communityType}_mask `}>
            <img src={this.props.imageLink} />
          </div></a>
          <h3>{this.props.nameField}<br />
            {this.props.countryField}</h3>
        </div>
      </div>
    )
  }

}

