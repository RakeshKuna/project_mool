import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
export default class MlAccessDenied extends React.Component{
  componentDidMount()
  {
  }
  goBack() {
    window.history.back();
  }
  render(){
    return (
      <div className="app_main_wrap">
        <div className="otp">
          <div className="hex_outer">
            <FontAwesome name='ban'/>
            <h3>Access Denied</h3>
            <p>Return to the <a href="" onClick={this.goBack}>previous page</a> or
              go back to your <a href="/admin">home</a>.</p>
          </div>

        </div>
        <div className="opt-overlay"></div>
      </div>
    )
  }
};
