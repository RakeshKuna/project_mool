/**
 * Created by vishwadeep on 11/9/17.
 */

import React, { Component } from 'react';
import ScrollArea from "react-scrollbar";
import gql from 'graphql-tag'
import MlLoader from '../../../../../commons/components/loader/loader'
import { initalizeFloatLabel, initalizeLockTitle } from '../../../../../commons/utils/formElemUtil';
import Moolyaselect from '../../../../commons/components/MlAdminSelectWrapper'
import {fetchPortfolioActionHandler} from '../../actions/findClusterIdForPortfolio';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';

var FontAwesome = require('react-fontawesome');

export default class MlGenericManagementView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCurDetail: {},
      clusterId:'',
      loading:true
    }
    this.handleChange = this.handleChange.bind(this);
    this.showDetails.bind(this)
    return this
  }

  componentWillMount(){
    const resp = this.fetchClusterId();
    return resp
  }

  componentDidUpdate(){
    initalizeFloatLabel();
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    var className = this.props.isAdmin ? "admin_header" : "app_header";
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

  async fetchClusterId() {
    const response = await fetchPortfolioActionHandler(this.props.portfolioDetailsId);
    if (response) {
      this.setState({loading: false, clusterId: response.clusterId});
    }
  }

  viewDetails(id, e) {
    let data = this.props.data;
    var getData = data[id]
    $('.investement-view-content .funding-investers').slideUp();
    $('#funding_show').slideDown()
    this.setState({viewCurDetail: getData})

    setTimeout(function () {
      $(".input_icon").removeClass('un_lock fa-lock').addClass('fa-unlock')
      _.each(getData.privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
      initalizeLockTitle();
    }, 10)
  }

  handleChange() {
    //this handler prevents the waring in the console
  }

  render() {
    var _this = this
    let titleQuery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
      label
      value
     }
     }
     `;
    let titleOption={options: { variables: {type : "TITLE",hierarchyRefId:this.state.clusterId}}};
    const showLoader = _this.state.loading;
    var arrayList = _this.props.data ? _this.props.data : []
    const gImg = _this.state.viewCurDetail.gender==='female'?'/images/female.jpg':'/images/ideator_01.png';
    const genderImage = _this.state.viewCurDetail && _this.state.viewCurDetail.logo && _this.state.viewCurDetail.logo.fileUrl ? generateAbsolutePath(_this.state.viewCurDetail.logo.fileUrl) : gImg;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div>
            {/*{_.isEmpty(arrayList) ? (*/}
              {/*<div className="portfolio-main-wrap">*/}
                {/*<NoData tabName={this.props.tabName}/>*/}
              {/*</div>) : (*/}
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
                                <img src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/>
                                <div>
                                  <p>{details.firstName}</p>
                                  <h3>{details.designation}</h3>
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
                              <img
                                src={details && details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}
                                className="team_img"/>
                              <h3>
                                {details.firstName} <br /><b>{details.designation}</b>
                              </h3>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/*centered data*/}
                  <div className="main_wrap_scroll">

                      <div className="col-lg-12" id="psContent">
                        <div className="row">
                          <div className="investement-view-content">
                            <div className="funding-investers" id="funding_show">
                              <div className="col-md-6 nopadding-left">
                                <div className="form_bg">
                                  <form>
                                    <Moolyaselect multiSelect={false} placeholder="Title"
                                                  className="float-label" valueKey={'value'}
                                                  labelKey={'label'}
                                                  selectedValue={this.state.viewCurDetail.title} queryType={"graphql"}
                                                  query={titleQuery} queryOptions={titleOption}
                                                  isDynamic={true} isDisabled={true}/>
                                    <FontAwesome name='unlock' className="input_icon mselect_icon"/>
                                    <div className="form-group">
                                      <input type="text" placeholder="First name"
                                             value={this.state.viewCurDetail.firstName ? this.state.viewCurDetail.firstName : ''}
                                             className="form-control float-label" onChange={_this.handleChange}/>
                                      <FontAwesome name='unlock' className="input_icon" id="isFirstNamePrivate"/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Middle name"
                                             value={this.state.viewCurDetail.middleName ? this.state.viewCurDetail.middleName : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id="isMiddleNamePrivate"/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Last Name"
                                             value={this.state.viewCurDetail.lastName ? this.state.viewCurDetail.lastName : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id="isLastNamePrivate"/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Gender"
                                             value={this.state.viewCurDetail.gender ? this.state.viewCurDetail.gender : ""}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isGenderPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Designation"
                                             value={this.state.viewCurDetail.designation ? this.state.viewCurDetail.designation : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isDesignationPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Years of Experience"
                                             value={this.state.viewCurDetail.yearsOfExperience ? this.state.viewCurDetail.yearsOfExperience : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isYOFPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Joining Date to this company"
                                             value={this.state.viewCurDetail.joiningDate ? this.state.viewCurDetail.joiningDate : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isJoiningDatePrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Joining date of first job"
                                             value={this.state.viewCurDetail.firstJobJoiningDate ? this.state.viewCurDetail.firstJobJoiningDate : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isFJJDPrivate"}/>
                                    </div>
                                  </form>
                                </div>
                              </div>
                              <div className="col-md-6 nopadding-right">
                                <div className="form_bg">
                                  <form>
                                    <div className="form-group">
                                      <div className="previewImg ProfileImg">
                                        <img src={genderImage}/>
                                      </div>
                                    </div>
                                    <br className="brclear"/>

                                    <div className="form-group">
                                      <input type="text" placeholder="Qualification"
                                             value={this.state.viewCurDetail.qualification ? this.state.viewCurDetail.qualification : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isQualificationPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Certification"
                                             value={this.state.viewCurDetail.certification ? this.state.viewCurDetail.certification : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isCertificationPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="University"
                                             value={this.state.viewCurDetail.universities ? this.state.viewCurDetail.universities : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isUniversitiesPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="Awards" className="form-control float-label"
                                             value={this.state.viewCurDetail.awards ? this.state.viewCurDetail.awards : ''}
                                             onChange={_this.handleChange}/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isAwardsPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="LinkedIn"
                                             value={this.state.viewCurDetail.linkedInUrl ? this.state.viewCurDetail.linkedInUrl : ''}
                                             onChange={_this.handleChange}
                                             className="form-control float-label"/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isLinkedInUrlPrivate"}/>
                                    </div>

                                    <div className="form-group">
                                      <input type="text" placeholder="About" className="form-control float-label"
                                             value={this.state.viewCurDetail.managmentAbout ? this.state.viewCurDetail.managmentAbout : ''}
                                             onChange={_this.handleChange}/>
                                      <FontAwesome name='unlock' className="input_icon" id={"isAboutPrivate"}/>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                            <div className="clearfix"></div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            {/*)}*/}
          </div>
        )
        }
      </div>
    )
  }
}
