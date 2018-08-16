import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {addDocumentTypeActionHandler} from '../actions/addDocumentTypeAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';

class MlAddDocumentType extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createDocumentType.bind(this)
    return this;
  }

  componentDidMount() {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }

  async addEventHandler() {
    const resp=await this.createDocumentType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/documentTypeList");
      else
        toastr.error(response.result);
    }
  };

  async  createDocumentType() {
    let DocTypeDetails = {
      docTypeName: this.refs.docTypeName.value,
      docTypeDisplayName: this.refs.displayName.value,
      about: this.refs.about.value,
      isActive: this.refs.documentTypeStatus.checked,
    }
    const response = await addDocumentTypeActionHandler(DocTypeDetails);
    return response;

  }

  // getSubDepartmentAvailability(details){
  //   console.log("details->"+details);
  //   this.setState({'subdepartmentAvailability':details})
  // }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'add',
        handler: async(event) => this.props.handler(this.createDocumentType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/documentTypeList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Document Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="docTypeName" placeholder="Name" className="form-control float-label" id=""/>
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
                  <div className="form-group">
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="documentTypeStatus" />
                      <div className="slider"></div>
                    </label>
                  </div>

                </form>

            </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
      </div>
    )
  }
};

export default MlAddDocumentType = formHandler()(MlAddDocumentType);
