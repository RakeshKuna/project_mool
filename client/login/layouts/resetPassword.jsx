/**
 * Created by pankaj on 3/6/17.
 */

import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {resetPasswordActionHandler} from '../actions/resetPassword'
import passwordSAS_validate from '../../../lib/common/validations/passwordSASValidator';
MlResetPasswordContent = React.createClass({

  async submit(){
    // let errMessages = {"userName": "A valid username is required"};
    let password = this.refs.password.value;
    let conformPassword = this.refs.conformPassword.value;

    var validate = passwordSAS_validate(password);
    if (!validate.isValid && typeof (validate) == 'object') {
      toastr.error('Password '+ validate.errorMsg);
      return;
    }

    if(password == conformPassword){
      let token = FlowRouter.getParam('token');
      // let response = await resetPasswordActionHandler(token, password);
      let data={token:token,password:password};
      var header={ apiKey: "741432fd-8c10-404b-b65c-a4c4e9928d32"};
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Meteor.absoluteUrl('resetPassword'),
        data :JSON.stringify(data),
        headers: header,
        contentType: "application/json; charset=utf-8",
        success:function(response){
          if(response.success){
            toastr.success(response.result);
            FlowRouter.go('/login');
          } else {
            toastr.error(response.result);
          }
        }
      });
    } else {
      toastr.error('Password not match');
    }
  },
  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.submit()
    }
  },
  render() {
    return (
      <div id="resetpassword_wrap">
        <div className="login_top">
          <div className="login_top_in"><span>Reset Password</span></div>
        </div>
        <div className="login_block">
          <div className="login_block login_block_in" id="login">
            <form className="form-signin" onKeyPress={this.handleKeyPress}>
              <input type="password" ref="password" className="form-control" placeholder="New Password"/>
              <input type="password" ref="conformPassword" className="form-control" placeholder="Confirm Password"/>
              <button className="ml_submit_btn" onClick={() => this.submit()} type="button">Submit</button><br className="brclear" />
              <p><a href="/login">Login</a> | <a href="#">Register</a></p>
            </form>
          </div>
        </div>
      </div>
    )
  }
});
