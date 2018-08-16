import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {addAddressTypeActionHandler} from '../actions/addAddressTypeAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';


class MlAddAddressType extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createAddressType.bind(this)
    return this;
  }

  componentDidMount() {
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  async addEventHandler() {
    const resp=await this.createAddressType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/addressTypeList");
  };

  async  createAddressType() {
    let Details = {
      addressName: this.refs.name.value,
      addressDisplayName: this.refs.displayName.value,
      aboutAddress: this.refs.about.value,
      // addressUploadIcon : this.refs.upload.value,
      isActive: this.refs.status.checked,
    }
    const response = await addAddressTypeActionHandler(Details);
    return response;
  }


  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createAddressType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/addressTypeList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Address Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="name" placeholder="Name" className="form-control float-label"/>
                </div>
                <div className="form-group">
                  <textarea ref="about" placeholder="About" className="form-control float-label"></textarea>
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
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label"/>
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
                      <input type="checkbox" ref="status" id="status"/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </form>
              </ScrollArea>
            </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
      </div>
    )
  }
};

export default MlAddAddressType = formHandler()(MlAddAddressType);
