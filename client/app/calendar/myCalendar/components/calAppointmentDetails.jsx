import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import CalenderHead from './calendarHead';

export default class CalCreateAppointmentView extends React.Component{
  componentDidMount()
  {
    $('.float-label').jvFloat();

    $('.switch input').change(function() {
      if($(this).parent().hasClass('nocolor-switch')){
        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        }else{
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      }else{
        if ($(this).is(':checked')) {
          $(this).parent('.switch').addClass('on');
        }else{
          $(this).parent('.switch').removeClass('on');
        }
      }
    });
    var WinWidth = $(window).width();
    if(WinWidth > 768){
      $(".app_main_wrap").mCustomScrollbar({theme:"minimal-dark"});
    }
  }
  render(){
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <CalenderHead/>
          <div className="col-md-12">
            <div className="col-md-6 nopadding-left">
              <div className="form-group switch_wrap switch_names">
                <span className="state_label">Internal</span>
                <label className="switch nocolor-switch">
                  <input type="checkbox" defaultChecked />
                  <div className="slider"></div>
                </label>
                <span className="state_label acLabel">External</span>
              </div><br className="brclear"/>
              <div className="form-group">
                <span className="placeHolder active">Task type</span>
                <select className="form-control"><option>Valuation</option></select>
              </div>
              <div className="form-group">
                <input className="form-control float-label" defaultValue="task name here" placeholder="Task name"/>
              </div>
              <div className="form-group">
                <span className="placeHolder active">Select the task to be done</span>
                <select className="form-control"><option>Discussion on funding</option></select>
              </div>
              <div className="form-group">
                <div className="input_types">
                  <input id="radio1" type="radio" name="radio" value="1"/><label htmlFor="radio1"><span><span></span></span>Offline</label>
                </div>
                <div className="input_types">
                  <input id="radio2" type="radio" name="radio" value="2" defaultChecked/><label htmlFor="radio2"><span><span></span></span>Online</label>
                </div>
                <br className="brclear"/>
              </div>
              <div className="form-group">
                <input className="form-control float-label" defaultValue="Hyderabad" placeholder="Location"/>
              </div>
              <div className="form-group">
                <div className="input_types">
                  <input id="radio3" type="radio" name="radio2" value="1"/><label htmlFor="radio3"><span><span></span></span>Low</label>
                </div>
                <div className="input_types">
                  <input id="radio4" type="radio" name="radio2" value="2"/><label htmlFor="radio4"><span><span></span></span>Medium</label>
                </div>
                <div className="input_types">
                  <input id="radio5" type="radio" name="radio2" value="2" defaultChecked/><label htmlFor="radio5"><span><span></span></span>High</label>
                </div>
                <br className="brclear"/>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form-group switch_wrap inline_switch">
                <label>Recuring</label>
                <label className="switch">
                  <input type="checkbox" />
                  <div className="slider"></div>
                </label>
              </div>
              <br className="brclear"/>
              <div className="form-group">
                <span className="placeHolder active">Frequency</span>
                <select className="form-control"><option>Weekly</option></select>
              </div>
              <div className="form-group">
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-default">Sun</button>
                  <button type="button" className="btn btn-primary">Mon</button>
                  <button type="button" className="btn btn-success">Tue</button>
                  <button type="button" className="btn btn-info">Wed</button>
                  <button type="button" className="btn btn-warning">Thu</button>
                  <button type="button" className="btn btn-danger">Fri</button>
                  <button type="button" className="btn btn-default">Sat</button>
                </div>
              </div>

              <div className="form-group">
                <textarea className="form-control float-label" placeholder="Notes"></textarea>
              </div>
              <div className="panel panel-default library-wrap">
                <div className="panel-heading">
                  Attachments <span className="pull-right">
                 <div className="fileUpload upload_file_mask">
                     <a href="javascript:void(0);"><span className="ml ml-upload"></span>
                     <input type="file" className="upload_file upload" name="file_source" /></a>
                  </div></span>
                </div>
                <div className="panel-body">
                  <div className="thumbnail"><FontAwesome name='trash-o'/><img src="/images/ppt.png"/><div className="title">Document</div></div>
                  <div className="thumbnail"><FontAwesome name='trash-o'/><img src="/images/doc.png"/><div className="title">Document</div></div>
                  <div className="thumbnail"><FontAwesome name='trash-o'/><img src="/images/pdf.png"/><div className="title">Document</div></div>
                </div>
              </div>
            </div>
            <br className="brclear"/>
            <div className="panel panel-default library-wrap">
              <div className="panel-heading"> Attendees <span className="pull-right"><input type="text"/> </span></div>
              <div className="panel-body nopadding">
                <div className="col-md-4 att_groups nopadding">
                  <ul className="users_list">
                    <li>
                      <a href="">
                        <span className="icon_bg"> <span className="icon_lg ml flaticon-ml-active-user"></span></span><br />
                        <div className="tooltiprefer">
                          <span>Bearers</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <span className="icon_bg"> <span className="icon_lg ml ml-clients"></span></span><br />
                        <div className="tooltiprefer">
                          <span>Clients</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <span className="icon_bg"><span className="icon_lg ml ml-moolya-symbol"></span></span><br />
                        <div className="tooltiprefer">
                          <span>moolya</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <span className="icon_bg"><span className="icon_lg fa fa-building-o"></span></span><br />
                        <div className="tooltiprefer">
                          <span>Office</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-8 att_members">
                  <ul className="users_list">
                    <li>
                      <a href="">
                        <img src="/images/p_3.jpg" /><br />
                        <div className="tooltiprefer">
                          <span>Venu<br/>Rs.3000</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <img src="/images/p_34.jpg" /><br />
                        <div className="tooltiprefer">
                          <span>Ramya<br/>Rs.5000</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <img src="/images/p_13.jpg" /><br />
                        <div className="tooltiprefer">
                          <span>Sameer<br/>Rs.8000</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <img src="/images/p_1.jpg" /><br />
                        <div className="tooltiprefer">
                          <span>Usha<br/>Rs.6000</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="form-group pull-left">
              <div className="input_types">
                <input id="radio6" type="radio" name="radio3" value="1"/><label htmlFor="radio6"><span><span></span></span>Make Public</label>
              </div>
              <div className="input_types">
                <input id="radio7" type="radio" name="radio3" value="2" defaultChecked/><label htmlFor="radio7"><span><span></span></span>Make Private</label>
              </div>
              <br className="brclear"/>
            </div>
            <div className="pull-right">
              <div className="ml_btn large_btn">
                <a href="" className="save_btn" style={{'width': 'auto'}}>Total Amount Rs.18,950.00/-</a>
              </div>
            </div>
            <br className="brclear"/>
            <div className="ml_btn btn_wrap">
              <a href="/app/calTaskDetails" className="save_btn">Start Task</a> <a href="" className="cancel_btn">Modify</a> <a href="" className="cancel_btn">Reschedule</a> <a href="" className="cancel_btn">Cancel</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
