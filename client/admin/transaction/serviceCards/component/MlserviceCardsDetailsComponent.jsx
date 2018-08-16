/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the expanded component described in detail
 * JavaScript XML file MlServiceCardsDetailsComponent.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React from "react";
import {initalizeFloatLabel,OnToggleSwitch} from "../../../utils/formElemUtil";
import MlServiceManageSchedule from '../component/MlServicesComponent'
import _ from "lodash";
import moment from "moment";
import {
  getServiceBasedOnServiceId,
  fetchTaskDetailsForAdminServiceCard} from '../actions/mlFindService'
import {getAdminUserContext} from '../../../../commons/getAdminUserContext'
var FontAwesome = require('react-fontawesome');

export default class MlServiceCardsDetailsComponent extends React.Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */

  constructor(props){
    super(props);
    this.state = {
      data: {
        finalAmount: 0,
        prevFinalAmount: 0,
        serviceBasicInfo: {
          duration: {}
        },
        serviceTask: {
          selectedTaskDetails: {
            displayName: '',
            noOfSession: '',
            sessionFrequency: '',
            duration: {
              hours: 0,
              minutes: 0
            }
          }
        },
        service: {},
        serviceTermAndCondition: {},
        attachments: [],
        servicePayment: {},
        facilitationCharge: {},
        tasks: [],
        taxStatus: 'taxexclusive',
        clusterData: {},
        isLoding: false
      }
    };
    this.options = [
      {value: 'Weekly', label: 'Weekly'},
      {value: 'Daily', label: 'Daily'},
      {value: 'Monthly', label: 'Monthly'}
    ];
    this.profileId = this.props.data.profileId;
    this.serviceId = this.props.data._id;
    this.getServiceDetails = this.getServiceDetails.bind(this);
    this.constructServiceData = this.constructServiceData.bind(this);
  }
  /**
   * ComponentDidMount
   * Desc :: Initializing the float labels
   */

  componentDidMount() {
    initalizeFloatLabel();
    this.getServiceDetails();
  }

  /**
   * componentDidUpdate
   * Desc :: Updating the toggle switch
   */

  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }

  /**
   * componentWillMount
   * Desc :: Calls getServiceDetails with profileId as param
   */
  componentWillMount() {
    this.loggedUserDetails = getAdminUserContext();
  }

  /**
   * Method :: getServiceDetails
   * Desc   :: Get the service details based on the profileId
   * @param :: profileId - type : String
   * @returns resp
   */

 async getServiceDetails() {
    let resp = await getServiceBasedOnServiceId(this.serviceId, this.loggedUserDetails);
    if (resp) {
      this.constructServiceData(resp);
    }
  }

  /**
   * Method :: constructServiceData
   * Desc   :: construct the current service details from server and set in state
   * @returns Void
   */
  async constructServiceData(serviceDeatails) {
    let {serviceBasicInfo, finalAmount, prevFinalAmount, clusterData, serviceTask, service, tasks, serviceTermAndCondition, attachments, servicePayment, taxStatus, facilitationCharge} = this.state.data;
    let {data} = this.state;
    const resp = await fetchTaskDetailsForAdminServiceCard(this.profileId, this.serviceId, this.loggedUserDetails);
    serviceTask.serviceTaskDetails = resp;
    if (this.serviceId && serviceDeatails) {
      service = serviceDeatails;
      tasks = [];
      let {state, city, community} = service;
      finalAmount = service.finalAmount || 0;
      prevFinalAmount = service.finalAmount || 0;
      serviceBasicInfo = {
        duration: service.duration,
        profileId: service.profileId,
        name: service.name,
        serviceExpiry:service.serviceExpiry||'',
        displayName: service.displayName,
        noOfSession: service.noOfSession,
        sessionFrequency: service.sessionFrequency,
        status: service.status,
        validTill: service.validTill,
        cluster: service.cluster,
        isBeSpoke: service.isBeSpoke,
        isApproved: service.isApproved,
        city: service.city,
        state: service.state,
        community: service.community
      };
      tasks = _.cloneDeep(service.tasks) || [];
      tasks.sessions = _.cloneDeep(service.tasks.sessions) || [];
      serviceTask.serviceOptionTasks = [];
      let attachmentDetails = [];
      serviceTask.tasks = service.tasks || [];
      if (serviceTask.serviceTaskDetails && serviceTask.serviceTaskDetails.length > 0) {
        serviceTask.tasks = _.intersectionBy(serviceTask.serviceTaskDetails, service.tasks, 'id');
        serviceTask.serviceTaskDetails.forEach((task, key) => {
          if (service.tasks.map((data) => data.id).indexOf(task.id) === -1) {
            serviceTask.serviceOptionTasks.push(task);
          }
        });
        serviceTask.tasks.forEach((task) => {
          if (task.attachments && task.attachments.length > 0) {
            task.attachments.forEach((attachment) => {
              attachmentDetails.push(attachment)
            });
          }
        });
      }
      if (service.termsAndCondition) {
        serviceTermAndCondition = _.omit(service.termsAndCondition, '__typename');
      }
      if (service.facilitationCharge) {
        facilitationCharge = _.cloneDeep(service.facilitationCharge);
      }
      if (service.payment) {
        servicePayment = _.cloneDeep(service.payment);
        servicePayment.isTaxInclusive = servicePayment.isTaxInclusive ? true : false;
        taxStatus = servicePayment.isTaxInclusive ? 'taxinclusive' : 'taxexclusive';
      }
      attachments = _.cloneDeep(attachmentDetails);
      if (state && state.length > 0) {
        let states = [];
        state.forEach((data) => {
          states.push(data.id);
        });
        clusterData.state = states;
      }
      if (city && city.length > 0) {
        let cities = [];
        city.forEach((data) => {
          cities.push(data.id);
        });
        clusterData.chapters = cities;
      }
      if (community && community.length > 0) {
        let communities = [];
        community.forEach((data) => {
          communities.push(data.id);
        });
        clusterData.community = communities;
      }
    }
    var validTillDate = Date.parse(serviceBasicInfo.validTill);
    var currentDate = new Date();
    let remainingDate = Math.floor((validTillDate - currentDate) / (1000 * 60 * 60 * 24));
    remainingDate = isNaN(remainingDate) ? '' : remainingDate;
    data = {
      serviceBasicInfo: serviceBasicInfo,
      // daysRemaining: remainingDate,
      daysRemaining:serviceBasicInfo.serviceExpiry,
      clusterData: clusterData,
      serviceTask: serviceTask,
      serviceTermAndCondition: serviceTermAndCondition,
      attachments: attachments,
      service: service,
      tasks: tasks,
      facilitationCharge: facilitationCharge,
      servicePayment: servicePayment,
      taxStatus: taxStatus,
      isLoding: true,
      finalAmount: finalAmount,
      prevFinalAmount: prevFinalAmount,
      userDetails: _.cloneDeep(this.props.data.userDetails)
    };
    this.setState({data: data});
    return;
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */

  render() {
    let that = this;
    if (!this.state.data.isLoding) {
      return null;
    }
    return (
      <div className="ml_tabs">
        <ul  className="nav nav-pills">
          <li className="active">
            <a  href={`#customerDetails${that.props.data._id}`} data-toggle="tab">Customer Details</a>
          </li>
          <li>
            <a href={`#processSetup${that.props.data._id}`} data-toggle="tab">Activity Details</a>
          </li>
          <li>
            <a  href={`#deviceDetails${that.props.data._id}`} data-toggle="tab">Device Details</a>
          </li>
          <li>
            <a  href={`#history${that.props.data._id}`} data-toggle="tab">History</a>
          </li>
          <li>
            <a  href={`#notes${that.props.data._id}`} data-toggle="tab">Notes</a>
          </li>
        </ul>
        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`customerDetails${that.props.data._id}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={that.props.data.profileId} className="form-control float-label" readOnly="true"/>
                </div>
                <div className="form-group ">
                  <input type="text" placeholder="Transaction Id" value={that.props.data.transactionId} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" value={that.props.data.createdAt ? moment(that.props.data.createdAt).format(Meteor.settings.public.dateFormat) : ''} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="clearfix"></div>
                <div className="form-group">
                  <input type="text" placeholder="Name" value={that.props.data.name} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email" value={that.props.data.email} className="form-control float-label"  readOnly="true"/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Phone Number" value={that.props.data.userDetails.mobileNumber} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={that.props.data.userDetails.clusterName} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={that.props.data.userDetails.chapterName} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={that.props.data.userDetails.subChapterName} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={that.props.data.userDetails.communityName} className="form-control float-label"  readOnly="true"/>
                </div>
                 <br className="clearfix" />
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`processSetup${that.props.data._id}`}>
            <div className="panel panel-default">
              <MlServiceManageSchedule data={this.state.data}
                                       profileId={this.profileId} userId={this.props.data.userId}
                                       serviceId={this.serviceId} 
                                       loggedUserDetails={this.loggedUserDetails} />
            </div>
          </div>
          <div className="tab-pane" id={`deviceDetails${that.props.data._id}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device Name" value={that.props.data.deviceDetails&&that.props.data.deviceDetails.deviceName?that.props.data.deviceDetails.deviceName:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group ">
                  <input type="text" placeholder="Device Id" value={that.props.data.deviceDetails&&that.props.data.deviceDetails.deviceId?that.props.data.deviceDetails.deviceId:""} className="form-control float-label" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="IP Address" value={that.props.data.deviceDetails&&that.props.data.deviceDetails.ipAddress?that.props.data.deviceDetails.ipAddress:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location" value={that.props.data.deviceDetails&&that.props.data.deviceDetails.location?that.props.data.deviceDetails.location:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <br className="clearfix" />
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`notes${this.props.data._id}`}>
            <div className="row">
              <div className="col-md-9">
                <div className="form-group">
                  <textarea placeholder="Notes"  className="form-control float-label" id=""></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



