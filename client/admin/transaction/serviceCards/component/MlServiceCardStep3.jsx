/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the list view
 * JavaScript XML file MlserviceCardsList.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar';
import {getTaskFromService} from'../actions/mlFindService'


export default class MlServiceCardStep3 extends React.Component{

  /**
   * Constructor
   * @param props :: Object - Parents data
   */


  constructor(props) {
    super(props)
    this.state = {
      mandatory: "",
      cancellation: "",
      reschedule: "",
      refund: "",
      attachment: [{
        name:"",
        info:"",
        isMandatory:""
      }],
      documentName:"",
      information:""
    }
    this.getDetails.bind(this)
  }

  /**
   * ComponentDidMount
   * Desc :: Initializing the float labels
   */

  componentDidMount()
  {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(290+$('.admin_header').outerHeight(true)));
  }

  /**
   * componentWillMount
   * Desc :: Calls the function getDetails
   */

  componentWillMount() {
    this.getDetails();
  }

  /**
   * Method :: getDetails
   * Desc   :: getTaskFromService() is called and respective states are set
   * @returns :: void
   */

  async getDetails() {
    let id = this.props.data._id
    if(id) {
      const response = await getTaskFromService(id)
      if(response) {
        let attachment = response.attachments && response.attachments.length? response.attachments.map(function(data){
          return data
        }):  {name:"",info:"",isMandatory:""}
        let x = [];
        _.each(attachment, function (item)
        {
          for (var propName in item) {
            if (item[propName] === null || item[propName] === undefined) {
              delete item[propName];
            }
          }
          let newItem = _.omit(item, "__typename");
          x.push(newItem)
        })
        this.setState({
          attachment: x, cancellation: response.termsAndCondition.isCancelable,
          refund: response.termsAndCondition.isRefundable, reschedule: response.termsAndCondition.isReschedulable,
          time: response.termsAndCondition.noOfReschedulable
        })
      }
    }
  }

  /**
   * Method :: getAttachmentsList
   * Desc :: Get the attachmentlist for a service
   * @return {XML}
   */
  getAttachmentsList() {
    const {attachments} = this.props.data;
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
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */

  render(){
    const {
      serviceTermAndCondition,
      attachments,
      saveService,
      onChangeCheckBox,
      onChangeValue } = this.props.data;
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
                         value={serviceTermAndCondition.isCancelable} disabled />
                  <div className="slider"></div>
                </label>
                  <span className={serviceTermAndCondition.isCancelable ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <br className="clearfix"/><br className="clearfix"/>
                <br className="clearfix"/>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label htmlFor="schedulable">Can be Rescheduled</label>
                  <span className={serviceTermAndCondition.isReschedulable ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="schedulable" type="checkbox"
                         checked={!serviceTermAndCondition.isReschedulable}
                         value={serviceTermAndCondition.isReschedulable} disabled />
                  <div className="slider"></div>
                </label>
                  <span className={serviceTermAndCondition.isReschedulable ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <br className="clearfix"/><br className="clearfix"/>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <label>Can be cancelled &nbsp;
                    <input className="form-control inline_input medium_in"
                           id="cancelationday" disabled
                           value={serviceTermAndCondition.noOfDaysBeforeCancelation} /> days
                  </label>
                </div>
                <br className="clearfix"/>
                <div className="form-group">
                  <label>Can be rescheduled  &nbsp;<input className="form-control inline_input medium_in"
                                               id="rescheduler" disabled
                                               value={serviceTermAndCondition.noOfReschedulable} /> times
                  </label>
                </div>
                <br className="clearfix"/><br className="clearfix"/>
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
