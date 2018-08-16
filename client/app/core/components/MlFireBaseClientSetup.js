'use strict';

import React, { Component } from 'react';
import firebase from 'firebase';
import {firbaseClientHandler} from '../../../commons/conversations/utils/mlConversationLoginQuery';
var config = {
    apiKey: "AIzaSyAl07yTqgLkUhNQA5NAfc6XEMjDSyQsMQk",
    authDomain: "fir-poc-c8c76.firebaseapp.com",
    databaseURL: "https://fir-poc-c8c76.firebaseio.com",
    projectId: "fir-poc-c8c76",
    storageBucket: "fir-poc-c8c76.appspot.com",
    messagingSenderId: "790772047633"
};
firebase.initializeApp(config); 
const messaging = firebase.messaging();
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

let startListener = ()=>{
  messaging.onMessage(function(payload) {
  console.log("Message received.******** ", payload);
  const notificationTitle = JSON.parse(payload.data.notification).title;
  const notificationOptions = {
    body: JSON.parse(payload.data.notification).body,
    icon: JSON.parse(payload.data.notification).icon,
    click_action: JSON.parse(payload.data.notification).click_action,
  };
  var notification = new Notification(notificationTitle,notificationOptions);
  notification.onclick = function(event) {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.open(notificationOptions.click_action , '_blank');
      notification.close();
  }
  });
}
 

let requestPermission=(loginType, callback)=> {
  console.log('Requesting permission...');
  messaging.requestPermission()
  .then(function() {
    console.log('Notification permission granted.');
    messaging.getToken()
      .then(function(currentToken) {
        if (currentToken) {
          switch(loginType){
          case 'LOGIN':
          firbaseClientHandler('userPushNotification', currentToken, true, function(res){
            console.log('response is: ',res);
          })
          //send to users collection (should update the db value always)
          //update isAllowedNotifications = true
          break;

          case 'LOGOUT':
          firbaseClientHandler('userPushNotification', currentToken, false, function(res){
            console.log('response is: ',res);
            callback();
          })
          //send to users collection (should update the db value always)
          //update isAllowedNotifications = false
          break;
          }
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
        }
      })
      .catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
      });
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify. ', err);
  });
}

let deleteToken = (cb) => {
  messaging.getToken()
  .then(function(currentToken) {
    messaging.deleteToken(currentToken)
    .then(function() {
      console.log('Token deleted.');
      requestPermission('LOGOUT', cb);
      // setTokenSentToServer(false);
    })
    .catch(function(err) {
      console.log('Unable to delete token. ', err);
    });
  })
  .catch(function(err) {
    console.log('Error retrieving Instance ID token. ', err);
    cb();
  });
}
export {requestPermission,deleteToken}
startListener();