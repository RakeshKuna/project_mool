import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar';

export default class MlAppActivityHistory extends React.Component{
  isUpdated(){
    return true;
  }
  componentWillMount() {
    this.props.activeComponent(3);
  }

  componentDidMount()
  {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.admin_header').outerHeight(true)));
  }
  render(){
    return (
      <h1>Coming soon...</h1>
    )
  }
};
