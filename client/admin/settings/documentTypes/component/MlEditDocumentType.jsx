import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {updateDocumentTypeActionHandler} from '../actions/updateDocumentTypeAction'
import {findDocumentTypeActionHandler} from '../actions/findDocumentTypeAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditDocumentType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateDocumentType.bind(this);
    this.findDocumentType.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }
  componentWillMount() {
    const resp=this.findDocumentType();
    return resp;
  }
  componentDidUpdate(){
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  async addEventHandler() {
    const resp=await this.updateDocumentType();
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

  async findDocumentType(){
    let documentTypeId=this.props.config
    const response = await findDocumentTypeActionHandler(documentTypeId);
    this.setState({loading:false,data:response});
  }

  async  updateDocumentType() {
    let DocTypeDetails = {
      id: this.refs.id.value,
      docTypeName: this.refs.docTypeName.value,
      docTypeDisplayName: this.refs.displayName.value,
      about: this.refs.about.value,
      isActive: this.refs.documentTypeStatus.checked,
    }
    const response = await updateDocumentTypeActionHandler(DocTypeDetails);
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
        handler: async(event) => this.props.handler(this.updateDocumentType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/documentTypeList")
        }
      }
    ]
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

        <div className="admin_padding_wrap">
          <h2>Edit Document Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="id" defaultValue={this.state.data&&this.state.data._id} hidden="true"/>
                  <input type="text" ref="docTypeName" placeholder="Name" defaultValue={this.state.data&&this.state.data.docTypeName} readOnly="true" className="form-control float-label"  disabled="disabled"/>
                </div>
                <div className="form-group">
                  <textarea ref="about" placeholder="About" defaultValue={this.state.data&&this.state.data.about} className="form-control float-label" id=""></textarea>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">

                <form>
                  <div className="form-group">
                    <input type="text" ref="displayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.docTypeDisplayName} readOnly="true" className="form-control float-label"  disabled="disabled"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="documentTypeStatus" defaultChecked={this.state.data&&this.state.data.isActive} />
                      <div className="slider"></div>
                    </label>
                  </div>

                </form>

            </div>
          </div>

          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

      </div>)}
      </div>
    )
  }
};

export default MlEditDocumentType = formHandler()(MlEditDocumentType);
