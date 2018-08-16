import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findEmployeeTypeActionHandler} from '../actions/findEmployeeTypeAction'
import {updateEmployeeTypeActionHandler} from '../actions/updateEmployeeTypeAction';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditEmployeeType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateEmployeeType.bind(this)
    this.findEmployeeType.bind(this);
    return this;
  }

  componentWillMount() {

    const resp=this.findEmployeeType();
    return resp;

  }

  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }
  componentDidMount(){
    /*if(this.state.data.isActive){
     $('#status').prop('checked', true);
     }*/
  }

  async addEventHandler() {
    // const resp=await this.findRequestType
    //  return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    FlowRouter.go("/admin/settings/employeeTypesList");
  };

  async findEmployeeType(){
    let EmpTypeId=this.props.config
    const response = await findEmployeeTypeActionHandler(EmpTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateEmployeeType() {
    let EmpType = {
      id: this.props.config,
      employmentName: this.refs.employmentName.value,
      employmentDisplayName: this.refs.employmentDisplayName.value,
      aboutEmployment: this.refs.aboutEmployment.value,
      isActive: this.refs.isActive.checked
    }
    const response = await updateEmployeeTypeActionHandler(EmpType)
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
        handler: async(event) => this.props.handler(this.updateEmployeeType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/employeeTypesList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
            <div className="admin_main_wrap">
              <div className="admin_padding_wrap">
                <h2>Edit Employee Type</h2>
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                    <div className="form-group">
                      <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                      <input type="text" ref="employmentName" placeholder="Name" defaultValue={this.state.data&&this.state.data.employmentName} className="form-control float-label" id=""/>

                    </div>
                    <div className="form-group">
                      <textarea  ref="aboutEmployment" placeholder="About" defaultValue={this.state.data&&this.state.data.aboutEmployment}className="form-control float-label" id=""></textarea>

                    </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-rightd">
                  <div className="form_bg">
                    <form>
                    <div className="form-group">
                      <input type="text" ref="employmentDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.employmentDisplayName} className="form-control float-label" id=""/>
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
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
              />

            </div>)}
      </div>

    )
  }
};

export default MlEditEmployeeType = formHandler()(MlEditEmployeeType);
