// Created by Rajat Shekhar

import React, { Component, PropTypes } from 'react';
import _ from "lodash";
// import {fetchUsers} from '../actions/findMapDetailsTypeAction'
import MlLoader from '../../../commons/components/loader/loader'

var users = [];
var activeUsers = [];
export default class MlMapFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCount:0,
      loading: false,
    }
    // this.findAllUsers.bind(this);
    return this;
  }

  componentWillMount() {
    // this.setState({loading:true})
    // let ret = this.findAllUsers()
    // return ret;
  }
  //
  // async findAllUsers() {
  //   let context = this.props.mapContext;
  //   let response;
  //
  //   if(context){
  //     let clusterId = context.params&&context.params.clusterId?context.params.clusterId:"";
  //     let chapterId = context.params&&context.params.chapterId?context.params.chapterId:"";
  //     let subChapterId = context.params&&context.params.subChapterId?context.params.subChapterId:"";
  //     let userType = this.props.userType;
  //     response = await fetchUsers(clusterId, chapterId, subChapterId, userType);
  //   }
  //   if(response){
  //     let users = response ? response : []
  //     let activeUsers = _.filter(users, function(user) {
  //
  //       if(user.profile.isActive)
  //         return user
  //
  //     });
  //     this.setState({loading:false,activeCount:activeUsers.length})
  //   }
  // }

  render() {
    // let that = this;
    // let activeData=[];
    // let data = that.props.data||[];
    // if(data && that.props.mapContext.module=="users"){
    //   activeData = _.filter(data, function(user) {
    //     if(user.profile.isActive)
    //       return user
    //   });
    // }else {
    //   activeData = _.filter(data,  {'isActive': true, 'showOnMap':true});
    // }
    // const showLoader = that.state.loading;
    return (
      <div>
            <div className="bottom_actions_block bottom_count">
              <div><b>{this.props.count}</b> User(s) are Active<br/></div>
            </div>
      </div>

    )
  }
}
