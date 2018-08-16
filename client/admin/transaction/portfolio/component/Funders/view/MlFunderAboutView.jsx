import React from 'react';
import ScrollArea from 'react-scrollbar';
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');
import { initalizeLockTitle, initalizeFloatLabel } from '../../../../../utils/formElemUtil';
import {fetchfunderPortfolioAbout} from '../../../actions/findPortfolioFunderDetails'
import MlLoader from '../../../../../../commons/components/loader/loader'
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import { fetchCurrencyTypeActionHandler } from '../../../../../../commons/actions/mlCurrencySymbolHandler'


const genderValues = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'others', label: 'Others'}
];
export default class MlFunderAboutView extends React.Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
    }
    this.fetchPortfolioDetails.bind(this);
    return this;
  }

  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    this.getCurrencyType()
    return resp;
  }

  /**
   * inializing float label
   * */
  componentDidUpdate(){
    const className = this.props.isAdmin ? "admin_header" : "app_header";
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    // $('.main_wrap_scroll').height(WinHeight-($('.admin_header').outerHeight(true)+120));
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});}

    initalizeFloatLabel();
  }
 
  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.funderPortfolio && that.context.funderPortfolio.funderAbout)
    if(empty){
      const response = await fetchfunderPortfolioAbout(portfoliodetailsId);
      if (response) {
        this.setState({loading: false, data: response});
      }

      _.each(response.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
      initalizeLockTitle();
    }else{
      this.setState({loading: false, data: that.context.funderPortfolio.funderAbout});
    }

  }
  optionsBySelectGender(val) {
    var dataDetails = this.state.data
    dataDetails['gender'] = val.value
    this.setState({data: dataDetails}, function () {
      this.sendDataToParent();
    })
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, this.props.portfolioDetailsId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  render(){
    const showLoader = this.state.loading;
    let investmentFrom = this.state.data&&this.state.data.investmentFrom?this.state.data.investmentFrom:"";
    let personal = null, familyFund= null;
    let genderImage = this.state.data && this.state.data.gender==='female'?"/images/female.jpg":"/images/def_profile.png";
    if(investmentFrom == "PERSONAL"){
      personal = true;
      familyFund = false;
    }else if(investmentFrom == "FAMILY FUND"){
      familyFund = true;
      personal = false;
    }
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div>
            <h2>About Us</h2>
            <div className="main_wrap_scroll hide_unlock">
                <div className="col-md-6 nopadding-left">
                      <div className="form_bg">
                        <form>

                          <div className="form-group">
                            <input type="text" placeholder="First Name" name="firstName" defaultValue={this.state.data.firstName} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            {/* <FontAwesome name='unlock' className="input_icon un_lock" id="isFirstNamePrivate"/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isFirstNamePrivate}/> */}
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Last Name" name="lastName" defaultValue={this.state.data.lastName} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            {/* <FontAwesome name='unlock' className="input_icon un_lock" id="isLastNamePrivate"/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isLastNamePrivate}/> */}
                          </div>

                          {/*<div className="form-group">*/}
                            {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label" id="cluster_name" disabled='disabled'/>*/}
                            {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate"/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>*/}
                          {/*</div>*/}
                          <div className="form-group">
                            <Select name="form-field-name"  placeholder="Select Gender" value={this.state.data.gender}  options={genderValues} onChange={this.optionsBySelectGender.bind(this)} disabled={true} className="float-label" />
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate"/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="User Category" name="category" defaultValue={this.state.data.category} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isCategoryPrivate"/>
                          </div>

                          <div className="form-group">
                            {/*<input type="text" placeholder="Education" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label" id="cluster_name" disabled='disabled'/>*/}
                            {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate" /><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isQualificationPrivate}/>*/}
                            <input type="text" placeholder="Qualification" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate" />
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Employment Status" name="employmentStatus" defaultValue={this.state.data.employmentStatus} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isEmploymentStatusPrivate" />
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Professional Tag" name="professionalTag" defaultValue={this.state.data.professionalTag} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isProfessionalTagPrivate"/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Years of Experience" name="yearsOfExperience" defaultValue={this.state.data.yearsOfExperience} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isYearsOfExperiencePrivate" />
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Industry" name="industry" defaultValue={this.state.data.industry} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isIndustryPrivate" />
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Profession" name="profession" defaultValue={this.state.data.profession} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isProfessionPrivate" />
                          </div>
                        </form>
                      </div>
                </div>
                <div className="col-md-6 nopadding-right">
                      <div className="form_bg">
                        <form>

                          <div className="form-group">
                            {/*<div className="fileUpload mlUpload_btn">*/}
                            {/*<span>Profile Pic</span>*/}
                            {/*<input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  />*/}
                            {/*</div>*/}
                            <div className="previewImg ProfileImg">
                              <img src={this.state.data.profilePic? generateAbsolutePath(this.state.data.profilePic) : genderImage}/>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                          <div className="panel panel-default mart20">
                            <div className="panel-heading"> Investment Budget Per Year (in {this.state.currencySymbol}):</div>

                            <div className="panel-body">
                              <div className="form-group col-md-6 nomargin-bottom nopadding-left">
                                <input type="text" placeholder="From" name="from" defaultValue={this.state.data.investmentBudget && this.state.data.investmentBudget.from?this.state.data.investmentBudget.from:""} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isFromPrivate" />
                              </div>
                              <div className="form-group col-md-6 nomargin-bottom nopadding-right">
                                <input type="text" placeholder="To" name="to" defaultValue={this.state.data.investmentBudget && this.state.data.investmentBudget.to?this.state.data.investmentBudget.to:""} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isToPrivate" />
                              </div>
                            </div>
                          </div>


                          <div className="clearfix"></div>
                          <div className="panel panel-default">
                            <div className="panel-heading"> Source of Investment:</div>

                            <div className="panel-body">
                              <div className="input_types">
                                <input id="radio1" type="radio" name="radio" value="1" defaultChecked={personal} disabled='disabled'/><label
                                htmlFor="radio1"><span><span></span></span>Personal</label>
                              </div>
                              <div className="input_types">
                                <input id="radio2" type="radio" name="radio" value="2" defaultChecked={familyFund} disabled='disabled'/><label
                                htmlFor="radio2"><span><span></span></span>Family Fund</label>
                              </div>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                          <div className="form-group">
                            <input type="text" placeholder="Number of Investments" name="investmentCount" defaultValue={this.state.data.investmentCount} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isInvestmentCountPrivate" /><input type="checkbox" className="lock_input" checked={this.state.data.isInvestmentCountPrivate}/>
                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="Phone No" name="mobileNumber" defaultValue={this.state.data.mobileNumber} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isMobileNumberPrivate" /><input type="checkbox" className="lock_input" checked={this.state.data.isMobileNumberPrivate}/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Email Id" name="emailId" defaultValue={this.state.data.emailId} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isEmailIdPrivate" /><input type="checkbox" className="lock_input" checked={this.state.data.isEmailIdPrivate}/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Facebook Id" name="facebookUrl" defaultValue={this.state.data.facebookUrl} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isFacebookUrlPrivate" /><input type="checkbox" className="lock_input" checked={this.state.data.isFacebookUrlPrivate}/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="LinkedIn URL" name="linkedInUrl" defaultValue={this.state.data.linkedInUrl} className="form-control float-label" id="cluster_name" disabled='disabled'/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isLinkedInUrlPrivate" /><input type="checkbox" className="lock_input" checked={this.state.data.isLinkedInUrlPrivate}/>
                          </div>

                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Twitter Id" className="form-control float-label"*/}
                          {/*id="cluster_name"/>*/}
                          {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label" id="cluster_name" onBlur={this.handleBlur.bind(this)}/>*/}
                          {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>*/}
                          {/*</div>*/}

                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Googleplus Id" className="form-control float-label"*/}
                          {/*id="cluster_name"/>*/}
                          {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label" id="cluster_name" onBlur={this.handleBlur.bind(this)}/>*/}
                          {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>*/}
                          {/*</div>*/}
                        </form>
                      </div>
                </div>
              <br className="brclear"/>
            </div>
          </div>
        )}
      </div>
    )
  }
};
