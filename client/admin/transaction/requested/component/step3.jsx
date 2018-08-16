import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
import { Scrollbars } from 'react-custom-scrollbars';
import ScrollArea from 'react-scrollbar'
import  Select from 'react-select';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import  ContactDetails from './contactDetails';
import AddressDetails from '../component/mlRegistrationAddressDetails'
import EmailDetails from '../component/mlRegistrationEmailDetails'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
export default class Step3 extends React.Component{

  constructor(props){
    super(props);
    this.state={
      selectedValue : null,
      contactNumber:[{numberType: '',countryCode:'',contactNumber:''},{numberType: 'Test',countryCode:'',contactNumber:''}],
      registerId : this.props.registrationId,
      registrationDetails:this.props.registrationData,
    }

    return this;
  }
  componentWillMount(){

    this.setState({contactNumber:[{numberType: '',countryCode:'',contactNumber:''},{numberType: 'Test',countryCode:'',contactNumber:''}]})
  }
  componentDidMount()
  {
    var WinHeight = $(window).height();
    //$('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
    $('.left_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
    this.props.getRegistrationContactDetails();
    initalizeFloatLabel();
  }
 /* componentWillReceiveProps(nextProps){
    this.getRegistrationContactInfo();
  }*/
  async getRegistrationContactInfo(){

    const resp=this.props.getRegistrationContactDetails();
    this.setState({'registrationDetails':this.props.registrationData});
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

  render(){
    let MlActionConfig
    let userType=this.props.userType;
    if(userType=='external'){
      MlActionConfig=[
        {
          showAction: true,
          actionName: 'save',
          handler: null
        },
        {
          showAction: true,
          actionName: 'cancel',
          handler: null
        },
      ]
    }
    return (
      <div className="step_form_wrap step3">

          <div className="col-lg-6 col-md-6 nopadding-left">
            <div className="form_bg left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
                <form>
                  <div className="panel panel-default new_profile_tabs">
                    <div className="panel-heading">
                      Contact Number
                    </div>

                    <ContactDetails ref={'contactDetailsComponent'} registerId={this.state.registerId} registrationInfo={this.state.registrationDetails} registrationDetails={this.props.getRegistrationContactDetails} clusterId={this.props.clusterId}/>
                  </div>
                  <div className="panel panel-default new_profile_tabs">
                    <div className="panel-heading">
                      Email Id
                    </div>
                    <EmailDetails ref={'emailDetailsComponent'} registerId={this.state.registerId} registrationInfo={this.state.registrationDetails} registrationDetails={this.props.getRegistrationContactDetails} clusterId={this.props.clusterId}/>
                  </div>
                </form>
              </Scrollbars>
            </div>
          </div>


          <div className="col-lg-6 col-md-6 nopadding-right">
            <div className="form_bg left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
              <form>
                <div className="panel panel-default new_profile_tabs">
                  <div className="panel-heading">
                    Address
                  </div>
                  <AddressDetails ref={'addressDetailsComponent'} registerId={this.state.registerId} getRegistrationContactInfo={this.getRegistrationContactInfo.bind(this)} registrationInfo={this.state.registrationDetails} registrationDetails={this.props.getRegistrationContactDetails} clusterId={this.props.clusterId}/>
                </div>
              </form>
              </Scrollbars>

            </div>

          </div>

        {this.props.userType=="external"&&(<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>)}

      </div>
    )
  }
};
