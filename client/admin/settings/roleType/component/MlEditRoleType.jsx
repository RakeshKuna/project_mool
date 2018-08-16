import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findRoleTypeActionHandler} from '../actions/findRoleTypeAction'
import {updateRoleTypeActionHandler} from '../actions/updateRoleTypeAction';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditRoleType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateRoleType.bind(this)
    this.findRoleType.bind(this);
    return this;
  }

  componentWillMount() {

  }

  componentDidUpdate() {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }


  componentDidMount(){
    const resp=this.findRoleType();
    if(this.state.data.isActive){
      $('#status').prop('checked', true);
    }
  }

  async addEventHandler() {
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/roleTypeList");
      else
        toastr.error(response.result);
    }
  };

  async findRoleType(){
    let roleTypeId=this.props.config;
    const response = await findRoleTypeActionHandler(roleTypeId);
    this.setState({loading:false,data:response});
  }
  async updateRoleType() {
    let RoleTypeDetails = {
      id: this.refs.id.value,
      roleTypeDisplayName: this.refs.roleTypeDisplayName.value,
      roleTypeDescription: this.refs.roleTypeDescription.value,
      isActive: this.refs.isActive.checked
    }
    const response = await updateRoleTypeActionHandler(RoleTypeDetails)
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
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateRoleType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      // {
      //   showAction: true,
      //   actionName: 'add',
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/roleTypeList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Edit Role Type</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                    <input type="text" placeholder="Role Type Name" defaultValue={this.state.data&&this.state.data.roleTypeName} className="form-control float-label"  disabled="disabled"/>

                  </div>
                  <div className="form-group">
                    <textarea  ref="roleTypeDescription" placeholder="About" defaultValue={this.state.data&&this.state.data.roleTypeDescription}className="form-control float-label" id=""></textarea>

                  </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="roleTypeDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.roleTypeDisplayName} className="form-control float-label"  disabled="disabled"/>
                  </div>
                  <div className="form-group switch_wrap">
                    <label>Status</label><br/>
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

export default MlEditRoleType = formHandler()(MlEditRoleType);
