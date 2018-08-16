import React, {Component, PropTypes} from "react";
import _ from 'lodash';
import {logout} from "../../../../client/admin/layouts/header/actions/logoutAction";
import {fetchUserDetailsHandler} from "../../commons/actions/fetchUserDetails";
import BugReportWrapper from '../../commons/components/MlAppBugReportWrapper';
import { createContainer } from 'meteor/react-meteor-data';
import VerticalBreadCrum from "../../breadcrum/component/VerticalBreadCrum";
import DynamicBreadcrum from "../../breadcrum/component/DynamicBreadcrum";
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import MlAppNotificationsConfig from '../../commons/components/notifications/MlAppNotificationsConfig'
import {deleteToken} from "./MlFireBaseClientSetup"

var FontAwesome = require('react-fontawesome');

const build_versionToken = localStorage.getItem('build_version');

class MlAppProfileHeader extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={profilePic:"", profileProgress:0 }
    this.regStatus = false;
    this.state = {loading: false,data: {}, notifications:[], isAllowRegisterAs:true}

    return this;
  }

  componentDidMount() {
      var WinHeight = $(window).height();
      var WinWidth = $(window).width();
      $('.app_main_wrap ').height(WinHeight - $('.app_header').outerHeight(true));


      $('.ml_app_profile h1').click(function () {
          $(this).parent('.ml_app_profile').toggleClass('profile_open');
        $('.overlay').toggle();
      });


    $('.overlay').click(function(){
      $('.ml_app_profile').removeClass('profile_open');
      $(this).hide();
    });
    $('.ml_app_profile ol a').click(function(){
      $('.ml_app_profile ol a').removeClass('active');
      $(this).addClass('active');
    });

    $('body').tooltip({
      selector: '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])',
      trigger: 'hover',
      container: 'body'
    }).on('click mousedown mouseup', '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])', function () {
      $('[data-toggle="tooltip"], [title]:not([data-toggle="popover"])').tooltip('destroy');
    });

  }

  /**fetching user details from registration*/
  componentWillMount(){
    let user = Meteor.user();
    let gImg = user && user.profile && user.profile.genderType==='female'?"/images/female.jpg":"/images/def_profile.png";
    if( user && user.profile && user.profile.profileImage) {
      this.setState({
        profilePic:user.profile.profileImage == " "?gImg:generateAbsolutePath(user.profile.profileImage)
      });
    }
    else {
      this.setState({profilePic:gImg});
    }
    const resp = this.fetchUserDetails();
    return resp
  }

  /**this is having issues*/
  async fetchUserDetails() {
    let profileProgress = 0;
    let response = await fetchUserDetailsHandler()
    let profileStatus = response.status;
    if (response){
      if(response && response.registrationInfo && response.registrationInfo.registrationType == 'OFB'){
        this.setState({
          isAllowRegisterAs:false
        });
      }
      console.log(response.status, response.portfolioStatus);
      if(response && response.status) {
        let portfolioStatus = response.portfolioStatus;
        if(portfolioStatus === "PORT_LIVE_NOW" || portfolioStatus === "REG_PORT_APR" || portfolioStatus === "PORT_REVIEW_INPRO" || portfolioStatus === "PORT_GO_LIVE_PEND" || portfolioStatus === "REG_PORT_PEND") profileProgress = 100;
        else profileProgress = ((profileStatus ===  "REG_EMAIL_P") || (profileStatus === "REG_EMAIL_V") || (profileStatus === "REG_SOFT_APR") || (profileStatus === "REG_ADM_REJ") )? 25 : ((profileStatus === "REG_SOFT_APR") || (profileStatus === "REG_KYC_U_KOFF") || (profileStatus === "REG_KYC_U_PEND") || (profileStatus === "REG_KYC_A_APR") || (profileStatus === "REG_KYC_U_KOFF" )  || (profileStatus === "REG_USER_REJ") || (profileStatus === "REG_USER_APR") ) ? 50 : 0;
      }
      this.setState({data: response, loading:false, isCalendar: response.isCalendar, profileProgress: profileProgress })
    }
  }

  /**user logout function*/
  /**
  * @todo {*} uncomment the code onces the issue is been resolved of slowness
  */
  logoutUser() {
    // deleteToken(function(){
      logout();
    // });
  }

  componentWillReceiveProps(user){
    let gImg = user && user.user && user.user.profile && user.user.profile.genderType==='female'?"/images/female.jpg":"/images/def_profile.png";
    if( user && user.user && user.user.profile &&  user.user.profile.profileImage) {
      this.setState({
        profilePic:user.user.profile.profileImage == " "?gImg:generateAbsolutePath(user.user.profile.profileImage)
      });
    }
    else {
      this.setState({profilePic:gImg});
    }
  }

  /**
   * redirect to registration page
   * */
  registrationRedirect() {
    if (this.state.data && !this.state.data.isAllowRegisterAs)
      FlowRouter.go("/app/register/");
  }


  breadcrumbClicked(){
    this.props.breadcrumbClicked();
  }

  render() {
    const {data} = this.state
    let isDisabled = (!this.state.data || (this.state.data && this.state.data.isAllowRegisterAs))?true:false;
    let path = Object.assign(FlowRouter._current.path);
    let breadcrumType= path.includes('dashboard');

    return (
      <div>
        <BugReportWrapper />

        <div className="overlay"></div>
        <div className="filter_overlay"></div>
        <span className="version">Ver.&beta;eta {build_versionToken}</span>
        {breadcrumType ?
          <DynamicBreadcrum/>
          :
          <VerticalBreadCrum breadcrumbClicked={this.breadcrumbClicked.bind(this)} />
        }


        {/*{showLoader===true?(<MlLoader/>):(*/}

        <div className="app_header">
          <a href="/app/dashboard" className="pull-left"><FontAwesome name='home'/></a>
          <a href="/app/dashboard"> <img className="moolya_app_logo" src="/images/logo.png"/></a>


          <MlAppNotificationsConfig />


          <div className="ml_app_profile" role="navigation">
          <div className="progress-circle" data-progress={this.state.profileProgress}></div>
            <h1 id="NavLbl"  data-toggle="tooltip" title={`Welcome ${data && data.firstName?data.firstName:"User"}`} data-placement="left" style={{'backgroundImage':`url(${this.state.profilePic})`, 'backgroundPosition': 'center center'}}>{/*<span className="profile_context ml ml-ideator"></span>*/}</h1>
          <ol>
              <li data-toggle="tooltip" title="My Profile" data-placement="right">
                <a href="/app/myprofile" className={activeProfileArcClass('myprofile')}>
                  <span className="ml my-ml-blank_Profile_3"></span>
                </a>
              </li>
                <li data-toggle={isDisabled?"":"tooltip"} title={isDisabled?"Pending Registration":"Registration"} data-placement="right">
                  <a href="" className={isDisabled?"disable":activeProfileArcClass('register')} onClick={this.registrationRedirect.bind(this)}><span className="ml my-ml-pending_registrations">
                  </span></a>
                </li>
              <li data-toggle="tooltip" title="Switch Profile" data-placement="right">
                <a href="/app/appSwitchProfile"  className={activeProfileArcClass('appSwitchProfile')}>
                  <span className="ml my-ml-switch_profile"></span>
                </a>
              </li>
              <li data-toggle="tooltip" title="Register As" data-placement="right">
                <a href={this.state.isAllowRegisterAs?"/app/myProfile/registerAs":""} className={activeProfileArcClass('registerAs')}><span className="ml my-ml-register_as"></span></a>
              </li>
              {/*<li data-toggle="tooltip" title="Themes" data-placement="top">*/}
              {/*<a href=""><span className="ml my-ml-themes_10-01"></span></a>*/}
              {/*</li>*/}
              <li data-toggle={!this.state.isCalendar ?"":"tooltip"} title={!this.state.isCalendar ?"Pending Registration":"Calendar"} data-placement="top">
                <a href={ !this.state.isCalendar ? "" : "/app/calendar"} className={!this.state.isCalendar ?"disable": activeProfileArcClass('calendar')}><span className="ml my-ml-calendar"></span></a>
              </li>
              <li data-toggle="tooltip" title="My Tasks" data-placement="top">
                <a href="/app/task?tab=My Tasks" className={activeProfileArcClass('task')}><img className="profile-img" src="/images/7.png" /></a>
              </li>
              <li data-toggle="tooltip" title="Logout" data-placement="top">
                <a onClick={this.logoutUser.bind(this)}><span className="ml my-ml-exit_or_logoff"></span></a>
              </li>
            </ol>
          </div>
          <div className="clearfix"></div>
          <span className="pull-right context_name">
          {data && data.headerCommunityDisplay?data.headerCommunityDisplay:''}
          </span>
        </div>
          {/*)}*/}
      </div>
    )
  }
}

export default MlAppHeader = createContainer(props => {
  return {
    user: Meteor.user(),
    breadcrumbClicked : props.breadcrumbClicked
  };
}, MlAppProfileHeader);

/**
 * This method returns the className if the option is active
 * @param type(String: type of profile option.myProfile/registerAs,calendar,myTask)
 * returns result of className as active or null
 */
var activeProfileArcClass=function(type,params){
  var currentPath = Object.assign(FlowRouter._current.path);
  var path = (currentPath.split('?')[0]).split('/');
  path=_.compact(path);//remove empty strings
  _.pull(path, 'app');//pull 'app' route
  var className='';
  var profileLinkMapObject={'portfolio':'myprofile','myprofile':'myprofile','addressBook':'myprofile','myConnections':'myprofile','myOffice':'myprofile','addOffice':'myprofile','editOffice':'myprofile','library':'myprofile','myAppointment':'myprofile','termsConditions':'myprofile','privacy':'myprofile','previewProfile':'myprofile',
                            'register':'register',
                            'appSwitchProfile':'appSwitchProfile',
                            'registerAs':'registerAs',
                            'calendar':'calendar','shareCalendar':'calendar','officeCalendar':'calendar','notification':'calendar','manageSchedule':'calendar','settings':'calendar',
                            'task':'task'};
   _.every(path,function(i){
     var profilePath=profileLinkMapObject[i];
     if(profilePath===type){className='active'; return false;};
     return true;
    });
  return className;
}

