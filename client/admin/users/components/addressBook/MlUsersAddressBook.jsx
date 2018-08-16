/**
 * Created by Rajat
 */

import React from "react";
import {Meteor} from "meteor/meteor";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";

import MlUserContactDetails from "./MlUserContactDetails";
import MlUserAddressDetails from "./MlUserAddressDetails";
import MlUserEmailDetails from "./MlUserEmailDetails";
import {findAddressBookActionHandler} from '../../actions/findUserAddressBookHandler'
import MlLoader from '../../../../commons/components/loader/loader'

export default class MlUsersAddressBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
    this.findAddressBook.bind(this);
    return this;
  }

  componentWillMount() {
    const resp=this.findAddressBook();
    return resp;
  }

  async findAddressBook(){
    const response = await findAddressBookActionHandler(this.props.config.registrationId);
    if(response){
      this.setState({data:response, loading:false});
    }else {
      this.setState({loading:false, data:null})
    }
  }

  componentDidUpdate() {
    var WinHeight = $(window).height();
    $('.admin_static_height').height(WinHeight-(88+$('.admin_header').outerHeight(true)));
  }

  render() {
    const showLoader=this.state.loading;
    let clusterId=this.state.data?this.state.data.clusterId:'';
    let contactInfo= this.state.data?this.state.data.contactInfo:''
    let emailInfo= this.state.data?this.state.data.emailInfo:''
    let addressInfo = this.state.data?this.state.data.addressInfo:''
    let registerId = this.state.data?this.state.data.registrationId:''
    let profileId = this.state.data?this.state.data.profileId:''
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (
          <div className="admin_padding_wrap">
            <h2>Address Book</h2>
            <div className="admin_static_height">
              <ScrollArea
                speed={0.8}
                className="admin_static_height"
                smoothScrolling={true}
                default={true}
              >
                <div className="row">
                  <div className="col-lg-6 ">
                    <form>
                      <div className="panel panel-default new_profile_tabs">
                        <div className="panel-heading">
                          Contact Number
                        </div>
                        <MlUserContactDetails clusterId={clusterId} contactInfoDetails={contactInfo}  registerId = {registerId} profileId={profileId} registrationDetails={this.findAddressBook.bind(this)}/>
                      </div>
                      <div className="panel panel-default new_profile_tabs">
                        <div className="panel-heading">
                          Email Id
                        </div>
                        <MlUserEmailDetails clusterId={clusterId} emailInfoDetails={emailInfo}  registerId = {registerId} profileId={profileId} registrationDetails={this.findAddressBook.bind(this)}/>
                      </div>
                    </form>
                  </div>
                  <div className="col-lg-6 ">
                    <form>
                      <div className="panel panel-default new_profile_tabs">
                        <div className="panel-heading">
                          Address
                        </div>
                        <MlUserAddressDetails clusterId={clusterId} addressInfoDetails={addressInfo} registerId = {registerId} profileId={profileId} registrationDetails={this.findAddressBook.bind(this)}/>
                      </div>
                    </form>
                  </div>

                </div>
              </ScrollArea>
            </div>
          </div>)}
      </div>
    )
  }
};
