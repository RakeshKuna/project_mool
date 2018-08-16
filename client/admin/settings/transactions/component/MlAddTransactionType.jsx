import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addTransactionActionHandler} from '../actions/addTransactionTypeAction'
let FontAwesome = require('react-fontawesome');
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
class MlAddTransaction extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createTransaction.bind(this)
    return this;
  }
  componentDidMount() {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }

  async addEventHandler() {
    const resp=await this.createTransaction();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/transactionTypeList");
      else
        toastr.error(response.result);
    }
  };

  async  createTransaction() {
    let TransactionDetails = {
      transactionName: this.refs.transactionName.value,
      transactionDisplayName: this.refs.transactionDisplayName.value,
      transactionDescription: this.refs.transactionDescription.value,
      createdDateTime: new Date(),
      isActive: this.refs.isActive.checked
    }
    const response = await addTransactionActionHandler(TransactionDetails)
    return response;

  }
  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createTransaction.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/transactionTypeList")
        }
      }
    ]


    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Transaction type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
              <div className="form-group">
                  <input type="text" ref="transactionName" placeholder="Name" className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <textarea  ref="transactionDescription" placeholder="About" className="form-control float-label" id=""></textarea>
                </div>
                </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="transactionDisplayName" placeholder="Display Name" className="form-control float-label" id=""/>
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
export default MlAddTransaction = formHandler()(MlAddTransaction);
