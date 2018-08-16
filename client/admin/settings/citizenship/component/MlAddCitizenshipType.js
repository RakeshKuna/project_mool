import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addCitizenshipActionHandler} from '../actions/addCitizenshipTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddCitizenship extends React.Component {
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createCitizenship.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp = await this.createCitizenship();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/registration/citizenshipList");
      else
        toastr.error(response.result);
    }
  };

  async  createCitizenship() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let CitizenshipDetails = {
        citizenshipTypeName: this.refs.citizenshipTypeName.value,
        citizenshipTypeDisplayName: this.refs.citizenshipTypeDisplayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }

      const response = await addCitizenshipActionHandler(CitizenshipDetails)
      if (!response.success) {
        toastr.error("Citizenship type already exists")
      } else if (response.success) {
        toastr.success("'Citizenship type' added successfully");
        FlowRouter.go("/admin/settings/registration/citizenshipList");
      }
    }
  }
  componentDidMount()  {
    OnToggleSwitch(false,true);
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
        handler: async(event) => this.props.handler(this.createCitizenship.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/registration/citizenshipList")
        }
      }
    ]

    // const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {/*{showLoader===true?( <div className="loader_wrap"></div>):(*/}

          <div className="admin_padding_wrap">
          <h2>Create Citizenship</h2>
          <div className="col-md-6 nopadding-left">
          <div className="form_bg">
          <form>
          <div className="form-group mandatory">
          <input type="text" ref="citizenshipTypeName" placeholder="Citizenship Name"
          className="form-control float-label" data-required={true} data-errMsg="Citizenship is required"/>
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
          <input type="text" ref="citizenshipTypeDisplayName" placeholder="Display Name"
          className="form-control float-label" data-required={true} data-errMsg="Display Name is required"/>
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

export default MlAddCitizenship = formHandler()(MlAddCitizenship);
