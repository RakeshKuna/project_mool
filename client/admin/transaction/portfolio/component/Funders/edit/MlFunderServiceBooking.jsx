import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
// import InlineCalender from '../../../../app/views/inlineCalender';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import {fetchTasksInBookingActionHandler} from '../../../../../../app/calendar/manageScheduler/task/actions/fetchTaskDetails'
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import MlAppMyCalendarDayComponent from '../../../../../../app/calendar/myCalendar/components/dayComponent'

var _ = require('lodash');
import Calender from '../../../../../../commons/calendar/calendar'
import MlAppMyCalendar from './MlFunderServiceCalendar'
import {fetchServiceCalendarActionHandler} from '../../../../../../app/calendar/myCalendar/actions/fetchMyCalendar';
import {
  bookUserServiceCardActionHandler, userServiceCardPaymentActionHandler
} from '../../../../../../app/calendar/manageScheduler/service/actions/MlServiceActionHandler'

  ;
import moment from "moment";

export default class FunderAboutView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPaymentDetails: false,
      tasks: [],
      imagePreview: "",
      payment: false, calendarDetails: []

    }
    this.getTasks.bind(this);
    this.imageUpload.bind(this)
    this.imagesDisplay.bind(this);
    this.paymentDetails.bind(this);
  }

  componentDidMount() {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).parent().hasClass('nocolor-switch')) {

        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      } else {
        if ($(this).is(':checked')) {
          $(this).parent('.switch').addClass('on');
        } else {
          $(this).parent('.switch').removeClass('on');
        }
      }
    });

    $('.tab_wrap_scroll').height(WinHeight - ($('.app_header').outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".tab_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
    }
  }


  async bookUserServiceCard() {
    this.setState({showPaymentDetails: true})
    let taskDetails = this.state.taskDetails
    const response = await bookUserServiceCardActionHandler(this.props.serviceDetails._id, taskDetails)
    this.setState({orderId: response.result})
    // this.payment(this.state.orderId)
    return response;
  }

  payment() {
    let paymentDetails = {
      orderId: this.state.orderId,
      amount: this.props.serviceDetails.payment ? this.props.serviceDetails.payment.tasksDerived : 0,
      // data to be populated
      paymentId: "",
      paymentMethod: "",
      currencyCode: ""
    }
    this.paymentDetails(paymentDetails);
    let tasks = this.props.serviceDetails.tasks ? _.cloneDeep(this.props.serviceDetails.tasks) : [];
    let task = tasks && tasks.length ? tasks.sort((a, b) => {
      return a.sequence - b.sequence
    })[0] : null;
    let session = task && task.sessions && task.sessions.length ? task.sessions.sort((a, b) => {
      return a.sequence - b.sequence
    })[0] : null;
    if (task && session && session.isOffline !== true) {
      this.getServiceProviderDetails()
    } else {
      this.props.componentToView('landingPage');
    }
  }

  async getServiceProviderDetails() {
    let portfolioId = FlowRouter.getParam('portfolioId');
    const response = await fetchServiceCalendarActionHandler(portfolioId)
    this.setState({calendarDetails: response})
    return response
  }

  async paymentDetails(paymentDetails) {
    const response = await userServiceCardPaymentActionHandler(paymentDetails)
    if (response) {
      toastr.success('Payment processed successfully')
      this.setState({payment: true})
      return response
    }
  }

  componentWillMount() {
    let totalIds = [];
    // this.props.serviceDetails.tasks.map(function(ids){
    //   totalIds.push(ids.id)
    // })
    this.getTasks(totalIds)
  }

  async getTasks(data) {
    const resp = await fetchTasksInBookingActionHandler(data)
    this.setState({tasks: resp})
    return resp;
  }

  imageUpload(id, e) {
    let user = {
      profile: {
        InternalUprofile: {moolyaProfile: {profileImage: " "}}
      }
    };
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data = {moduleName: "PROFILE", actionName: "UPDATE", user: user};
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, id, file));
    return response;
  }


  onFileUploadCallBack(id, file, resp) {
    if (resp) {
      let result = JSON.parse(resp)
      if (result.success) {
        this.setState({imagePreview: result.result})
        let ImageObject = {
          fileName: file.name,
          fileUrl: result.result
        }
        this.imagesDisplay(id, this.state.imagePreview, ImageObject);
      }
    }
  }

  imagesDisplay(index, fileUrl, imageObject) {
    let tempTaskImages = this.state.tasks || []
    let taskImages = _.cloneDeep(tempTaskImages);
    taskImages.map(function (data, id) {
      if (id === index) {
        if (data.images) {
          data.images.push(fileUrl)
        } else {
          let image = []
          image.push(fileUrl)
          data.images = image
        }
      }

    })
    let taskDetails = []
    let images = []
    this.setState({tasks: taskImages})
    taskImages.map(function (data, index) {
      images.push(imageObject)
      let taskObject = {
        taskId: data._id,
        documents: images
      }
      taskDetails[index] = taskObject;
    })
    this.setState({taskDetails: taskDetails})
    this.assignTaskDetails(taskDetails)
  }

  assignTaskDetails(taskImages) {
    this.setState({taskDetails: taskImages})
  }

  render() {
    let tasks = this.state.tasks || []
    let that = this;
    console.log('serviceDetails', that.props.serviceDetails);
    let totalTasks = tasks.map(function (task, id) {
      return (
        <div>
          <div className="panel panel-default uploaded_files">
            <div className="panel-heading">
              {task.displayName}
              <div className="pull-right block_action">
                <div className="fileUpload upload_file_mask">
                </div>
              </div>
            </div>
          </div>
          <div className="panel panel-default uploaded_files">
            <div className="panel-heading">
              {task.displayName}
              <div className="pull-right block_action">
                <div className="fileUpload upload_file_mask">
                  <span className="ml ml-upload"></span>
                  <input type="file" className="upload_file upload" name="file_source"
                         onChange={that.imageUpload.bind(that, id)}/>
                </div>
              </div>
            </div>
            <div className="panel-body uploaded_files_swiper" key={id}>
              <ul className="swiper-wrapper">
                <li className="doc_card" data-toggle="tooltip" data-placement="bottom" title="File name">
                  {task.images ? task.images.map(function (image, id) {
                    return (<img src={image} style={{maxWidth: 150}}/>)
                  }) : ""}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    })
    return (
      !this.state.payment ?
        <div>
          <div className="col-md-6 nopadding-left">
            <div className="left_wrap">
              <ScrollArea
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}>
                <div className="form_bg">
                  <form>
                    <div className="panel panel-default uploaded_files">
                      <div className="panel-heading">
                        Order Summary
                      </div>
                    </div>
                    <div className="clearfix"/>
                    <br/>
                    <div className="panel panel-default uploaded_files">
                      <div className="panel-heading">
                        <label>Service Name : {that.props.serviceDetails.displayName}<span
                          className="ml ml-information"></span></label><br/>
                        <label>Validity
                          : {that.props.serviceDetails.validTill ? moment(that.props.serviceDetails.validTill).format(Meteor.settings.public.dateOnlyFormat) : ''}</label>
                      </div>
                    </div>
                    <br/>
                    {totalTasks}
                    <table className="table">
                      <thead>
                      <tr>
                        <th>
                          Cost
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>Actual Amount</td>
                        <td>: {that.props.serviceDetails.payment ? that.props.serviceDetails.payment.tasksDerived : 0}</td>
                      </tr>
                      <tr>
                        <td>Discount Amount</td>
                        <td>: {
                          that.props.serviceDetails.payment ?
                            that.props.serviceDetails.payment.discountType == "amount" ?
                              that.props.serviceDetails.payment.discountValue :
                              (that.props.serviceDetails.payment.tasksDerived / 100 * that.props.serviceDetails.payment.discountValue).toFixed(4)
                            : 0}</td>
                      </tr>
                      <tr>
                        <td>Facilitation charges</td>
                        <td>{that.props.serviceDetails.finalAmount && that.props.serviceDetails.payment ?
                          parseFloat(that.props.serviceDetails.finalAmount -
                            that.props.serviceDetails.payment.tasksDerived +
                            (that.props.serviceDetails.payment.discountType == "amount" ?
                              that.props.serviceDetails.payment.discountValue :
                              that.props.serviceDetails.payment.tasksDerived / 100 * that.props.serviceDetails.payment.discountValue)
                          ).toFixed(4)
                          : 0}</td>
                      </tr>
                      <tr>
                        <td>Total Amount</td>
                        <td>{that.props.serviceDetails.finalAmount ? that.props.serviceDetails.finalAmount : 0}</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          <div className="ml_btn" style={{'textAlign': 'left'}}>
                            <a href="" className="save_btn" onClick={that.bookUserServiceCard.bind(that)}>Book</a>
                            <a href="" className="cancel_btn"
                               onClick={() => that.props.componentToView('landingPage')}>Cancel</a>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </form>
                </div>
              </ScrollArea>
            </div>
          </div>
          {this.state.showPaymentDetails ? <div className="col-md-6 nopadding-right">
            <div className="left_wrap">
              <ScrollArea
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}>
                <div className="form_bg">
                  <form>
                    <div className="panel panel-default uploaded_files">
                      <div className="panel-heading">
                        Payment Mode
                      </div>
                    </div>
                    <h1>
                      <div className="ml_btn" style={{'textAlign': 'center'}}><a href="" className="save_btn"
                                                                                 onClick={this.payment.bind(this)}>Proceed</a>
                        <a href="" className="cancel_btn"
                           onClick={() => that.props.componentToView('landingPage')}>Cancel</a></div>
                    </h1>
                  </form>
                </div>
              </ScrollArea>
            </div>
          </div> : ""}
        </div> : <MlAppMyCalendar componentToView={this.props.componentToView} orderId={this.state.orderId}
                                  calendarDetails={this.state.calendarDetails}
                                  serviceDetails={this.props.serviceDetails}/>

    )
  }
};
