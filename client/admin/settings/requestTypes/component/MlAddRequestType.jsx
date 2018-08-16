import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addRequestActionHandler} from '../actions/addRequestTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';


let FontAwesome = require('react-fontawesome');
class MlAddRequestType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {transactionId: ' ',
      transactionType: null
    }
    this.addEventHandler.bind(this);
    this.createRequestType.bind(this)
    this.optionBySelectTransactionType.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp=await this.createPermission();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/requestTypeList");
      else
        toastr.error(response.result);
    }
  };

  async  createRequestType() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let RequestTypeDetails = {
        requestName: this.refs.requestName.value,
        displayName: this.refs.displayName.value,
        requestDesc: this.refs.requestDesc.value,
        isActive: this.refs.isActive.checked,
        transactionType: this.state.transactionType,
        transactionId: this.state.transactionId
      };
      const response = await addRequestActionHandler(RequestTypeDetails);
      toastr.success("'Request type' added successfully")
      return response;
    }
  }
  componentDidMount()
  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }
  optionBySelectTransactionType(value, calback, selObject){
    this.setState({transactionType:value});
    this.setState({transactionId:selObject.label})
  }
  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createRequestType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/requestTypeList")
        }
      }
    ];
    let transactionType=gql`query  {
  data:fetchTransaction{
    value:transactionName
    label:_id
  }
}
 `;

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Request type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group mandatory">
                  <input type="text" ref="requestName" placeholder="Name" className="form-control float-label" id="" data-required={true} data-errMsg="Request name is required"/>
                </div>
                <div className="form-group">
                  <textarea  ref="requestDesc" placeholder="About" className="form-control float-label" id=""></textarea>
                </div>
              </form>
                </div>

          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group mandatory">
                  <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" id="" data-required={true} data-errMsg="DisplayName is required"/>
                </div>
                <div className="form-group">
                  <Moolyaselect ref="transactionType" mandatory={true} multiSelect={false} placeholder="Transaction Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.transactionType} queryType={"graphql"}  query={transactionType} onSelect={this.optionBySelectTransactionType.bind(this)} isDynamic={true} data-required={true} data-errMsg="Transaction type is required"/>
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
export default MlAddRequestType = formHandler()(MlAddRequestType);
