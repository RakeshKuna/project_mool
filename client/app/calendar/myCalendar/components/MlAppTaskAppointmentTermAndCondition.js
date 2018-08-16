/**
 * Task appointment term and condition component
 * @Author :: Birendra Kumar
 * @Dated :: 28/07/2017
 */

// import NPM module(s)
import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

// import custom method(s) and component(s)
import ScrollArea from 'react-scrollbar';


export default class MlAppTaskAppointmentTermAndCondition extends Component{
  constructor(props) {
    super(props);
    this.state = {
      task: {}
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (290 + $('.admin_header').outerHeight(true)));
  }

  /**
   * Method :: getAttachmentsList
   * Desc :: Get the attachmentlist for a service
   * @return {XML}
   */
  getAttachmentsList() {
    let task = {
      attachments: [
        {
          name: 'Doc v0.0.1',
          info: 'Agjh jh jkhfjks djkshdf sjkf',
          isMandatory: true
        }
      ]
    };
    const attachmentDetails = task.attachments && task.attachments.length > 0 ?
      task.attachments.map(function (value, index) {
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
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <br className="brclear"/>
          <div className="col-md-6 nopadding-left">
            <label><strong>Terms and conditions</strong></label>
          </div>
          <br className="brclear"/>
          {this.getAttachmentsList()}
        </ScrollArea>
      </div>
    )
  }
};
