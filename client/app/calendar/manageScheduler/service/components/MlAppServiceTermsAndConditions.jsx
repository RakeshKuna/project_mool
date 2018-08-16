/**
 * Service term and condition component
 * @Author :: Mukhil P
 * @Dated :: 19/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

// import custom method(s) and component(s)
import ScrollArea from 'react-scrollbar';


export default class MlAppServiceTermsAndConditions extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.activateComponent(2);
    let viewMode = this.props.viewMode;
    const hight = viewMode ? 325 : 300;
    $('.float-label').jvFloat();
    let WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(hight+$('.app_header').outerHeight(true)));
    this.props.getServiceDetails();
    this.props.getRedirectServiceList(false);
  }

  /**
   * Method :: getAttachmentsList
   * Desc :: Get the attachmentlist for a service
   * @return {XML}
   */
  getAttachmentsList() {
    const {serviceTermAndCondition, attachments, saveDetails} = this.props;
    const attachmentDetails = attachments && attachments.length > 0 ?
      attachments.map(function(value , index){
      return(
        <div className="col-md-6 nopadding-left" key={index}>
          <div className="panel panel-default">
            <div className="panel-heading">
              Attachment {index + 1}
            </div>
            <div className="panel-body">
              <form>
                <div className="form-group">
                  <input placeholder="Document name" className="form-control float-label" value={value.name} disabled />
                </div>
                <div className="form-group">
                  <textarea className="form-control float-label" placeholder="Info" value={value.info} disabled></textarea>
                </div>
                <div className="input_types">
                  <input id="checkbox" type="checkbox" name="checkbox" checked={value.isMandatory}disabled /><label htmlFor="checkbox"><span><span></span></span>Is Mandatory</label>
                </div>
                <br className="brclear"/>
              </form>
            </div>
          </div>
        </div>
      )
    }) : [];
    return attachmentDetails;
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    const {
      serviceTermAndCondition,
      attachments,
      onChangeCheckBox,
      onChangeValue } = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="cancelable">Can be cancelled</label>
                  <span className={serviceTermAndCondition.isCancelable ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="cancelable" type="checkbox"
                         checked={!serviceTermAndCondition.isCancelable}
                         value={serviceTermAndCondition.isCancelable}
                         onChange={(event) => onChangeCheckBox(event)} disabled={this.props.viewMode} />
                  <div className="slider"></div>
                </label>
                  <span className={serviceTermAndCondition.isCancelable ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="schedulable">Can be Rescheduled</label>
                  <span className={serviceTermAndCondition.isReschedulable ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="schedulable" type="checkbox"
                         disabled={this.props.viewMode}
                         checked={!serviceTermAndCondition.isReschedulable}
                         value={serviceTermAndCondition.isReschedulable}
                         onChange={(event) => onChangeCheckBox(event)} />
                  <div className="slider"></div>
                </label>
                  <span className={serviceTermAndCondition.isReschedulable ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <label>Can be cancelled &nbsp;
                    <input className="form-control inline_input medium_in"
                           id="cancelationday"
                           disabled={!serviceTermAndCondition.isCancelable || this.props.viewMode}
                           value={serviceTermAndCondition.noOfDaysBeforeCancelation}
                           onChange={(event) => onChangeValue(event)} /> days
                  </label>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>Can be rescheduled  &nbsp;<input className="form-control inline_input medium_in"
                                               id="rescheduler"
                                               disabled={!serviceTermAndCondition.isReschedulable}
                                               onChange={(event) => onChangeValue(event)}
                                               value={serviceTermAndCondition.noOfReschedulable}  /> times
                  </label>
                </div>
              </form>
            </div>
          </div>
          <br className="brclear"/>
          {this.getAttachmentsList()}
        </ScrollArea>
      </div>
    )
  }
};
