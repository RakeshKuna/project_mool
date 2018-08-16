import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {mlValidations} from "../../commons/validations/formValidation";
import {initalizeFloatLabel} from '../../admin/utils/formElemUtil';
import {validatedEmailId} from "../../commons/validations/mlfieldValidation";
import passwordSAS_validate from '../../../lib/common/validations/passwordSASValidator';

const webSiteUrl = Meteor.settings.public.phpWebSiteLink;
MlLoginLayout = React.createClass({
  render(){
    return <main>{this.props.content}</main>
  }
})

MlLoginContent = React.createClass({

  getInitialState(props){
    this.state = {username: "", password: "", userNameErr: "", passwordErr: ""};
    this.validationMessage = "";
    return this;
  },

  rememberMe(isRememberMeChecked){
    localStorage.setItem('rememberMe',isRememberMeChecked+'');
  },

  loginSubmit(){
    let errMessages = {"userName": "A valid username is required", "Password": "A Password is required"};
    this.validationMessage = mlValidations.formValidations([this.refs.username, this.refs.password], errMessages);
    if (!this.validationMessage) {
      let emailId=this.refs.username.value
      let passwordValid = this.refs.password.value
      let validate = passwordSAS_validate(passwordValid)
      let isValidEmail = validatedEmailId(emailId);
      if (emailId && !isValidEmail) {
        toastr.error('Please enter a valid EmailId');
      }else
      if (!validate.isValid && typeof (validate) == 'object') {
        toastr.error('Password '+ validate.errorMsg);
      }
      else {
        this.props.formSubmit({
          username: this.refs.username.value,
          password: this.refs.password.value
        }, function (result) {
          toastr.error(result);
        })
      }
    }
    else {
      if (this.validationMessage.userName == true)
        toastr.error(this.validationMessage.errMsg);
        // this.setState(Object.assign({userNameErr: this.validationMessage.errMsg}))
      else if (this.validationMessage.Password == true)
        toastr.error(this.validationMessage.errMsg);
        // this.setState(Object.assign({passwordErr: this.validationMessage.errMsg}))
    }
  },
  componentDidMount() {
    var WinHeight = $(window).height();
    $('.login_bg').height(WinHeight);

    localStorage.setItem('rememberMe','false');
    initalizeFloatLabel();
  },
  onValueChange(event){
    if (event.target.name == 'userName') {
      event.target.value = event.target.value.trim()
      this.setState(Object.assign({userNameErr: ""}))
    } else if (event.target.name == 'Password')
      this.setState(Object.assign({passwordErr: ""}))
  },

  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.loginSubmit()
    }
  },
  redirectRegister(){
      if(!Meteor.isCordova){
        window.location.href = webSiteUrl;
      } else{
        window.open(webSiteUrl, '_system');
      }
  },
  render() {

    return (
      <div>
        <div>
          <div className="login_bg" style={{textAlign: "center"}}>
            {/*<video poster="" id="bgvid" autoPlay muted loop playsInline>
              <source src="/images/bg_video.mp4"/>
            </video>*/}
            <div className="video_bg"></div>
            <img className="login_logo" src="/images/login_logo.png"/>
            <div className="login_top">
              <div className="login_top_in"><span>Login</span></div>
            </div>
            <div className="login_block">
              <div className="login_block login_block_in">
                <form className="form-signin" onChange={this.onValueChange} onKeyPress={this.handleKeyPress}>
                  <span ref="userName">{this.state.userNameErr}</span>
                  <input name="userName" ref="username" type="text" className="form-control float-label" placeholder="Email"
                         required autoFocus defaultValue={this.state.username} onBlur={this.validationCheck}/>
                  <span ref="Password">{this.state.passwordErr}</span>
                  <input name="Password" ref="password" type="password" className="form-control float-label"
                         placeholder="Password" required defaultValue={this.state.password}
                         onBlur={this.validationCheck}/>

                  <div className="checkbox_wrap"><input type="checkbox" value={false} onClick={e=>this.rememberMe(e.target.checked)}/><span>Remember me</span></div>
                  <button className="ml_submit_btn" type="button" onClick={this.loginSubmit}>Sign in</button>
                  <br className="brclear"/>
                  <p><a href="/forgot-password">Forgot Password</a> | <a onClick={this.redirectRegister.bind(this)} href="#">Register</a></p>
                </form>
              </div>
            </div>
            <div className="app_msg">
              <p>‘<span className="m_red">m</span><span className="m_yel">oo</span><span className="m_red">lya</span> is best experienced in the following resolutions: 1920 x 1080 and 1280 x 720 on the following browsers: Google Chrome, MS Edge, Mozilla Firefox and Safari.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


MlLoginContent.propTypes = {
  formSubmit: React.PropTypes.func,
}
