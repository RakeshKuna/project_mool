import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
/*import MlIdeatorPortfolioAbout from './MlIdeatorPortfolioAbout'*/
import {findIdeatorDetailsActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import { initalizeLockTitle, initalizeFloatLabel } from '../../../../utils/formElemUtil';
import MlLoader from '../../../../../commons/components/loader/loader';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';


var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import 'react-responsive-tabs/styles.css'
const genderValues = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'others', label: 'Others'}
];

export default class MlPortfolioIdeatorBasicDetailsView extends React.Component{
  constructor(props,context){
    super(props);
    this.state={
      loading: true,
      data:{}
    }
    this.fetchPortfolioDetails.bind(this);
  }

  componentDidUpdate()
  {
    initalizeFloatLabel();
    // OnLockSwitch();
    // dataVisibilityHandler();
    var className = this.props.isAdmin?"admin_header":"app_header"

    var WinWidth = $(window).width();
    var WinHeight = $(window).height();

    // $('.main_wrap_scroll').height(WinHeight-($('.admin_header').outerHeight(true)+120));
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  }

  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await findIdeatorDetailsActionHandler(portfoliodetailsId);
    if (response) {
      this.setState({loading: false, data: response});
    }

    _.each(response.privateFields, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
    initalizeLockTitle();
  }

  render(){
    const showLoader = this.state.loading;
    let genderImage = this.state.data && this.state.data.gender==='female'?"/images/female.jpg":"/images/ideator_01.png";
    return (
      <div>
        {showLoader === true ? ( <MlLoader />) : (
            <div>
              <h2>Ideator</h2>
        <div className="main_wrap_scroll hide_unlock">
              <div className="col-md-6 nopadding-left">

                    <div className="form_bg">
                      <form>

                        <div className="form-group">
                          <input type="text" placeholder="First Name" name="firstName" defaultValue={this.state.data.firstName} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="isfirstNamePrivate"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Last Name" name="lastName" defaultValue={this.state.data.lastName} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="islastNamePrivate"/>
                        </div>

                        {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label"  disabled="disabled"/>*/}
                          {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate"/>*/}
                        {/*</div>*/}

                        <div className="form-group">
                          <Select name="form-field-name" placeholder="Select Gender" value={this.state.data.gender}  options={genderValues} disabled className="float-label" />
                          <FontAwesome name='unlock' className="input_icon " id="isGenderPrivate"/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>
                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Qualification" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate"/>
                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Employment Status" name="employmentStatus" defaultValue={this.state.data.employmentStatus} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="isEmploymentStatusPrivate"/>
                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Professional Tag" name="professionalTag" defaultValue={this.state.data.professionalTag} className="form-control float-label" disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="isProfessionalTagPrivate"/>
                        </div>


                        <div className="form-group">
                          <input type="text" placeholder="Years of Experience" name="yearsofExperience" defaultValue={this.state.data.yearsofExperience} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="isYoePrivate"/>
                        </div>
                      </form>

                </div>
              </div>
              <div className="col-md-6 nopadding-right">

                    <div className="form_bg">
                      <form>

                        <div className="form-group steps_pic_upload">
                          <div className="previewImg ProfileImg">
                            <img src={this.state.data.profilePic?generateAbsolutePath(this.state.data.profilePic):genderImage}/>
                          </div>
                        </div>
                        <br className="brclear"/>

                        <div className="form-group">
                          <input type="text" placeholder="Industry" ref="industry" defaultValue={this.state.data.industry} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon " id="isIndustryPrivate"/>
                        </div>


                        <div className="form-group">
                          <input type="text" placeholder="Profession" ref="profession" defaultValue={this.state.data.profession} className="form-control float-label" disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isProfessionPrivate"/>
                        </div>


                        <div className="form-group">
                          <input type="text" placeholder="Employer Name" ref="employerName" defaultValue={this.state.data.employerName} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isEmployerNamePrivate"/>
                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Phone No" name="mobileNumber" defaultValue={this.state.data.mobileNumber} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isMobileNumberPrivate"/>
                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Email Id" name="emailId" defaultValue={this.state.data.emailId} className="form-control float-label"  disabled="disabled"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isEmailIdPrivate"/>
                        </div>

                      </form>

                </div>
              </div>
        </div>

          </div>)}
      </div>
    )
  }
};
