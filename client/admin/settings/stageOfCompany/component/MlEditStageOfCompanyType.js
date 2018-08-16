import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findStageOfCompanyTypeActionHandler} from '../actions/findStageOfCompanyTypeAction'
import {updateStageOfCompanyTypeActionHandler} from '../actions/updateStageOfCompanyTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlEditStageOfCompanyType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateStageOfCompanyType.bind(this)
    this.findStageOfCompanyType.bind(this);
    return this;
  }

  componentWillMount() {

    const resp=this.findStageOfCompanyType();
    return resp;

  }
  componentDidMount(){
    /*if(this.state.data.isActive){
     $('#status').prop('checked', true);
     }*/
  }

  async addEventHandler() {
    // const resp=await this.findRequestType
    //  return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/registration/stageOfCompanyList");
      else
        toastr.error(response.result);
    }
  };

  async findStageOfCompanyType(){
    let StageOfCompanyTypeId=this.props.config
    const response = await findStageOfCompanyTypeActionHandler(StageOfCompanyTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateStageOfCompanyType() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let StageOfCompanyType = {
        id: this.refs.id.value,
        stageOfCompanyName: this.refs.stageOfCompanyName.value,
        stageOfCompanyDisplayName: this.refs.stageOfCompanyDisplayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }
      const response = await updateStageOfCompanyTypeActionHandler(StageOfCompanyType)
      toastr.success("'Stage Of Company' updated successfully");
      return response;

    }
  }
  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }
  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateStageOfCompanyType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/registration/stageOfCompanyList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Edit 'Stage Of Company Type'</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                    <input type="text" ref="stageOfCompanyName" placeholder="Name" defaultValue={this.state.data&&this.state.data.stageOfCompanyName} className="form-control float-label" id="" data-required={true} data-errMsg="Name is required"/>

                  </div>
                  <div className="form-group">
                    <textarea  ref="about" placeholder="About" defaultValue={this.state.data&&this.state.data.about} className="form-control float-label"></textarea>

                  </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="stageOfCompanyDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.stageOfCompanyDisplayName} className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="isActive" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                  </form>
                </div>
              </div>

            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
            />

          </div>)}
      </div>

    )
  }
};

export default MlEditStageOfCompanyType = formHandler()(MlEditStageOfCompanyType);
