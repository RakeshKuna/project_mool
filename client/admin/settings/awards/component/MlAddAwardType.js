import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addAwardActionHandler} from '../actions/addAwardTypeAction'
let FontAwesome = require('react-fontawesome');
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddAward extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createAward.bind(this)
    return this;
  }
  componentDidMount(){
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }
  async addEventHandler() {
    const resp=await this.createAward();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/awardList");
      else
        toastr.error(response.result);
    }
  };

  async  createAward() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let AwardDetails = {
        awardName: this.refs.awardName.value,
        awardDisplayName: this.refs.awardDisplayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }
      const response = await addAwardActionHandler(AwardDetails)
      toastr.success("New 'Award type' added successfully");
      return response;
    }
  }
  render(){
    let MlActionConfig = [
      // {
      //   actionName: 'edit',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createAward.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/awardList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Award</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
              <div className="form-group  mandatory">
                <input type="text" ref="awardName" placeholder="Award Name" className="form-control float-label"data-required={true} data-errMsg="Name is required"/>
              </div>
              <div className="form-group ">
                <textarea ref="about" placeholder="About" className="form-control float-label"></textarea>
              </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
              <div className="form-group  mandatory">
                <input type="text" ref="awardDisplayName" placeholder="Display Name" className="form-control float-label"data-required={true} data-errMsg="Display Name is required"/>
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
export default MlAddAward = formHandler()(MlAddAward);
