import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findAssetActionHandler} from '../actions/findAssetsAction'
import {updateSelectedAssetActionHandler} from '../actions/updateAssetsAction'
import MlLoader from '../../../../commons/components/loader/loader'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlEditAssets extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.updateSelectedAsset.bind(this)
    this.findAssets.bind(this);
    this.onStatusChange.bind(this);
    return this;
  }

  componentWillMount() {
    const resp=this.findAssets();
    return resp;
  }
  componentDidMount(){
  }
  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  async handleError(response) {
    alert(response)
  };

  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }

  async handleSuccess(response) {
      if (response){
          if(response.success)
              FlowRouter.go("/admin/settings/assetsList");
          else
              toastr.error(response.result);
      }
  }

  async findAssets(){
      let assetId = this.props.config
      const response = await findAssetActionHandler(assetId);
      this.setState({loading:false,data:response});
  }

  async  updateSelectedAsset() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let assetDetails = {
        assetName: this.refs.name.value,
        displayName: this.refs.displayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }

      const response = await updateSelectedAssetActionHandler(this.props.config, assetDetails)
      toastr.success("Asset updated successfully")
      return response;
    }
  }

  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateSelectedAsset.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },

      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/lookingForList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

          <div className="admin_padding_wrap">
            <h2>Update Asset</h2>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                    <input type="text" ref="name" placeholder="Name" className="form-control float-label" defaultValue={this.state.data.assetName} data-required={true} data-errMsg="Asset Name is required"/>
                  </div>
                  <div className="form-group">
                    <textarea ref="about" placeholder="About" className="form-control float-label" id="" defaultValue={this.state.data.about}></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" defaultValue={this.state.data.displayName} data-required={true} data-errMsg="Display Name is required"/>
                  </div>

                  <div className="form-group">
                    <div className="fileUpload mlUpload_btn">
                      <span>Profile Pic</span>
                      <input type="file" className="upload" ref="assetIcon"/>
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="isActive" checked={this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
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

export default MlEditAssets = formHandler()(MlEditAssets);
