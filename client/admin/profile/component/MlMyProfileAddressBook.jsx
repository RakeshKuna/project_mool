
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import {initalizeFloatLabel} from '../../utils/formElemUtil';
import {getContactDetails} from '../actions/getAddressBookAction'

import ScrollArea from 'react-scrollbar'
import { Scrollbars } from 'react-custom-scrollbars';

import  ContactDetails from './MlMyProfileContactDetails';
import AddressDetails from './mlRegistrationAddressDetails'
import EmailDetails from './mlRegistrationEmailDetails';
import {getAdminUserContext} from '../../../commons/getAdminUserContext'
import MlLoader from '../../../commons/components/loader/loader'

export default class Step3 extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading : true,
      selectedValue : null,
      contactNumber:[{numberType: '',countryCode:'',contactNumber:''},{numberType: 'Test',countryCode:'',contactNumber:''}],
      registerId : " ",
      registrationDetails:" ",
      clusterId : " "
    }
    return this;
  }
    componentWillMount(){
      let res = getAdminUserContext();
      this.setState({clusterId:res.clusterId})

      const response = this.getContents();
      return response;
  }


  async getRegistrationContactDetails(details){
    const response=await getContactDetails();
    this.setState({'registrationDetails':response})
  }

  async getContents(){
      let response = await getContactDetails ();
      this.setState({loading:false,registrationDetails:response});
      //return response;
  }

  componentDidMount()
  { 
    initalizeFloatLabel();
  }
  
  componentDidUpdate(){
  var WinHeight = $(window).height();
  //$('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
  $('.left_wrap').height(WinHeight-(84+$('.admin_header').outerHeight(true)));
  //this.props.getRegistrationContactDetails();
}

  async getRegistrationContactInfo(){
    const resp = this.getContents();
    return resp;
  }

  addressUpdated(){
    this.setState({loading:true});
    this.getContents();
  }

  render(){
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (
          <div className="admin_padding_wrap">
            <h2>My Contact Details</h2>
            <div className="col-lg-6 col-md-6">
              <div className="form_bg left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                  {/*registrationDetails={this.getRegistrationContactDetails(this)}*/}
                  <form>
                    <div className="panel panel-default new_profile_tabs">
                      <div className="panel-heading">
                        Contact Numbers
                      </div>

                      <ContactDetails registerId={this.state.registerId}
                                      registrationInfo={this.state.registrationDetails}
                                      clusterId={this.state.clusterId}/>
                    </div>
                    <div className="panel panel-default new_profile_tabs">
                      <div className="panel-heading">
                        Email Id
                      </div>
                      <EmailDetails registerId={this.state.registerId} registrationInfo={this.state.registrationDetails}
                                    clusterId={this.state.clusterId}/>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form_bg left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                  <form>
                    <div className="panel panel-default new_profile_tabs">
                      <div className="panel-heading">
                        Addresses
                      </div>
                      <AddressDetails registerId={this.state.registerId}
                                      registrationInfo={this.state.registrationDetails} clusterId={this.state.clusterId}
                                      addressUpdated={this.addressUpdated.bind(this)}/>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
};
