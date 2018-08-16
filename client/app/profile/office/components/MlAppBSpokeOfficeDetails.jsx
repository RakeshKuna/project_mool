/**
 * Created by viswhadeep on 13/5/17.
 */
/**
 * import of libs and routes
 * */
import React, {Component} from "react";
// import {render} from "react-dom";
import gql from 'graphql-tag'
import {pick, extend} from 'lodash'
import omitDeep from 'omit-deep-lodash';
import {createOfficeActionHandler} from "../actions/createOfficeAction";
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation'
import {initalizeFloatLabel} from "../../../../../client/commons/utils/formElemUtil";
import Moolyaselect from '../../../commons/components/MlAppSelectWrapper'
import {findDefaultProfile} from '../../../commons/actions/fetchUserDetails'

export default class MlAppBSpokeOfficeDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branchType: "",
      selectedCountry: null
    }
    this.isSubmitDetails = false
    this.backUserRoute = this.backUserRoute.bind(this)
    this.submitDetails = this.submitDetails.bind(this)
    this.optionsBySelectOfficeType = this.optionsBySelectOfficeType.bind(this)
    this.optionsBySelectBranchAddress = this.optionsBySelectBranchAddress.bind(this)
  }

  /**
   * Initialize labels
   * */
  componentDidMount() {
    initalizeFloatLabel();
  }

  backUserRoute() {
    FlowRouter.go('/app/myOffice/')
  }

  componentDidUpdate() {
    initalizeFloatLabel();
  }

  componentWillMount() {
    const resp = this.findUserDetails();
    return resp
  }

  async findUserDetails() {
    var user = await findDefaultProfile();
    if (user) {
      this.setState({selectedCountry: user.countryId})
    }
  }

  optionsBySelectBranchAddress(index, cb, selectedItem) {
    this.setState({branchAddress: index})
    this.setDefaultValues(selectedItem)
  }

  setDefaultValues(selectedItem) {
    this.refs.officeLocation.value = selectedItem && selectedItem.addressLocality ? selectedItem.addressLocality : ""
    this.refs.streetLocality.value = selectedItem && selectedItem.addressLocality ? selectedItem.addressLocality : ""
    this.refs.landmark.value = selectedItem && selectedItem.addressLandmark ? selectedItem.addressLandmark : ""
    this.refs.area.value = selectedItem && selectedItem.addressArea ? selectedItem.addressArea : ""
    this.refs.city.value = selectedItem && selectedItem.addressCity ? selectedItem.addressCity : ""
    this.refs.state.value = selectedItem && selectedItem.addressState ? selectedItem.addressState : ""
    this.refs.zipCode.value = selectedItem && selectedItem.addressPinCode ? selectedItem.addressPinCode : ""
  }

  submitDetails() {
    var ret = mlFieldValidations(this.refs);
    if(ret){
      toastr.error(ret)
      return;
    }
    var officeData = omitDeep(this.props.officeData, '__typename')
    var preData = pick(officeData, ['totalCount', 'principalUserCount', 'teamUserCount', 'availableCommunities'])
    var extendObj = {
      isBeSpoke: true,
      officeName: this.refs.officeName.value,
      country: this.state.selectedCountry,
      about: this.refs.about.value,
    }
    var toInsert = extend(preData, extendObj)
    console.log(toInsert)
    this.createMyOfficeAction(toInsert)
  }

  async createMyOfficeAction(myOffice) {
    if (!this.isSubmitDetails) {
      this.isSubmitDetails = true
      const response = await createOfficeActionHandler(myOffice)
      if (response && response.success) {
        FlowRouter.go('/app/myOffice/')
        toastr.success(response.result);
      } else if (response && !response.success) {
        this.isSubmitDetails = false
        toastr.error(response.result);
      }
      return response;
    }
  }

  optionsBySelectOfficeType(val) {
    this.setState({branchType: val})
    if(index != 'BRANCH'){
      this.setDefaultValues()
    }
  }

  /**
   * UI to be render
   * */
  render() {
    let countryQuery = gql`query{
     data:fetchCountries {
        value:_id
        label:country
        code: countryCode
      }
    }`;
    let query = gql`query{
        data
        : getOfficeType{label:displayName, value:code}
      }`;
    let addressQuery = gql`query{
     data:findBranchAddressInfo{
        value:addressType
        label:name,
        phoneNumber      :  phoneNumber,
        addressFlat      :  addressFlat
        addressLocality  :  addressLocality
        addressLandmark  :  addressLandmark
        addressArea      :  addressArea
        addressCity      :  addressCity
        addressState     :  addressState
        addressCountry   : addressCountry
        addressPinCode   : addressPinCode
      }
    }`;

    var props = this.props.officeData ? this.props.officeData : {}
    var that = this
    return (
      <div className="col-lg-12">
        <div className="row">
          <div className="investement-view-content">
            <div className="col-md-6">
              <div className="form_bg">
                <form>
                  <div className="panel panel-default">
                    <div className="panel-heading"> Subscription: Basic Office</div>
                    <div className="panel-body">
                      <div className="col-lg-6 col-md-6 col-sm-12 nopadding-left">
                        <p>Total Users: {props.totalCount}</p>
                      </div>
                      <div className="clearfix"></div>
                      <div className="col-lg-6 col-md-6 col-sm-12 nopadding-left">
                        <p>Principal Users: {props.principalUserCount}</p>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 nopadding-right">
                        <p>Team Users: {props.teamUserCount}</p>
                      </div>

                    </div>
                  </div>

                  <div className="panel panel-default mart20">
                    <div className="panel-heading"> User Type</div>

                    <div className="panel-body">
                      {props.availableCommunities.map(function (item, say) {
                        return (
                          <div className="col-lg-4 col-md-4 col-sm-4" key={say}>
                            <div className="team-block marb0">
                              <span className="ml ml-moolya-symbol"></span>
                              <h3>
                                {item.communityName}
                              </h3>
                            </div>
                            <div className="form-group mart20">
                              <input type="text" placeholder="User Count" defaultValue={item.userCount}
                                     className="form-control float-label" disabled={true}/>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="form-group">
                    <textarea rows="4" placeholder="About" className="form-control float-label" ref="about"></textarea>

                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Office Name" className="form-control float-label" ref="officeName"
                           data-required={true} data-errMsg="Office Name is required"/>
                  </div>
                  <div className="form-group">
                    {/*<input type="text" placeholder="Office Type" className="form-control float-label"*/}
                    {/*defaultValue={props.branchType}/>*/}
                    <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                  labelKey={'label'} queryType={"graphql"} query={query} isDynamic={true}
                                  onSelect={that.optionsBySelectOfficeType} mandatory={true}
                                  selectedValue={that.state.branchType} data-required={true}
                                  data-errMsg="Office Type is required"/>
                  </div>
                  <div className="form-group">
                    <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                  placeholder="Branch Address"
                                  labelKey={'label'} queryType={"graphql"} query={addressQuery} isDynamic={true}
                                  disabled={this.state.branchType == 'BRANCH' ? false : true}
                                  onSelect={that.optionsBySelectBranchAddress}
                                  selectedValue={that.state.branchAddress}/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Office Location" className="form-control float-label" ref="officeLocation"
                           defaultValue={props.officeLocation} data-required={true}
                           data-errMsg="Office Location is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Street No/Locality" className="form-control float-label" ref={"streetLocality"}
                           defaultValue={props.streetLocality} data-required={true}
                           data-errMsg="Street No/Locality is required"/>
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Landmark" className="form-control float-label" ref={"landmark"}
                           defaultValue={props.landmark}/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Area" className="form-control float-label" ref={"area"}
                           defaultValue={props.area} data-required={true}
                           data-errMsg="Area is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Town/City" className="form-control float-label" ref={"city"}
                           defaultValue={props.city} data-required={true}
                           data-errMsg="Town/City is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="State" className="form-control float-label" ref={"state"}
                           defaultValue={props.state} data-required={true}
                           data-errMsg="State is required"/>
                  </div>
                  <div className="form-group">
                    {/*<input type="text" placeholder="Country" className="form-control float-label"*/}
                    {/*defaultValue={props.country}/>*/}
                    <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                  placeholder="Country"
                                  labelKey={'label'} queryType={"graphql"} query={countryQuery} isDynamic={true}
                                  disabled={true} data-required={true} mandatory={true}
                                  selectedValue={that.state.selectedCountry}
                                  data-errMsg="Country is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Zip Code" className="form-control float-label" ref={"zipCode"}
                           defaultValue={props.zipCode} data-required={true}
                           data-errMsg="Zip Code is required"/>
                  </div>
                  <div className="form-group">
                    {/*<a className="mlUpload_btn" href="/app/officeMembersDetails">Next</a>*/}
                    {/*<a href="" className="mlUpload_btn">Cancel</a>*/}
                    {!props.isBSpoke ? <a className="mlUpload_btn" onClick={this.submitDetails}>Activate Card</a> :
                      <div></div>}
                    <a className="mlUpload_btn" onClick={this.backUserRoute}>Cancel</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
