import React from "react";
import ScrollArea from "react-scrollbar";
var FontAwesome = require('react-fontawesome');


export default class MlAppTaskStep5 extends React.Component {
  componentDidMount() {
    var mySwiper = new Swiper('.blocks_in_form', {
      speed: 400,
      spaceBetween: 20,
      slidesPerView: 5,
      pagination: '.swiper-pagination',
      paginationClickable: true
    });
    this.props.activeComponent(4);
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (300 + $('.app_header').outerHeight(true)));
  }
  isUpdated() {
    return true;
  }
  render() {
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="form_bg">
            1
          </div>
        </ScrollArea>
      </div>
    )
  }
};
