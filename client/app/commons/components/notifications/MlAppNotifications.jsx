/**
 * Created by vishwadeep on 23/8/17.
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { getNotifications } from '../../actions/fetchUserDetails';

export default class MlAppNotifications extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { loading: false, notifications: [], notificationCount: true };
    this.appNotifications.bind(this);
    this.getsubNotificationIcon = this.getsubNotificationIcon.bind(this);
    this.clearAllNotifications = this.clearAllNotifications.bind(this);
    return this;
  }

  componentWillMount() {
    getNotifications(this.appNotifications.bind(this));
  }

  componentDidlMount() {
    console.log(this.props, 'props here...');
  }

  appNotifications(response) {
    const that = this;
    if (response && response.success) {
      that.setState({ notifications: response.result });
    }
    // console.log('-------notifications data is---------',response)
  }


  clearAllNotifications() {
    // Make ajax call
    let xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (xmlhttp) {
      const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
      const serverEndPoint = `${Meteor.settings.public.conversationsBaseURL}/clearAllNotifications`;
    // const serverEndPoint = 'http://localhost:8081/clearAllNotifications';

      xmlhttp.open('POST', serverEndPoint, true);
      xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xmlhttp.setRequestHeader('meteor-login-token', localStorageLoginToken);
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          const response = JSON.parse(xmlhttp.response);
          console.log(response);
        }
      };
      const user = {};
      user.userId = Meteor.userId();
      xmlhttp.send(JSON.stringify(user));
      this.setState({ notificationCount: false });
      this.setState({ notifications: [] });
    }
  }


  getsubNotificationIcon(subNotificationType) {
    // define the notificationTypes and their corresponding classes in their respective arrays, ensure the order

    const notificationTypeArray = ['connectionRequestReceived', 'connectionRequestSent', 'enquiryRequestRecieved', 'reviewRecieved', 'newUserCreation', 'kycApprove', 'kycDecline', 'portfolioUpdate', 'goLiveRequest', 'goLiveRequestApproval', 'goLiveRequestDecline', 'userApproval'];
    const classNames = ['ml my-ml-connection_request_recvd', 'ml my-ml-connection_request_sent', 'ml my-ml-enquiry_request', 'ml my-ml-review_recvd', 'ml my-ml-add_user', 'ml my-ml-kyc_approve', 'ml my-ml-kyc_decline', 'ml my-ml-portfolio_update', 'ml my-ml-go_live_request', 'ml my-ml-go_live_request_approved', 'ml my-ml-go_live_request_declined', 'ml my-ml-approve_user'];
    const index = notificationTypeArray.indexOf(subNotificationType);
    if (index === -1 || !classNames[index]) {
      return 'ml ml-moolya-symbol';
    }
    return classNames[index];
  }

  render() {
    const { notifications } = this.state;
    const notificationAry = notifications && notifications.length ? notifications : [];
    const notificationsList2 = <p> No Unread Notifications </p>;
    let notificationsList1 = notificationAry.map((options, key) => (
        <li key={key}>
          <a href="/app/calendar/notification"><span className={this.getsubNotificationIcon(options.subNotificationType)}/>{options.message}</a>
        </li>));
    let counter = 0;
    for (let i = 0; i < notificationAry.length; i++) {
      if (notificationAry[i].isRead === false) {
        counter += 1;
      }
    }
    if (counter === 0) {
      notificationsList1 = notificationsList2;
    }


    return <div className="ml_app_notification"> <ul className="unstyled"> <span className="clear_all" onClick={this.clearAllNotifications}>Clear All</span>
{this.state.notificationCount ? notificationsList1 : notificationsList2 }</ul></div>;
  }
}
