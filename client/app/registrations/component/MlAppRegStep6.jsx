import React from "react";
import ScrollArea from "react-scrollbar";

export default class MlAppRegStep6 extends React.Component {
  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (150 + $('.app_header').outerHeight(true)));
  }

  render() {
    return (
      <div className="step_form_wrap step5">
        {/*<ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>*/}
          <p className="reg_payment"> “Your registration has been made complimentary along with the first few users on moolya.<br/>
            Do refer more entrepreneurs, investors and service providers to moolya.<br/>
            Thank you for your time and support.”</p>
        {/*</ScrollArea>*/}
      </div>
    )
  }
};
