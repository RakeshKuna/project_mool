import React from "react";
import {render} from "react-dom";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper';
import formHandler from "../../../../commons/containers/MlFormHandler";
import {findUserTypeActionHandler} from "../actions/findUserTypeAction";
import {updateUserTypeActionHandler} from "../actions/updateUserTypeAction";
import {OnToggleSwitch, initalizeFloatLabel} from "../../../utils/formElemUtil";
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditUserType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.updateUserType.bind(this)
    this.findUserType.bind(this);
    this.onCommunitySelect.bind(this);
    return this;
  }
  componentDidMount(){
    setTimeout(function(){
      initalizeFloatLabel();
    },1000);
    if(this.state.data.isActive){
      $('#status').prop('checked', true);
    }
  }
  componentWillMount() {
    const resp=this.findUserType();
    return resp;
  }


  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  onCommunitySelect(val, callback, selObject) {
    if(val){
      this.setState({communityCode: val, communityName : selObject.label})
    }else {
      this.setState({communityCode: this.state.data.communityCode, communityName : this.state.data.communityName})
    }
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/UserTypeList");
      else
        toastr.error(response.result);
    }
  };

  async findUserType(){
    let userTypeId=this.props.config
    const response = await findUserTypeActionHandler(userTypeId);
    this.setState({loading:false,data:response});
    this.onCommunitySelect();
  }
  async updateUserType() {

    let UserTypeDetails = {
      id: this.refs.id.value,
      userTypeName: this.refs.userTypeName.value,
      displayName: this.refs.displayName.value,
      userTypeDesc: this.refs.userTypeDesc.value,
      communityCode: this.state.communityCode,
      communityName: this.state.communityName,
      isActive: this.refs.isActive.checked
    };
    const response = await updateUserTypeActionHandler(UserTypeDetails);
    return response;
  }

  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }

  render(){
    let query = gql` query{
      data:fetchCommunityDefinition{label:name,value:code}
    }
  `;
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateUserType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/userTypeList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

        <div className="admin_padding_wrap">
          <h2>Edit User Category</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                              labelKey={'label'} queryType={"graphql"} placeholder="Select Community"
                              selectedValue={this.state.communityCode}
                              query={query} isDynamic={true} onSelect={this.onCommunitySelect.bind(this)}/>

                <div className="form-group">
                  <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                  <input type="text" ref="userTypeName" placeholder="User Category Name" defaultValue={this.state.data&&this.state.data.userTypeName} className="form-control float-label"/>
                </div>
                <div className="form-group">
                  <textarea  ref="userTypeDesc" placeholder="About" defaultValue={this.state.data&&this.state.data.userTypeDesc}className="form-control float-label"></textarea>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="displayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.displayName} className="form-control float-label" id=""/>
                </div>
               <div className="form-group switch_wrap inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" ref="isActive" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                    <div className="slider"></div>
                  </label>
                </div>
              </form>
            </div>
          </div>

        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
        />

      </div>)}
      </div>

    )
  }
};

export default MlEditUserType = formHandler()(MlEditUserType);
