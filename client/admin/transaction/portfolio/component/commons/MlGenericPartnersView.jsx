/**
 * Created by vishwadeep on 11/9/17.
 */

import React, { Component } from 'react';
import ScrollArea from "react-scrollbar";
import MlLoader from '../../../../../commons/components/loader/loader'
import {initalizeFloatLabel} from '../../../../../commons/utils/formElemUtil';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';

var FontAwesome = require('react-fontawesome');

export default class MlGenericPartnersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCurDetail: {},
      clusterId:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.showDetails.bind(this)
    return this
  }

  // componentWillMount(){
  //   const resp = this.fetchClusterId();
  //   return resp
  // }

  componentDidUpdate(){
    initalizeFloatLabel();
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    var className = this.props.isAdmin ? "admin_header" : "app_header"
    $('.tab_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+220));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+220));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});}
  }

  showDetails(id) {
    $("#details-div").show();
    var $frame = $('#forcecentered');
    var $wrap = $frame.parent();

    // Call Sly on frame
    $frame.sly({
      horizontal: 1,
      itemNav: 'forceCentered',
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      startAt: id ? id : 0,
      scrollBar: $wrap.find('.scrollbar'),
      scrollBy: 1,
      speed: 300,
      elasticBounds: 1,
      easing: 'easeOutExpo',
      dragHandle: 1,
      dynamicHandle: 1,
      clickBar: 1,

    });
    $("#show").hide();
    this.viewDetails(id)
  }


  viewDetails(id, e) {
    let data = this.props.partnersList;
    var getData = data[id]
    this.setState({viewCurDetail: getData});
    $('.investement-view-content .funding-investers').slideUp();
    $('#funding_show').slideDown()
    $(".input_icon").removeClass('un_lock fa-lock').addClass('fa-unlock');
    _.each(getData.privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  handleChange() {
    //this handler prevents the waring in the console
  }

  render() {
    const _this = this
    console.log('selected : ', _this.state.viewCurDetail);
    const showLoader = _this.state.loading;
    var arrayList = _this.props.partnersList ? _this.props.partnersList : []
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="col-md-12">
            <div className="requested_input" id="show">
              <ScrollArea
                speed={0.8}
                className="main_wrap_scroll"
                smoothScrolling={true}
                default={true}
              >
                <div className="col-lg-12 nopadding">
                  <div className="row">
                    {arrayList && arrayList.map(function (details, idx) {
                      return (
                        <div className="col-lg-2 col-md-4 col-sm-4" onClick={_this.showDetails.bind(_this, idx)}
                             key={idx}>
                          <div className="list_block notrans funding_list">
                            <div>
                              <img src={details.logo ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/>
                              <h3>{details.firstName?details.firstName:""}</h3>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="sub_wrap_scroll hide_unlock" id="details-div" style={{'display': 'none'}}>

              <div className="top_block_scroller" id="forcecentered">
                <ul>
                  {arrayList && arrayList.map(function (details, idx) {
                    return (
                      <li key={idx} onClick={_this.viewDetails.bind(_this, idx)}>
                        <div className="team-block" name="funding_01">
                          <img src={details.logo ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"} className="team_img"/>
                          <h3>
                            {details.firstName?details.firstName:""} <br />
                          </h3>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="main_wrap_scroll">
                <ScrollArea speed={0.8} className="main_wrap_scroll"smoothScrolling={true} default={true} >
                  <div className="col-lg-12" id="psContent">
                    <div className="row">
                      <div className="investement-view-content">
                        <div className="funding-investers" id="funding_show">
                          <div className="col-md-6 nopadding-left">
                            <div className="form_bg">
                              <form>
                                {/*<div className="form-group">*/}
                                  {/*<Moolyaselect multiSelect={false} placeholder="Title"*/}
                                                {/*className="form-control float-label" valueKey={'value'}*/}
                                                {/*labelKey={'label'}*/}
                                                {/*selectedValue={this.state.viewCurDetail.title} queryType={"graphql"}*/}
                                                {/*query={titleQuery} queryOptions={titleOption}*/}
                                                {/*onSelect={function () {}} isDynamic={true} isDisabled={true}/>*/}
                                  {/*<FontAwesome name='unlock' className="input_icon"/>*/}
                                {/*</div>*/}

                                <div className="form-group">
                                  <input type="text" placeholder="First name"
                                         value={this.state.viewCurDetail.firstName ? this.state.viewCurDetail.firstName : ''}
                                         className="form-control float-label" onChange={_this.handleChange}/>
                                  <FontAwesome name='unlock' className="input_icon" id="isFirstNamePrivate"/>
                                </div>

                                <div className="form-group">
                                  <input type="text" placeholder="Last Name"
                                         value={this.state.viewCurDetail.lastName ? this.state.viewCurDetail.lastName : ''}
                                         onChange={_this.handleChange}
                                         className="form-control float-label"/>
                                  <FontAwesome name='unlock' className="input_icon" id="isLastNamePrivate"/>
                                </div>

                                <div className="form-group">
                                  <input type="text" placeholder="Designation"
                                         value={this.state.viewCurDetail.designation ? this.state.viewCurDetail.designation : ""}
                                         onChange={_this.handleChange}
                                         className="form-control float-label"/>
                                  <FontAwesome name='unlock' className="input_icon" id="designation"/>
                                </div>

                                <div className="form-group">
                                  <input type="text" placeholder="Company Name"
                                         value={this.state.viewCurDetail.partnerCompanyName ?this.state.viewCurDetail.partnerCompanyName : ''}
                                         onChange={_this.handleChange}
                                         className="form-control float-label"/>
                                  <FontAwesome name='unlock' className="input_icon" id="isCompanyNamePrivate" />
                                </div>
                              </form>
                            </div>
                          </div>
                          <div className="col-md-6 nopadding-right">
                            <div className="form_bg">
                              <form>

                                <div className="form-group">
                                  <input type="text" placeholder="Years of Experience"
                                         value={this.state.viewCurDetail.yearsOfExperience ? this.state.viewCurDetail.yearsOfExperience : ''}
                                         onChange={_this.handleChange}
                                         className="form-control float-label"/>
                                  <FontAwesome name='unlock' className="input_icon" id="isYearsOfExperiencePrivate"/>
                                </div>

                                <div className="form-group">
                                  <input type="text" placeholder="Qualification"
                                         value={this.state.viewCurDetail.qualification ? this.state.viewCurDetail.qualification : ''}
                                         onChange={_this.handleChange}
                                         className="form-control float-label"/>
                                  <FontAwesome name='unlock' className="input_icon" id="isQualificationPrivate"/>
                                </div>

                                <div className="form-group">
                                  <input type="text" placeholder="About" className="form-control float-label"
                                         value={this.state.viewCurDetail.aboutPartner ? this.state.viewCurDetail.aboutPartner : ''}
                                         onChange={_this.handleChange}/>
                                  <FontAwesome name='unlock' className="input_icon" id="isAboutPartnerPrivate" />
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
/*
This generic file is being used by company and institutions
 */
