/**
 * Created by mohammed.mohasin on 22/07/17.
 */
import React from 'react';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findNotificationTemplateActionHandler} from '../actions/findNotificationTemplateAction'
import {updateNotificationTemplateActionHandler} from '../actions/updateNotificationTemplateAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
import _ from 'underscore';
import Select from 'react-select';
import Preview from '../component/Preview';
class MlEditNotificationTemplate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{},type:null};
    this.updateNotificationTemplate.bind(this)
    this.findNotificationTemplate.bind(this);
    this.onStatusChange.bind(this);
    this.onHtmlContentChange.bind(this);
    return this;
  }

  componentWillMount() {
    const resp=this.findNotificationTemplate();
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

  onHtmlContentChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isHtmlContent":true}});
    }else{
      this.setState({"data":{"isHtmlContent":false}});
    }
  }

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/notificationTemplateList");
      else
        toastr.error(response.result);
    }
  }

  async findNotificationTemplate(){
    let tempId = this.props.config
    const response = await findNotificationTemplateActionHandler(tempId);
    this.setState({loading:false,data:response,type:response&&response.type?response.type:null});
  }

  async  updateNotificationTemplate() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {;
      let dynamicKeys=this.refs.dynamicKeys.value||'';
      let tempDetails = {
        title: this.refs.title.value,
        tempDesc: this.refs.tempDesc.value,
        tempCode: this.refs.tempCode.value,
        type: this.state.type,
        dynamicKeys :dynamicKeys.split(','),
        isHtmlContent: this.refs.isHtmlContent.checked,
        content: _.escape(this.refs.content.value),
        isActive: this.refs.isActive.checked
      }

      const response = await updateNotificationTemplateActionHandler(this.props.config,tempDetails)
      return response;
    }
  }

  optionsBySelectTypes(val){
    this.setState({type:val.value})
  }

  templateContent(actionConfig,handlerCallback){
    var tempContent=this.refs.content.value||'';
    if(handlerCallback) {//to handle the popover
      handlerCallback({content:tempContent});
    }
  }
  render(){
    let types=[
      {value: 'email', label: 'Email'},
      {value: 'sms', label: 'Sms'},
      {value: 'alert', label: 'Alert'},
      {value: 'notification', label: 'Notification'}
    ];
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateNotificationTemplate.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },

      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/notificationTemplateList")
        }
      },
      {
        showAction: true,
        actionName: 'preview',
        hasPopOver: true,
        popOverTitle: 'Preview',
        placement: 'top',
        target: 'preview',
        popOverComponent: <Preview />,
        handler: this.templateContent.bind(this),
        actionComponent: function (props) {
          return <div className={props.activeClass} id={props.actionName}>
            <div onClick={props.onClickHandler} className={props.activesubclass} data-toggle="tooltip"
                 title={props.actionName} data-placement="top" id={props.target}>
              <span className={props.iconClass}></span>
            </div>
          </div>;
        }
      }
    ];

    const showLoader=this.state.loading;
    const contentValue=_.unescape(this.state.data.content);
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

          <div className="admin_padding_wrap">
            <h2>Edit Notification Template</h2>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                  </div>

                  <div className="form-group mandatory">
                    <input type="text" ref="tempCode" readOnly="readOnly" placeholder="Template Code" className="form-control float-label" defaultValue={this.state.data.tempCode}/>
                  </div>

                  <div className="form-group">
                    <input type="text" ref="tempDesc" placeholder="Template Description" className="form-control float-label" defaultValue={this.state.data.tempDesc}/>
                  </div>

                  <div className="form-group mandatory">
                    <Select name="form-field-name" placeholder="Type"  ref="type" className="float-label" data-required={true} data-errMsg="Type is Required"  options={types} value={this.state.type} onChange={this.optionsBySelectTypes.bind(this)}/>
                  </div>

                  <div className="form-group">
                    <input type="text" ref="title" placeholder="Title" className="form-control float-label" defaultValue={this.state.data.title}/>
                  </div>
                  <div className="form-group">
                    <input type="text"  ref="dynamicKeys" placeholder="Dynamic Keys" className="form-control float-label" id=""  defaultValue={this.state.data.dynamicKeys}/>
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
                  <div className="form-group switch_wrap inline_switch">
                    <label>Html Content</label>
                    <label className="switch">
                      <input type="checkbox" ref="isHtmlContent" checked={this.state.data.isHtmlContent} onChange={this.onHtmlContentChange.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </form>
              </div>

            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <textarea style={{'height':'200px'}} ref="content" placeholder="Content" className="form-control float-label" defaultValue={contentValue} data-required={true} data-errMsg="Content is Required"></textarea>
                  </div>
                </form>
                {/* <form>
                  <iframe srcDoc={contentValue} style={{'width':'100%'}} id="iframeResult" name="iframeResult">
                  </iframe>
                </form>*/}
              </div>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
            />
          </div>)}
      </div>
    )
  }
};

export default MlEditNotificationTemplate = formHandler()(MlEditNotificationTemplate);
