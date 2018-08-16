/**
 * Task appointment term and condition component
 * @Author :: Birendra Kumar
 * @Dated :: 17/08/2017
 */

// import NPM module(s)
import React, {Component} from 'react';

// import custom method(s) and component(s)
import ScrollArea from 'react-scrollbar';


export default class MlTaskAppointmentTermAndCondition extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (290 + $('.app_header').outerHeight(true)));
  }

  /**
   * Method :: getAttachmentsList
   * Desc :: Get the attachmentlist for a service
   * @return {XML}
   */
  getAttachmentsList() {
    let attachments = this.props.task && this.props.task.attachments;

    const attachmentDetails = (attachments && attachments.length > 0) ?
      attachments.map(function (value, index) {
        return (
          <div className="col-md-6 nopadding-left" key={index}>
            <div className="panel panel-default">
              <div className="panel-heading">
                Attachment {index + 1}
              </div>
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <input placeholder="Document name" className="form-control float-label" value={value.name}
                           disabled/>
                  </div>
                  <div className="form-group">
                    <textarea className="form-control float-label" placeholder="Info" value={value.info}
                              disabled></textarea>
                  </div>
                  <div className="input_types">
                    <input id="checkbox" type="checkbox" name="checkbox" checked={value.isMandatory} disabled/><label
                    htmlFor="checkbox"><span><span></span></span>Is Mandatory</label>
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
  render() {
    let service = this.props.service|| {};
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <br className="brclear"/>
          <div className="col-md-6 nopadding-left">
            <label><strong>Terms and conditions</strong></label>
            { this.props.showCancelAndRescheduleInfo &&
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="cancelable">Can be cancelled</label>
                  <span className={(service.termsAndCondition && service.termsAndCondition.isCancelable) ? 'state_label acLabel' : 'state_label'}>Yes</span>
                  <label className="switch nocolor-switch">
                    <input id="cancelable" type="checkbox"
                           checked={!(service.termsAndCondition && service.termsAndCondition.isCancelable)}
                           value={(service.termsAndCondition && service.termsAndCondition.isCancelable)}/>
                    <div className="slider"/>
                  </label>
                  <span className={(service.termsAndCondition && service.termsAndCondition.isCancelable) ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <br className="brclear"/><br className="brclear"/><br className="brclear"/>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="schedulable">Can be rescheduled</label>
                  <span
                    className={(service.termsAndCondition && service.termsAndCondition.isReschedulable) ? 'state_label acLabel' : 'state_label'}>Yes</span><label
                  className="switch nocolor-switch">
                  <input id="schedulable" type="checkbox"
                         checked={!(service.termsAndCondition && service.termsAndCondition.isReschedulable)}
                         value={(service.termsAndCondition && service.termsAndCondition.isReschedulable)}/>
                  <div className="slider"></div>
                </label>
                  <span className={(service.termsAndCondition && service.termsAndCondition.isReschedulable) ?
                    'state_label' : 'state_label acLabel'}>No</span>
                </div>
              </form>
            </div>}
          </div>
          {this.props.showCancelAndRescheduleInfo && <div className="col-md-6 nopadding-right">
            <br className="brclear"/><br className="brclear"/>
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <label>Can be cancelled &nbsp;
                    <input className="form-control inline_input medium_in"
                           id="cancelationday"
                           disabled={!(service.termsAndCondition && service.termsAndCondition.isCancelable)}
                           value={(service.termsAndCondition && service.termsAndCondition.noOfDaysBeforeCancelation)} /> days
                  </label>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>Can be rescheduled  &nbsp;<input className="form-control inline_input medium_in"
                                                          id="rescheduler"
                                                          disabled={!(service.termsAndCondition && service.termsAndCondition.isReschedulable)}
                                                          value={(service.termsAndCondition && service.termsAndCondition.noOfReschedulable)}/> times
                  </label>
                </div>
              </form>
            </div>
          </div>}
          <br className="brclear"/>
          {this.getAttachmentsList()}
        </ScrollArea>
      </div>
    )
  }
};
