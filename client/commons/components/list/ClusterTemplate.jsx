import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  $ from 'jquery'
export default class MoolyaClusterTemplate extends Component {

  render(){
    return(
      <div className="col-md-2">
        <div className="list_block">
          <div className={`cluster_status ${this.props.statusField}_cl `}></div>
          <a href={this.props.listRouterPath}> <div className={"hex_outer"}><img src={this.props.imageLink}/></div></a>
          <h3>{this.props.nameField}</h3>
        </div>
      </div>

    )
  }

}

