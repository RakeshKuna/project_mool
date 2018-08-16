import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {updateSocialListsTypeActionHandler} from '../actions/updateSocialLinksTypeAction'
import {findSocialLinksTypeActionHandler} from '../actions/findSocialLinksTypeAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'


class MlEditSocialLinkType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateSocialLinks.bind(this);
    this.findSocialLinks.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }
  componentWillMount() {
    const resp=this.findSocialLinks();
    return resp;
  }

  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  async addEventHandler() {
    const resp=await this.updateSocialLinks();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/socialLinkTypeList");
  };
  async findSocialLinks(){
    let Id=this.props.config;
    const response = await findSocialLinksTypeActionHandler(Id);
    this.setState({loading:false,data:response});
  }

  async  updateSocialLinks() {
    let Details = {
      _id : this.props.config,
      socialName: this.refs.name.value,
      socialDisplayName: this.refs.displayName.value,
      aboutSocial: this.refs.about.value,
      // socialUploadIcon : this.refs.upload.value,
      isActive: this.refs.status.checked,
    }
    const response = await updateSocialListsTypeActionHandler(Details);
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
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.updateSocialLinks.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/socialLinkTypeList")
        }
      }
    ]
    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
          <div className="admin_main_wrap">
            <div className="admin_padding_wrap">
              <h2>Edit Social Link Type</h2>
              <div className="col-md-6 nopadding-left">
                <input type="text" ref="id" defaultValue={this.state.data&&this.state.data._id} hidden="true"/>
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" ref="name" defaultValue={this.state.data&&this.state.data.socialName} placeholder="Name" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <textarea ref="about" defaultValue={this.state.data&&this.state.data.aboutSocial} placeholder="About" className="form-control float-label" id=""></textarea>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <form>
                      <div className="form-group">
                        <input type="text" ref="displayName" defaultValue={this.state.data&&this.state.data.socialDisplayName} placeholder="Display Name" className="form-control float-label" id=""/>
                      </div>
                      <br className="brclear"/>
                      {/*<div className="form-group ">*/}
                        {/*<div className="fileUpload mlUpload_btn">*/}
                          {/*<span>Upload Icon</span>*/}
                          {/*<input type="file" className="upload" ref="upload"/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                      <br className="brclear"/>
                      <br className="brclear"/>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" ref="status" id="status" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                    </form>
                  </ScrollArea>
                </div>
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
            </div>
          </div>)}
      </div>
    )
  }
};

export default MlEditSocialLinkType = formHandler()(MlEditSocialLinkType);
