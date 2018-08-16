/**
 * Created by mohammed.mohasin on 22/07/17.
 */
import React from 'react';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addNotificationTemplate} from '../actions/addNotificationTemplateAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
import _ from 'underscore';
import Select from 'react-select';
import Preview from '../component/Preview';
import { toast } from 'react-toastify';
class MlAddNotificationTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state={type:null};
    this.createNotificationTemplate.bind(this);
    return this;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/notificationTemplateList");
      else
        //toastr.error(response.result);
        toast.success(response.result)
    }
  };

  async createNotificationTemplate() {
    var dynamicKeys=this.refs.dynamicKeys.value||'';
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      //toastr.error(ret);
       toast.error(ret);
    } else {
      let notificationTemplate = {
        title: this.refs.title.value,
        tempDesc: this.refs.tempDesc.value,
        tempCode: this.refs.tempCode.value,
        dynamicKeys :dynamicKeys.split(','),
        type: this.state.type,
        isHtmlContent: this.refs.isHtmlContent.checked,
        content: _.escape(this.refs.content.value),
        isActive: this.refs.isActive.checked
      }

      const response = await addNotificationTemplate(notificationTemplate);
      if(response&&response.success){
        //toastr.success("Notification Template Created Successfully");
        toast.success("Notification Template created successfully");
      }
      return response;
    }
  }
  componentDidMount()  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
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

  render() {
    let types=[
      {value: 'email', label: 'Email'},
      {value: 'sms', label: 'Sms'},
      {value: 'alert', label: 'Alert'},
      {value: 'notification', label: 'Notification'}
    ];
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createNotificationTemplate.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
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
    ]

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

          <div className="admin_padding_wrap">
            <h2>Create Notification Template</h2>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="tempCode" placeholder="Template Code" className="form-control float-label"/>
                  </div>

                  <div className="form-group">
                    <input type="text" ref="tempDesc" placeholder="Template Description" className="form-control float-label" />
                  </div>

                  <div className="form-group mandatory">
                    <Select name="form-field-name" placeholder="Type"  ref="type"  className="float-label" options={types} value={this.state.type} onChange={this.optionsBySelectTypes.bind(this)} />
                  </div>

                  <div className="form-group">
                    <input type="text" ref="title" placeholder="Title" className="form-control float-label"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref="dynamicKeys"  placeholder="Dynamic Keys" className="form-control float-label" id=""/>
                  </div>

                  <br />
                  <br />
                  <br />
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="isActive"/>
                      <div className="slider"></div>
                    </label>
                  </div>

                  <div className="form-group switch_wrap inline_switch">
                    <label>Html Content</label>
                    <label className="switch">
                      <input type="checkbox" ref="isHtmlContent" />
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
                    <textarea style={{'height':'200px'}} ref="content" placeholder="content" className="form-control float-label" data-required={true} data-errMsg="Content is Required"></textarea>
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
}
;

export default MlAddNotificationTemplate = formHandler()(MlAddNotificationTemplate);
