import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');



export default class MyWishlist extends React.Component{
componentDidMount()
  {
  $(function() {
  $('.float-label').jvFloat();
  });

  $('.switch input').change(function() {
  if ($(this).is(':checked')) {
    $(this).parent('.switch').addClass('on');
  }else{
    $(this).parent('.switch').removeClass('on');
  }
  });


  }
  render(){
    return (<div></div>)
  }
};
