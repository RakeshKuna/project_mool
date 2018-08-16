import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addBusinessTypeActionHandler} from '../actions/addBusinessTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddBusinessType extends React.Component {
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createBusinessType.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp = await this.createBusinessType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response) {
      if (response.success)
        FlowRouter.go("/admin/settings/registration/businessList");
      else
        toastr.error(response.result);
    }
  };

  async  createBusinessType() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let BusinessTypeDetails = {
        businessTypeName: this.refs.businessTypeName.value,
        businessTypeDisplayName: this.refs.businessTypeDisplayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }

      const response = await addBusinessTypeActionHandler(BusinessTypeDetails)
      if (!response.success) {
        toastr.error("'Business type' already exists")
      } else if (response.success) {
        toastr.success("'Business type' created successfully");
        FlowRouter.go("/admin/settings/registration/businessList");
      }
    }
  }

  componentDidMount() {
    OnToggleSwitch(false, true);
    initalizeFloatLabel();
  }

  render() {
    let MlActionConfig = [
      // {
      //   actionName: 'edit',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createBusinessType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
         // this.props.handler(" ");
          FlowRouter.go("/admin/settings/businessList")
        }
      }
    ]

    // const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {/*{showLoader===true?( <div className="loader_wrap"></div>):(*/}
          <div className="admin_padding_wrap">
          <h2>Create Business Type</h2>
          <div className="col-md-6 nopadding-left">
          <div className="form_bg">
          <form>
          <div className="form-group mandatory">
          <input type="text" ref="businessTypeName" placeholder="Business Name" className="form-control float-label" data-required={true} data-errMsg="Business Name is required"/>
          </div>
          <div className="form-group">
          <textarea ref="about" placeholder="About" className="form-control float-label"></textarea>
          </div>
          </form>
          </div>
          </div>
          <div className="col-md-6 nopadding-right">
          <div className="form_bg">
          <form>
          <div className="form-group mandatory">
          <input type="text" ref="businessTypeDisplayName" placeholder="Display Name"  className="form-control float-label" data-required={true} data-errMsg="Display Name is required"/>
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

          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
          />
          </div>
        {/*)}*/}
      </div>
    )
  }
}
;

export default MlAddBusinessType = formHandler()(MlAddBusinessType);
