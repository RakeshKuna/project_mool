import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {addLanguageActionHandler} from '../actions/addLanguageAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';


class MlAddLanguage extends React.Component{
  constructor(props) {
    super(props);
    this.addEventHandler.bind(this);
    this.createLanguage.bind(this)
    return this;
  }

  componentDidMount() {
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  async addEventHandler() {
    const resp=await this.createLanguage();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/languagesList");
  };

  async  createLanguage() {
    let Details = {
      languageName: this.refs.docTypeName.value,
      languageDisplayName: this.refs.displayName.value,
      aboutLanguage: this.refs.about.value,
      isActive: this.refs.status.checked,
    }
    const response = await addLanguageActionHandler(Details);
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
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createLanguage.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/languagesList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Language</h2>
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
            <div className="form_bg left_wrap">
              <ScrollArea
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
                <form>
                  <div className="form-group">
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="status" />
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear"/>
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

export default MlAddLanguage = formHandler()(MlAddLanguage);
