import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addEmployeeTypeActionHandler} from '../actions/addEmployeeTypeAction.js';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';


let FontAwesome = require('react-fontawesome');
class MlAddEmployeeType extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createEmpType.bind(this)
    return this;
  }


  async addEventHandler() {
    const resp=await this.createEmpType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/employeeTypesList");
  };


  componentDidMount(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  async  createEmpType() {
    let EmpTypeDetails = {
      employmentName: this.refs.employmentName.value,
      employmentDisplayName: this.refs.employmentDisplayName.value,
      aboutEmployment: this.refs.aboutEmployment.value,
      isActive: this.refs.isActive.checked
    }

    const response = await addEmployeeTypeActionHandler(EmpTypeDetails)
    return response;

  }
  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createEmpType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/employeeTypesList")
        }
      }
    ]


    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Employee Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
              <div className="form-group">
                <input type="text" ref="employmentName" placeholder="Name" className="form-control float-label" id=""/>
              </div>
              <div className="form-group">
                <textarea  ref="aboutEmployment" placeholder="About" className="form-control float-label" id=""></textarea>
              </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
              <div className="form-group">
                <input type="text" ref="employmentDisplayName" placeholder="Display Name" className="form-control float-label" id=""/>
              </div>


              <div className="form-group switch_wrap inline_switch">
                <label>Status</label>
                <label className="switch">
                  <input type="checkbox" ref="isActive"/>
                  <div className="slider"></div>
                </label>
              </div>
              </form>
            </div>
          </div>

        </div>
        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
        />

      </div>
    )
  }
};
export default MlAddEmployeeType = formHandler()(MlAddEmployeeType);
