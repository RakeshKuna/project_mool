import React, {Component} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
var FontAwesome = require('react-fontawesome');

export default class FunderOrderServicesView extends Component {
  componentDidMount() {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).parent().hasClass('nocolor-switch')) {

        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      } else {
        if ($(this).is(':checked')) {
          $(this).parent('.switch').addClass('on');
        } else {
          $(this).parent('.switch').removeClass('on');
        }
      }
    });

    $('.tab_wrap_scroll').height(WinHeight - ($('.app_header').outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".tab_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
    }
  }

  render() {
    return (
      <div>
        <h2>Ideator Details</h2>
        <ul className="users_list well well-sm">

          <li>
            <a href="">
              <span className="icon_bg"> <span className="icon_lg ml ml-moolya-symbol"></span></span><br />
              <div className="tooltiprefer">
                <span>Moolya-HYD</span>
              </div>
            </a>
          </li>
          <li>
            <a href="">
              <span className="icon_bg"> <span className="icon_lg ml ml-moolya-symbol"></span></span><br />
              <div className="tooltiprefer">
                <span>Moolya-BNG</span>
              </div>
            </a>
          </li>
          <li className="pull-right circle-time">
            <a href="">
              <span className="icon_bg">GMT<br />+03:00</span><br />
              <div className="tooltiprefer">
                <span>14/06/2017</span>
              </div>
            </a>
          </li>
        </ul>
        <div className="col-md-12 nopadding">
          <ul className="cal_tabs act_tab">
            <li className="col-md-4 nopadding-left">
              <span><img src="/images/mor_icon.png"/> Morning</span>
            </li>
            <li className="col-md-4 nopadding">
              <span className="act_tab"><img src="/images/aft_icon.png"/> Afternoon</span>
            </li>
            <li className="col-md-4 nopadding-right">
              <span><img src="/images/eve_icon.png"/> Evening</span>
            </li>
          </ul>
        </div>
        <br className="brclear" />
        <br />
        <div className="row funders_list">
          <div className="col-md-4 col-sm-4 col-lg-3">
            <a href="">
              <div className="funders_list_block">
                <h3>7:30 - 8:30</h3>
                <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                <div className="block_footer">
                  <span>Filling fast</span>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4 col-sm-4 col-lg-3">
            <a href="">
              <div className="funders_list_block">
                <h3>7:30 - 8:30</h3>
                <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                <div className="block_footer">
                  <span>Busy</span>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4 col-sm-4 col-lg-3">
            <a href="">
              <div className="funders_list_block">
                <h3>7:30 - 8:30</h3>
                <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                <div className="block_footer">
                  <span>Available</span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="col-md-6 nopadding-left">
          <div className="left_wrap">
            <ScrollArea
              speed={0.8}
              className="left_wrap"
              smoothScrolling={true}
              default={true}>
              <div className="form_bg">
                <form>
                  <div className="panel panel-default uploaded_files">
                    <div className="panel-heading">
                      Order Summary
                    </div>
                  </div>
                  <div className="col-md-4">
                    <FontAwesome name='calendar'/> &nbsp; 17/07/2017
                  </div>
                  <div className="col-md-5">
                    <FontAwesome name='clock-o'/> &nbsp; 10:00 - 10:30 am (GST)
                  </div>
                  <div className="col-md-3 nopadding-right">
                    <div className="ml_btn" style={{'textAlign': 'left'}}>
                      <a href="" className="save_btn"><FontAwesome name='pencil'/> &nbsp; Change</a>
                    </div>
                  </div>
                  <div className="clearfix"/>
                  <br />
                  <div className="panel panel-default uploaded_files">
                    <div className="panel-heading">
                      Introduction Task
                      <div className="pull-right block_action">
                        <div className="fileUpload upload_file_mask">
                          <a href="javascript:void(0);"><span className="ml ml-upload"></span>
                            <input type="file" className="upload_file upload" name="file_source"/></a>
                        </div>
                      </div>
                    </div>
                    <div className="panel-body uploaded_files_swiper">
                      <ul className="swiper-wrapper">
                        <li className="doc_card" data-toggle="tooltip" data-placement="bottom" title="File name"><img
                          src="/images/sub_default.jpg"/></li>
                      </ul>
                      <p className="show-information" style={{'display': 'none'}}>text</p>
                    </div>
                  </div>
                  <div className="panel panel-default uploaded_files">
                    <div className="panel-heading">
                      Company Registration Task
                      <div className="pull-right block_action">
                        <div className="fileUpload upload_file_mask">
                          <a href="javascript:void(0);"><span className="ml ml-upload"></span>
                            <input type="file" className="upload_file upload" name="file_source"/></a>
                        </div>
                      </div>
                    </div>
                    <div className="panel-body uploaded_files_swiper">
                      <ul className="swiper-wrapper">
                        <li className="doc_card" data-toggle="tooltip" data-placement="bottom" title="File name"><img
                          src="/images/sub_default.jpg"/></li>
                      </ul>
                      <p className="show-information" style={{'display': 'none'}}>text</p>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                    <tr>
                      <th>
                        Cost
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Actual Amount</td>
                      <td>: 5,000 INR</td>
                    </tr>
                    <tr>
                      <td>Offer Amount</td>
                      <td>: 500 INR</td>
                    </tr>
                    <tr>
                      <td>Tax</td>
                      <td>: 200 INR</td>
                    </tr>
                    <tr>
                      <td>Total Amount</td>
                      <td>: 5,700 INR</td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>
                        <div className="ml_btn" style={{'textAlign': 'left'}}>
                          <a href="" className="save_btn">Book</a>
                          <a href="" className="cancel_btn">Cancel</a>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="col-md-6 nopadding-right">
          <div className="left_wrap">
            <ScrollArea
              speed={0.8}
              className="left_wrap"
              smoothScrolling={true}
              default={true}>
              <div className="form_bg">
                <form>
                  <div className="panel panel-default uploaded_files">
                    <div className="panel-heading">
                      Payment Mode
                    </div>
                  </div>
                  <h1>
                    Payment Gateway Here
                  </h1>
                </form>
              </div>
            </ScrollArea>
          </div>
        </div>

      </div>
    )
  }
};
