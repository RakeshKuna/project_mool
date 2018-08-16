import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {updateKycCategoryActionHandler} from '../actions/updateKycCategoryAction'
import {findKycCategoryActionHandler} from '../actions/findKycCategoryAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader';
import {findCategoryProcessDocuments} from '../actions/findCategoryProcessDocuments'
class MlEditKycCategory extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{},kycCategoryActive : false};
    this.addEventHandler.bind(this);
    this.updateDocument.bind(this);
    this.findDocument.bind(this);
    this.fetchProcessDocuments.bind(this)
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
    let resp = this.fetchProcessDocuments()
    return resp;
  }
  componentDidUpdate() {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }
  componentWillMount() {
    const resp=this.findDocument();
    return resp;
  }

  async addEventHandler() {
    const resp=await this.updateDocument();
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
  async findDocument(){
    let documentTypeId=this.props.config;
    const response = await findKycCategoryActionHandler(documentTypeId);
    this.setState({loading:false,data:response});
  }

  async  updateDocument() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let Details = {
        _id: this.refs.id.value,
        docCategoryName: this.refs.name.value,
        docCategoryDisplayName: this.refs.displayName.value,
        about: this.refs.about.value,
        isActive: this.refs.status.checked,
      }
      const response = await updateKycCategoryActionHandler(Details);
      toastr.success("KYC category updated successfully");
      return response;
    }
  }
  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{

     let detailList  = this.state.kycCategoryActive
      if(detailList){
        this.setState({"data":{"isActive":true}});
        toastr.error("Process Document with this KYC Category is active");
      }else{
        this.setState({"data":{"isActive":false}});
      }

    }
  }


  async fetchProcessDocuments() {
    let id = FlowRouter.getParam('id');
    const response = await findCategoryProcessDocuments(id);
    if(response && response.length){
      this.setState({"kycCategoryActive" : true})
    }else{
      this.setState({"kycCategoryActive" : false})
    }

  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.updateDocument.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/kycCategoryList")
        }
      }
    ]
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(
        <div className="admin_padding_wrap">
          <h2>Edit KYC Category</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group mandatory">
                  <input type="text" ref="id" defaultValue={this.state.data&&this.state.data._id} hidden="true"/>
                  <input type="text" ref="name" placeholder="Name" defaultValue={this.state.data&&this.state.data.docCategoryName} className="form-control float-label" id=""data-required={true} data-errMsg="Name is required"/>
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
                  <div className="form-group mandatory">
                    <input type="text" ref="displayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.docCategoryDisplayName} className="form-control float-label" id=""data-required={true} data-errMsg="Display Name is required"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="status" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear"/>
                </form>

            </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

      </div>)}
    </div>
    )
  }
};

export default MlEditKycCategory = formHandler()(MlEditKycCategory);
