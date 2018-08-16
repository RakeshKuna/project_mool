import React, {Component} from "react";

export default class MlAppRegStep7 extends Component {
  constructor(props) {
    super(props);
    this.handleFinalClick = this.handleFinalClick.bind(this);
    this.state = {finalClicked: false};
    return this;
  }

  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (150 + $('.app_header').outerHeight(true)));
  }

  handleFinalClick() {
    this.setState({finalClicked: true});
    console.log('final click called')
  }

  valueBeforeSubmit(communityName) {
    return <p className="reg_payment">
      You have completed your {communityName} registration step on moolya.<br/>
      <a href="" className="ideabtn" style={{'margin':'5px 20px 0px 0px'}}onClick={this.handleFinalClick}> Click here </a>
      to submit these details to the admin for approval.
    </p>
  }

  valueAfterSubmit(communityName) {
    return <p className="reg_payment">
      Your {communityName} registration details have been submitted to the administrator. <br/>You will receive email
      alerts on the next steps.
      <br/><br/>
      You can explore the moolya global ecosystem by clicking on the<br/> community options on the left ribbon menu.<br/><br/>
      Additional moolya features and actions will be unlocked,<br/>
      once your profile and KYC details are approved by the administrator.
    </p>
  }

  render() {
    const {finalClicked} = this.state;
    const {communityName} = this.props.registrationInfo;
    return (
      <div className="step_form_wrap step5">
        {finalClicked ? this.valueAfterSubmit(communityName) : this.valueBeforeSubmit(communityName)}
      </div>
    )
  }
};
