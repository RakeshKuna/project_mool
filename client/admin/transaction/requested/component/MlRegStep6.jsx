import React from 'react';

export default class MlRegStep6 extends React.Component{
componentDidMount()
  {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
  }
  render(){
    return (
      <div className="step_form_wrap step5">
        <p className="reg_payment"> “Your registration has been made complimentary along with the first few users on moolya.<br/>
          Do refer more entrepreneurs, investors and service providers to moolya.<br/>
          Thank you for your time and support.”</p>
      </div>
    )
  }
};
