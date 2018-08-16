import React from 'react';

export default class MlAppActivityHistory extends React.Component{
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
