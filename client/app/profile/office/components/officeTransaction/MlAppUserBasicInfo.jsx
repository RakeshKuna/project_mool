import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');

var options = [
  {value: 'select', label: 'Select Country'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options1 = [
  {value: 'select', label: 'Choose registration type'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options2 = [
  {value: 'select', label: 'Subscription type'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options3 = [
  {value: 'select', label: 'Do you want to associate to any institution'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options4 = [
  {value: 'select', label: 'How did you know about us'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options5 = [
  {value: 'select', label: 'Select Cluster'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];
var options6 = [
  {value: 'select', label: 'Select Chapter'},
  {value: 'one', label: 'One'},
  {value: 'two', label: 'Two'}
];

export default class MlAppUserBasicInfo extends React.Component {
  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (160 + $('.admin_header').outerHeight(true)));
  }

  render() {
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Request ID" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="First Name" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Last Name" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <Select name="form-field-name" value="select" options={options} className="float-label"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Contact number" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email Id" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="City" className="form-control float-label" />
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading">Operation Area</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <Select name="form-field-name" value="select" options={options5} className="float-label"/>
                    </div>
                    <div className="form-group">
                      <Select name="form-field-name" value="select" options={options6} className="float-label"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Source" className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Device name" className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Device number" className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="IP Address" className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="IP Location" className="form-control float-label" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <Select name="form-field-name" value="select" options={options1} className="float-label"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="User name" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="Password" placeholder="Password" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <Select name="form-field-name" value="select" options={options2} className="float-label"/>
                </div>
                <div className="form-group">
                  <Select name="form-field-name" value="select" options={options3} className="float-label"/>
                </div>
                <div className="form-group">
                  <input type="Password" placeholder="Company Name" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="Password" placeholder="Company URL" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="Password" placeholder="Remarks" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <Select name="form-field-name" value="select" options={options4} className="float-label"/>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">Process Status</div>
                  <div className="panel-body button-with-icon">
                    <button type="button" className="btn btn-labeled btn-success">
                      <span className="btn-label"><FontAwesome name='key'/></span>Send OTP
                    </button>
                    <button type="button" className="btn btn-labeled btn-success">
                      <span className="btn-label"><span className="ml ml-email"></span></span>Send Email
                    </button>
                    <button type="button" className="btn btn-labeled btn-success">
                      <span className="btn-label"><FontAwesome name='bullhorn'/></span>Send Ann.Temp
                    </button>

                  </div>
                </div>

              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }
};
