import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {addKycCategoryActionHandler} from '../actions/addKycCtegoryAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddKycCategory extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createKycCategory.bind(this)
    return this;
  }

  componentDidMount() {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }

  async addEventHandler() {
    const resp=await this.createKycCategory();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/kycCategoryList");
      else
        toastr.error(response.result);
    }
  };

  async  createKycCategory() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let Details = {
        docCategoryName: this.refs.docCategoryName.value,
        docCategoryDisplayName: this.refs.displayName.value,
        about: this.refs.about.value,
        isActive: this.refs.documentTypeStatus.checked,
      }
      const response = await addKycCategoryActionHandler(Details);
      if (!response.success) {
        toastr.error("KYC category already exists")
      } else if(response.success) {
        toastr.success("'KYC category' added successfully");
        FlowRouter.go("/admin/settings/documentProcess/kycCategoryList");
      }
    }

    // getSubDepartmentAvailability(details){
    //   console.log("details->"+details);
    //   this.setState({'subdepartmentAvailability':details})
    // }
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
        handler: async(event) => this.props.handler(this.createKycCategory.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/kycCategoryList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create KYC Category</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group mandatory ">
                  <input type="text" ref="docCategoryName" placeholder="Name" className="form-control float-label" id="" data-required={true} data-errMsg=" Name is Required"/>
                </div>
                <div className="form-group">
                  <textarea ref="about" placeholder="About" className="form-control float-label" id=""></textarea>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">

                <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" id=""data-required={true} data-errMsg="  Display Name is Required"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="documentTypeStatus" />
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear"/>
                </form>

            </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
      </div>
    )
  }
};

export default MlAddKycCategory = formHandler()(MlAddKycCategory);
