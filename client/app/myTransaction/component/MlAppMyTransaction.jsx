/**
 * Created by vishwadeep on 18/6/17.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../admin/core/containers/MlTableViewContainer";
import {mlMyTransactionTableConfig} from "../config/MlMyTransactionTableConfig";
import { Scrollbars } from 'react-custom-scrollbars';
export default class MlAppMyTransaction extends Component {

  componentDidMount() {
    let status = FlowRouter.getQueryParam('status');
    if(status){
      if(status.toLowerCase() == "canceled"){
        toastr.error("payment canceled");
      }else if(status.toLowerCase() == "success"){
        toastr.success("Payment processed successfully");
      }
    }
  }
  componentDidUpdate(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.app_header').outerHeight(true)));
  }

  render() {

    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
        <h2>My Transactions on moolya</h2>
          <div className="col-md-12 main_wrap_scroll nopadding">          
          <Scrollbars
                  speed={0.8}
                  className="main_wrap_scroll"
                  smoothScrolling={true}
                  default={true}
                >
          <MlTableViewContainer {...mlMyTransactionTableConfig}/>
          </Scrollbars>
          </div>
        </div>
      </div>
    )
  }
}
