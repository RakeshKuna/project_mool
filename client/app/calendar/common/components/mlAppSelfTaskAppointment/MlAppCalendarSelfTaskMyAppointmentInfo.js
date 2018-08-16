/** *************************************************************
 * @Author: Birendra Kr
 * @Dated: 07 Aug, 2017
 * Description : This will manage the task basic info
 * JavaScript XML file MlAppTaskCreate.jsx
 * ****************************************************************/

/**
 * Imports libs and components
 */
import React, {Component} from "react";
import ScrollArea from "react-scrollbar";
import gql from 'graphql-tag'
import Moolyaselect from '../../../../commons/components/MlAppSelectWrapper'
let Select = require('react-select');

export default class MlAppCalendarSelfTaskMyAppointmentInfo extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.sessionFrequencyOptions = [
      {value: 'weekly', label: 'Weekly'},
      {value: 'monthly', label: 'Monthly'},
      {value: 'daily', label: 'Daily'}
    ];
    this.options = [
      {value: 'audio', label: 'Audio'},
      {value: 'video', label: 'Video'},
      {value: 'meetup', label: 'MeetUp'}
    ];
  }

  /**
   * Component Did Mount
   * Desc :: Initialize js float
   */
  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (240 + $('.app_header').outerHeight(true)));
  }

  render() {
    const that = this;
    const {selfTask} = this.props;
    /**
     * fetch industries graphql query
     */
    let industryTypeQuery = gql` query{
                               data:fetchIndustries{label:industryName,value:_id}
                                  }`;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names">
                  <span className={selfTask.mode === 'online' ? 'state_label acLabel' : 'state_label'}>Online</span>
                  <label className="switch nocolor-switch">
                    <input type="checkbox"
                           checked={selfTask.mode !== 'online'} />
                    <div className="slider"></div>
                  </label>
                  <span className={selfTask.mode === 'offline' ? 'state_label acLabel' : 'state_label'}>Offline</span>
                </div><br className="brclear"/>
                <div className="form-group">
                  <input type="text"
                         placeholder="Name"
                         className="form-control float-label"
                         id="name"
                         value={selfTask.name} />
                </div>
                <div className="form-group">
                  <label>About<textarea className="form-control float-label"
                                        id="about"
                                        value={selfTask.about}></textarea>
                  </label>
                </div>
                <div className="form-group">
                  <label>Time: &nbsp;
                    <input type="Number" value={(selfTask.duration && selfTask.duration.hours) ? selfTask.duration.hours : '' }  className="form-control inline_input"/>
                    Hours



                    <input type="Number" value={(selfTask.duration && selfTask.duration.minutes) ? selfTask.duration.minutes : '' }  className="form-control inline_input"/>
                    Mins
                  </label>
                </div>
                <div className="form-group">
                  <label>Expected intput<textarea className="form-control float-label"
                                                  id="expectedInput"
                                                  value={selfTask.expectedInput}></textarea>
                  </label>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <br className="brclear" />
                <br className="brclear" />
                <Moolyaselect multiSelect={true}
                              className="form-control float-label"
                              valueKey={'value'}
                              labelKey={'label'}
                              queryType={"graphql"}
                              query={industryTypeQuery}
                              isDynamic={true} placeholder="Select Industry Type"
                              selectedValue={selfTask.industries}
                />
                <br className="brclear" />
                <div className="form-group">
                  {(selfTask.conversation && selfTask.conversation.length > 0) &&
                  <span className="placeHolder active">Conversation type</span>
                  }
                  <div className="form-group">
                    <Select name="form-field-name"
                            multi={true}
                            disabled={selfTask.mode === 'offline' ? true : false}
                            valueKey={'value'}
                            labelKey={'label'}
                            options={this.options}
                            value={selfTask.conversation}
                            placeholder='Conversation Type' />
                  </div>
                </div>
                <br className="brclear" />
                {selfTask.frequency &&
                <span className="placeHolder active">Frequency</span>
                }
                <div className="form-group">
                  <Select className="form-field-name" options={this.sessionFrequencyOptions} placeholder="Frequency"
                          value={selfTask.frequency} />
                </div>
                <div className="form-group">
                  <label>Expected output<textarea className="form-control float-label"
                                                  id="expectedOutput"
                                                  value={selfTask.expectedOutput}></textarea>
                  </label>
                </div>
                <br className="brclear"/>
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }
};
