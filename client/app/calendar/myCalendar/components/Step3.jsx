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


export default class Step3 extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.app_header').outerHeight(true)));
    this.props.activeComponent('termAndCondition');
    if(typeof this.props.getServiceDetails !== 'undefined') {
      this.props.getServiceDetails();
    }
  }

  /**
   * Method :: getAttachmentsList
   * Desc :: Get the attachmentlist for a service
   * @return {XML}
   */
  getAttachmentsList() {
    const {serviceTermAndCondition, attachments, saveDetails} = this.props;
    const attachmentDetails = attachments && attachments.length > 0 ?
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
   * Method :: getDeliverableList
   * Desc :: Get the deliverablelist for a activity
   * @return {XML}
   */
  getDeliverableList() {
    const {activities} = this.props;
    const activityDetails = activities && activities.length > 0 ?
      activities.map((activity, index) => {
        return (
          <div key={index}>
            <h4>{activity.name}</h4>
            <br className="brclear"/>
            <label>Deliverables</label>
            <br className="brclear"/>
            {
               activity.deliverables.map((data, index) => {
                return (
                  <div key={index}>
                    <textarea className="form-control" defaultValue={data} disabled></textarea>
                    <br className="brclear"/>
                  </div>
                )
              })
            }
          </div>
        )
      }) : [];
    return activityDetails;
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    const { serviceTermAndCondition } = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
          <br/><div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="cancelable">Can be cancelled</label>
                  <span className={(serviceTermAndCondition && serviceTermAndCondition.isCancelable) ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="cancelable" type="checkbox"
                         checked={!(serviceTermAndCondition && serviceTermAndCondition.isCancelable)}
                         value={(serviceTermAndCondition && serviceTermAndCondition.isCancelable)}
                         />
                  <div className="slider"></div>
                </label>
                  <span className={(serviceTermAndCondition && serviceTermAndCondition.isCancelable) ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="schedulable">Can be Rescheduled</label>
                  <span className={(serviceTermAndCondition && serviceTermAndCondition.isReschedulable) ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="schedulable" type="checkbox"
                         checked={!(serviceTermAndCondition && serviceTermAndCondition.isReschedulable)}
                         value={(serviceTermAndCondition && serviceTermAndCondition.isReschedulable)}
                  />
                  <div className="slider"></div>
                </label>
                  <span className={(serviceTermAndCondition && serviceTermAndCondition.isReschedulable) ? 'state_label' : 'state_label acLabel'}>No</span>
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
                           disabled={!(serviceTermAndCondition && serviceTermAndCondition.isCancelable)}
                           value={(serviceTermAndCondition && serviceTermAndCondition.noOfDaysBeforeCancelation)}
                           /> days
                    </label>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>Can be rescheduled &nbsp;
                    <input className="form-control inline_input medium_in"
                           id="rescheduler"
                           disabled={!(serviceTermAndCondition && serviceTermAndCondition.isReschedulable)}
                           value={(serviceTermAndCondition && serviceTermAndCondition.noOfReschedulable)}  /> times
                  </label>
                </div>
              </form>
            </div>
          </div>
          <br className="brclear"/>
          {this.getAttachmentsList()}
          <br className="brclear"/><br className="brclear"/>
          {this.getDeliverableList()}
        </ScrollArea>
      </div>
    )
  }
};
