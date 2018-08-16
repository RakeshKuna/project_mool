import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findSpecificationActionHandler} from '../actions/findSpecificationsTypeAction'
import {updateSpecificationTypeActionHandler} from '../actions/updateSpecificationsTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
class MlEditSpecificationType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateSpecificationType.bind(this)
    this.findSpecificationType.bind(this);
    return this;
  }

  componentWillMount() {
    const resp=this.findSpecificationType();
    return resp;
  }
  componentDidMount(){
    /*if(this.state.data.isActive){
     $('#status').prop('checked', true);
     }*/
  }
  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
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
        FlowRouter.go("/admin/settings/documentProcess/specificationList");
      else
        toastr.error(response.result);
    }
  };
  async findSpecificationType(){
    let SpecificationTypeId=this.props.config
    const response = await findSpecificationActionHandler(SpecificationTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateSpecificationType() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let SpecificationType = {
        id: this.refs.id.value,
        specificationName: this.refs.specificationName.value,
        specificationDisplayName: this.refs.specificationDisplayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }
      const response = await updateSpecificationTypeActionHandler(SpecificationType)
      toastr.success("'Specification type' updated successfully");
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

  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateSpecificationType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/specificationList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Edit Specification Type</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                    <input type="text" ref="specificationName" placeholder="Name" defaultValue={this.state.data&&this.state.data.specificationName} className="form-control float-label" id="" data-required={true} data-errMsg="Name is required"/>

                  </div>
                  <div className="form-group">
                    <textarea  ref="about" placeholder="About" defaultValue={this.state.data&&this.state.data.about}className="form-control float-label" id=""></textarea>
                  </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="specificationDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.specificationDisplayName} className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
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

export default MlEditSpecificationType = formHandler()(MlEditSpecificationType);
