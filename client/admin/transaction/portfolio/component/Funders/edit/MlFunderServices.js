/**
 * Created by vishwadeep on 23/6/17.
 */
import React, {Component} from "react";
import FunderCreateServicesView from "./beSpokeHandler";
import BeSpokeHandler from './Services/Container/beSpokeHandler'
import MlFunderServicesList from './Services/Container/MlFunderServicesList'
import FunderOrderServicesView from "./funderOrderServicesView";

export default class MlFunderServices extends Component {
  componentDidMount() {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $(function () {
      $('.float-label').jvFloat();
    });
    $('.tab_wrap_scroll').height(WinHeight - ($('.app_header').outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".tab_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
    }
    console.log(this.props)
  }

  render() {
    return (
      <div>
        {/*<FunderOrderServicesView/>*/}
        <div className="clearfix"/>
        <MlFunderServicesList myPortfolio={this.props.myPortfolio} createServiceMode={this.props.createServiceMode?this.props.createServiceMode:""} portfolioDetailsId={this.props.portfolioDetailsId} />
      </div>
    )
  }
};

