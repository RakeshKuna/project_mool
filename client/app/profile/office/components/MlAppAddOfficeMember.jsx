/**
 * Created by pankaj on 7/6/17.
 */

import React from 'react';
import ScrollArea from 'react-scrollbar';
var Select = require('react-select');
import {Popover, PopoverContent, PopoverTitle} from "reactstrap";
import {createOfficeMembers} from '../actions/addOfficeMembers';
import {fetchOfficeMembers} from '../actions/findOfficeMembers';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath'
import { mlFieldValidations } from '../../../../commons/validations/mlfieldValidation';

function logChange(val) {
  console.log("Selected: " + val);
}


export default class MlAppAddOfficeMember extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      popoverOpen: false,
      members: [],
      selected: props.availableCommunities ? '' : 'principle',
      options : props.availableCommunities ? props.availableCommunities.map(function (item) {
        return { value: item.communityId, label: item.communityName }
      }) : [{ value: 'principle', label: 'Principle' }],
      userType: props.availableCommunities ? "isFreeUser" :  "isAdminUser"
    }
  }

  async getMembers(){
    let isPrinciple = this.props.availableCommunities ? false : true;
    let officeId = FlowRouter.getParam('officeId');
    let result = await fetchOfficeMembers(officeId, isPrinciple);
    this.setState({
      members:result
    });
  }
  componentWillMount(){
    this.getMembers();
  }
  componentDidMount() {
    $(function() {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });
  }
  togglePopover(evt){
    evt.preventDefault();
    this.setState({popoverOpen:!this.state.popoverOpen}, function(){
      $('.float-label').jvFloat();
    });
  }
  toggleUserType(evt){
    this.setState({
      userType:evt.currentTarget.value
    })
  }
  changeUserCommunityType(evt){
    if(evt.value !== 'principle'){
      this.setState({
        selected:evt.value
      })
    }
  }
  async addPrincipal(){
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
    let data = {
      isFreeUser:false,
      isPaidUser: false,
      isAdminUser: false,
      firstName: this.refs.fname.value,
      lastName: this.refs.lname.value,
      emailId: this.refs.email.value,
      mobileNumber: this.refs.phoneNumber.value,
      isPrincipal: (this.state.selected == 'principle' ? true : false),
      communityType: (this.state.selected == 'principle' ? '' : this.state.selected)
    };
    data[this.state.userType] = true;
    // if(this.refs.phoneNumber.value) {
    //   data['mobileNumber'] = this.refs.phoneNumber.value;
    // }

    // if(!data.firstName){
    //   toastr.error("First name is required");
    //   return
    // }
    // if(!data.lastName){
    //   toastr.error("Last name is required");
    //   return
    // }
    // if(!data.emailId){
    //   toastr.error("EmailId is required");
    //   return
    // }

    // if( !data.mobileNumber ){
    //   toastr.error("Mobile number is required");
    //   return
    // }

    // if( this.state.selected !== 'principle' && !data.communityType ){
    //   toastr.error("Community Type is required");
    //   return
    // }


    let id = FlowRouter.getParam('officeId');
    let response = await createOfficeMembers(id, data);
    if(response.success){
      toastr.success(response.result);
      this.setState({
        popoverOpen:false
      });
      this.getMembers();
    } else {
      toastr.error(response.result);
    }
   }
  }

  render(){
    const that = this;
    const props = this.props;
    const canView = props.role == 'Principal' || props.role == 'AdminUser' ? true : false;
    console.log('this.props:',props, that.state.members);
    return (
      <div>
        <div className="main_wrap_scroll">
          <ScrollArea
            speed={0.8}
            className="main_wrap_scroll"
            smoothScrolling={true}
            default={true}
          >
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-4" hidden={!props.isAdd} disabled={!props.isAdd} >
                  <a href="" id="create_client1" onClick={(evt)=>this.togglePopover(evt)} data-class="large_popover" >
                    <div className="list_block notrans">
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3>Add New Member</h3>
                    </div>
                  </a>
                </div>
                {that.state.members.map(function (data, i) {
                  return (
                    <div className="col-lg-2 col-md-4 col-sm-4" key={i}>
                      <a href={ canView ? '/app/officeMember/'+FlowRouter.getParam('officeId')+'/'+data._id : ''} >
                        <div className="list_block notrans">
                          {(data.isActive && !data.isFreeze && !data.isRetire)?
                            <div className="cluster_status active_cl"></div>
                            :
                            <div className="cluster_status inactive_cl"></div>}
                          <div className="hex_outer">
                            {
                              data.profileImage
                                ? <img src={generateAbsolutePath(data.profileImage)} />
                                : <span className="ml my-ml-Investors"></span>
                            }
                          </div>
                          <h3>{data.name}</h3>
                        </div>
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollArea>

          <Popover placement="right" isOpen={this.state.popoverOpen}
                   target={"create_client1"}>
            <PopoverTitle> Add New Member </PopoverTitle>
            <PopoverContent>
              <div className="ml_create_principle">
            <div className="medium-popover"><div className="row">
              <div className="col-md-12">
                <div className="form-group mandatory">
                  <input type="text" ref="fname" placeholder="First Name" className="form-control float-label" id="" data-required={true} data-errMsg="First Name is required"/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="lname" placeholder="Last Name" className="form-control float-label" id="" data-required={true} data-errMsg="Last Name is required"/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="email" placeholder="Email Id" className="form-control float-label" id="" data-required={true} data-errMsg="Email Id is required"/>

                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="phoneNumber" placeholder="Phone Number" className="form-control float-label" id="" data-required={true} data-errMsg="Phone Number is required"/>

                </div>
                <div className="form-group mandatory">
                  <Select
                    name="form-field-name"
                    options={that.state.options}
                    value={that.state.selected}
                    onChange={that.changeUserCommunityType.bind(that)} 
                    data-required={true} data-errMsg="Community Type is required"
                  />
                </div>
                <div className="form-group invitation">
                  <div className="input_types">
                    <input id="checkbox1" disabled={this.state.selected == "principle" ? true : false} defaultChecked={this.state.userType == "isFreeUser" ? true : false} onClick={(e)=>this.toggleUserType(e)} type="radio" name="radio" value="isFreeUser" />
                    <label htmlFor="checkbox1"><span></span>Free User</label>
                  </div>
                  <div className="input_types">
                    <input id="checkbox2" disabled={this.state.selected == "principle" ? true : false} onClick={(e)=>this.toggleUserType(e)} type="radio" name="radio" value="isPaidUser" />
                    <label htmlFor="checkbox2"><span></span>Paid User</label>
                  </div>
                  <div className="input_types">
                    <input id="checkbox3" onClick={(e)=>this.toggleUserType(e)} type="radio" name="radio" value="isAdminUser" />
                    <label htmlFor="checkbox3"><span></span>Admin User</label>
                  </div>
                  <br className="brclear"/>
                </div>
                <div className="ml_btn mart20" style={{'textAlign': 'center'}}>
                  <button onClick={()=>that.addPrincipal()} className="save_btn">Invite</button>
                </div>
              </div>
            </div></div>
          </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  }
};
