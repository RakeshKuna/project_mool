import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {updateLanguageActionHandler} from '../actions/updateLanguageAction'
import {findLanguageActionHandler} from '../actions/findLanguageAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditLanguage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateLang.bind(this);
    this.findLang.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }

  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  componentWillMount() {
    const resp=this.findLang();
    return resp;
  }

  async addEventHandler() {
    const resp=await this.updateLang();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/languagesList");
  };
  async findLang(){
    let Id=this.props.config;
    const response = await findLanguageActionHandler(Id);
    this.setState({loading:false,data:response});
  }

  async  updateLang() {
    let Details = {
      id: this.props.config,
      languageName: this.refs.name.value,
      languageDisplayName: this.refs.displayName.value,
      aboutLanguage: this.refs.about.value,
      isActive: this.refs.status.checked,
    }
    console.log(Details)

    const response = await updateLanguageActionHandler(Details);
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
        handler: async(event) => this.props.handler(this.updateLang.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/languagesList")
        }
      }
    ]
    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
          <div className="admin_main_wrap">
            <div className="admin_padding_wrap">
              <h2>Edit Language</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" ref="name" placeholder="Name" defaultValue={this.state.data&&this.state.data.languageName} className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <textarea ref="about" placeholder="About" defaultValue={this.state.data&&this.state.data.aboutLanguage} className="form-control float-label" id=""></textarea>
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
                        <input type="text" ref="displayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.languageDisplayName} className="form-control float-label" id=""/>
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

export default MlEditLanguage = formHandler()(MlEditLanguage);
