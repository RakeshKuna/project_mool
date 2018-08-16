import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');

export default class CalendarSlotDetail extends React.Component{
  constructor(props){
    super(props)
    this.getSlotDetailView.bind(this);
  }
  componentDidMount() {
    $(function() {
      $('.float-label').jvFloat();
    });

    var WinWidth = $(window).width();
    if(WinWidth > 768){
      $(".app_main_wrap").mCustomScrollbar({theme:"minimal-dark"});
    }

  }

  clickHandlers(type){
    this.props.componentToLoad(type)
  }
  getSlotDetailView() {
    const {slotDetailInfo} =  this.props;
    let view = slotDetailInfo.map(function(data, index) {
      return(

          <div className="col-md-6" key={index}>
            <div className="panel panel-default cal_view_task pending">
              <div className="panel-heading">{data && data.userCommunityName ? data.userCommunityName[0] : ""}<span className="pull-right">Status : <b className="status">{data.status}</b></span></div>
              <div className="panel-body">
                <div className="col-md-12 nopadding">
                  <div className="col-md-3 nopadding text-center">
                    <img src={data.userImage?data.userImage:'/images/img2.png'} className="image" />
                  </div>
                  <div className="col-md-9">
                    <br />
                    <div className="form-group">
                      <input type="text" placeholder="Task Type" defaultValue={data.appointmentType} className="form-control float-label" id="" disabled/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Task Name" defaultValue={data.taskName} className="form-control float-label" id="" disabled/>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 nopadding att_members" >
                  <ul className="users_list">
                    {data.attendeeDetails?data.attendeeDetails.map(function(info){
                      return(
                        <li>
                          <a href="">
                            <img src={info.profileImage? info.profileImage : "/images/img2.png"}/><br />
                            <div className="tooltiprefer">
                              <span>{`${info.firstName} ${info.lastName}`}</span>
                            </div>
                          </a>
                        </li>
                      )
                    }):<div></div>}
                  </ul>
                </div>
                {/*<div className="col-md-12 nopadding">*/}
                  {/*<div className="ml_btn">*/}
                    {/*<a href="" id="save_contact" className="save_btn">Call</a>*/}
                    {/*<a href="" id="cancel_contact" className="cancel_btn" onClick={this.clickHandlers.bind(this, 'appointmentDetails')}>View</a>*/}
                  {/*</div>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>

      )
    })
    return view;
  }

  render(){
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12"></div>
          {this.getSlotDetailView()}
        </div>
       </div>
    )
  }
};
