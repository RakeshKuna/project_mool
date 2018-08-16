import React from "react";
import {render} from "react-dom";
import {initalizeFloatLabel} from "../../../commons/utils/formElemUtil";
import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import {graphql} from "react-apollo";
import MlAppRegContactDetails from "./MlAppRegContactDetails";
import MlAppRegAddressDetails from "./MlAppRegAddressDetails";
import MlAccordion from "../../../app/commons/components/MlAccordion";
import MlAppActionComponent from "../../../app/commons/components/MlAppActionComponent";
import MlAppRegEmailDetails from "./MlAppRegEmailDetails";
import _ from 'underscore'
// import MlActionComponent from "../../../commons/components/actions/ActionComponent";
var FontAwesome = require('react-fontawesome');
export default class MlAppRegStep3 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
      contactNumber: [{numberType: '', countryCode: '', contactNumber: ''}, {
        numberType: 'Test',
        countryCode: '',
        contactNumber: ''
      }],
      registerId: this.props.registrationId,
      registrationDetails: this.props.registrationData,


    }

    return this;
  }

  componentWillMount() {

    this.setState({
      contactNumber: [{numberType: '', countryCode: '', contactNumber: ''}, {
        numberType: 'Test',
        countryCode: '',
        contactNumber: ''
      }]
    })
  }

  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(150+$('.app_header').outerHeight(true)));

    this.props.getRegistrationContactDetails();
    initalizeFloatLabel();


  }

  componentWillUnmount(){

    let registrationRecord = this.props.registrationData
    let addressDetails = registrationRecord&&registrationRecord.addressInfo?registrationRecord.addressInfo:[]
    /**
     * Check whether registration contains address array
     */
    if(addressDetails&&addressDetails.length<1){
      toastr.error("Default Address is mandatory")
    }else if(addressDetails&&addressDetails.length>0){
      /**
       * If registration contains address array
       * Check isDefault Address Exist or Not
       */
      var found = addressDetails.some(function (el) {
        return el.isDefaultAddress == true;
      });
      if (!found) {
        /**
         * If registration contains address array
         * If default address not found throw an error
         */

        toastr.error("Default Address is mandatory")

      }else if(found){
        /**
         * If registration contains address array
         * If default address exist
         * Check whether default address is active for single or multiple address
         */
        let addressData =  _.filter(addressDetails, {'isDefaultAddress': true});
        if(addressData&&addressData.length>1){
          toastr.error("Only one default address should exist")
        }
      }
    }
  }

  /* componentWillReceiveProps(nextProps){
   this.getRegistrationContactInfo();
   }*/
  async getRegistrationContactInfo() {

    const resp = this.props.getRegistrationContactDetails();
    this.setState({'registrationDetails': this.props.registrationData});
  }

  isUpdated(){
    let contactDetailsValidate = this.refs.contactDetailsComponent.isValidate()
    let emailDetailsValidate = this.refs.emailDetailsComponent.isValidate()
    let addressDetailsValidate = this.refs.addressDetailsComponent.isValidate()
    if(contactDetailsValidate&&emailDetailsValidate&&addressDetailsValidate){
      return true
    }else{
      return false
    }
  }

  exitRegistration(){
    FlowRouter.go('/app/dashboard')
  }

  render() {
    let MlActionConfig
    let userType = this.props.userType;

    let appActionConfig = [
      {
        showAction: true,
        actionName: 'cancel',
        handler: this.exitRegistration.bind(this)
      }
    ]

    export const genericPortfolioAccordionConfig = {
      id: 'registrationAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{
              resourceId: 'registrationId',
              resourceType: 'registration'
            }}
            actionOptions={appActionConfig}/>
        }]
    }
    {/**need to pass generic regId*/
    }

    return (
      <div className="step_form_wrap step3">
        <Scrollbars speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
        <div className="col-lg-6">


              <form>
                <div className="panel panel-default new_profile_tabs">
                  <div className="panel-heading">
                    Contact Number
                  </div>

                  <MlAppRegContactDetails ref={"contactDetailsComponent"} registerId={this.state.registerId}
                                          registrationInfo={this.state.registrationDetails}
                                          registrationDetails={this.props.getRegistrationContactDetails}
                                          clusterId={this.props.clusterId}/>
                </div>
                <div className="panel panel-default new_profile_tabs">
                  <div className="panel-heading">
                    Email Id
                  </div>
                  <MlAppRegEmailDetails ref={"emailDetailsComponent"} registerId={this.state.registerId}
                                        registrationInfo={this.state.registrationDetails}
                                        registrationDetails={this.props.getRegistrationContactDetails}
                                        clusterId={this.props.clusterId}/>
                </div>
              </form>


        </div>


        <div className="col-lg-6">


              <form>
                <div className="panel panel-default new_profile_tabs">
                  <div className="panel-heading">
                    Address
                  </div>
                  <MlAppRegAddressDetails ref={"addressDetailsComponent"} registerId={this.state.registerId}
                                          getRegistrationContactInfo={this.getRegistrationContactInfo.bind(this)}
                                          registrationInfo={this.state.registrationDetails}
                                          registrationDetails={this.props.getRegistrationContactDetails}
                                          clusterId={this.props.clusterId}/>
                </div>
              </form>



        </div>

        {/*<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>*/}
        </Scrollbars>
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
};
