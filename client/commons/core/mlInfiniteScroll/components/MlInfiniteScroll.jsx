/** ************************************************************
 * Date: 12 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll component
 * JavaScript file MlInfiniteScroll.js
 * *************************************************************** */

/**
 * Import libs and component
 */
import React, { Component } from 'react';
import MlInfiniteScrollComposer from '../actions/MlInfiniteScrollComposer';
import _ from 'lodash';

export default class MlInfiniteScroll extends Component {

  constructor(props){
    super(props);

  }

  render() {
    let config=this.props.config;
    config.params = this.props.params;

    return (
      <MlInfiniteScrollComposer {...config}/>
    );
  }

}
