/**
 * Created by pankaj on 3/6/17.
 */

import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {forgotPasswordActionHandler} from '../actions/forgotPassword'
const webSiteUrl = Meteor.settings.public.phpWebSiteLink;

MlForgotPasswordContent = React.createClass({

  async submit(){
    // let errMessages = {"userName": "A valid username is required"};
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = this.refs.email.value
    if(re.test(email)){
      let data={email:email};
      var header={ apiKey: "741432fd-8c10-404b-b65c-a4c4e9928d32"};
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Meteor.absoluteUrl('forgotPassword'),
        data :JSON.stringify(data),
        headers: header,
        contentType: "application/json; charset=utf-8",
        success:function(response){
          if(response.success){
            toastr.success(response.result)
          } else {
            toastr.error(response.result);
          }
        }
      });
      // let response = await forgotPasswordActionHandler(email);
    } else {
      toastr.error('A valid email is required');
    }
  },
  redirectRegister(e){
    e.preventDefault();
    if(!Meteor.isCordova){
      window.location.href = webSiteUrl;
    } else{
      window.open(webSiteUrl, '_system');
    }
  },
  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.submit()
    }
  },
  render() {
    return (
      <div id="forgotpassword_wrap">
        <div className="login_top">
          <div className="login_top_in"><span>Forgot Password</span></div>
        </div>
        <div className="login_block">
          <div className="login_block login_block_in" id="login">
            <form className="form-signin" onKeyPress={this.handleKeyPress}>
              <input type="text" className="form-control" style={{'visibility':'hidden'}}/>
              <input type="text" ref="email" className="form-control" placeholder="Email"/>
              <button className="ml_submit_btn" onClick={() => this.submit()} type="button">Submit</button><br className="brclear" />
              <p><a href="/login">Login</a> | <a href="#" onClick={(e) => {this.redirectRegister(e)}}>Register</a></p>
            </form>
          </div>
        </div>
      </div>
    )
  }
});
