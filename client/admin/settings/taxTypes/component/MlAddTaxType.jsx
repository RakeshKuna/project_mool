import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addTaxActionHandler} from '../actions/addTaxTypeAction'
let FontAwesome = require('react-fontawesome');
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';

class MlAddTaxType extends React.Component{

  componentDidMount(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
}
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createTaxType.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp=await this.createTaxType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    FlowRouter.go("/admin/settings/taxTypeList");
  };

  async  createTaxType() {
    let TaxTypeDetails = {
      taxName: this.refs.taxName.value,
      taxDisplayName: this.refs.taxDisplayName.value,
      aboutTax: this.refs.aboutTax.value,
      isActive: this.refs.isActive.checked,
    }
    const response = await addTaxActionHandler(TaxTypeDetails)
    console.log(response);
    return response;
  }
  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createTaxType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/taxTypeList")
        }
        }
    ];

    return (

      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Tax Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
              <div className="form-group">
                <input type="text" ref="taxName" placeholder="Name" className="form-control float-label" id=""/>
              </div>
              <div className="form-group">
                <textarea  ref="aboutTax" placeholder="About" className="form-control float-label" id=""></textarea>
              </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
              <div className="form-group">
                <input type="text" ref="taxDisplayName" placeholder="Display Name" className="form-control float-label" id=""/>
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
export default MlAddTaxType = formHandler()(MlAddTaxType);
