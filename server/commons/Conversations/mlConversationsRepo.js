/**
 * Created by venkatsrinag on 8/21/17.
 */

import request from 'request'

class ConversationsRepo{
  constructor(){
  }

  login(context, cb)
  {
    var authRequest = {userId:context.userId};
    // var checkData = await this.testApi()
    // console.log('............', checkData)
    this.sendRequest('/login', authRequest, 'post' ,false,  function (res) {
      if(cb){
        cb(res);
      }
    });
  }
  // subscribe to conversations
  createApplication(cb){
    const that = this;
    var doc = MlConversations.find().fetch();
    if(doc.length > 0)
      return;

    var body = {appName:"moolya"}
    this.sendRequest('/createApplication', body, 'post', true, function (res) {
      console.log('Response',res);
      if(res.success){
        that.setApiKey(res.result.apiKey)
      }
      if(cb){
        cb(res);
      }

    });
  }

  createUser(moolyaUser, cb) {
    var user = {
      _id:moolyaUser.userId,
      username:moolyaUser.userName,
      email:moolyaUser.userName,
    }
    this.sendRequest('/createUser', user, 'post', false, function (res) {
      if(res.success && cb) {
        cb(res)
      }
    });
  }

  // save api key into mlconversations collection
  setApiKey(apiKey){
    MlConversations.insert({apiKey:apiKey, isActive:true})
  }

  // reterieve api key from mlConversations collection
  getApiKey(){
    var apiKey = null;
    var result = MlConversations.find().fetch();
    if(result.length > 0)
      apiKey = result[0].apiKey;

    return apiKey;
  }

  // Push Notifications to conversations server Notification types are email, sms, push
  async sendNotifications(notification){
    var ret = this.sendRequest('/createNotification', notification, 'post', false);
    return ret;
  }

  createNotifications(notification, cb){
    this.sendRequest('/createNotification', notification, 'post', false, function (res) {
      if(cb){
        cb(res);
      }
    });
  }

  // sendRequest(endPoint, payload, method, isApplication, cb){
  //   var options = {
  //     url: Meteor.settings.private.notificationEngineURL+'/sms/send',
  //     body:payload,
  //     method: method,
  //     json: true
  //   };

  //   console.log('request end point', options.url);
  //   if(!isApplication){
  //     var apiKey = this.getApiKey();
  //     if(!apiKey)
  //       return {success:false}
  //     options['headers'] = {
  //       'x-api-key': apiKey
  //     }
  //   }
  //   options['headers'].accesskey = Meteor.settings.private.notificationEngineAccessKey;
  //   console.log('Options',options);

  //   new Promise(function (resolve, reject) {
  //     request(options, function (err, res, body) {
  //       if(err){
  //         console.log('Error',err);
  //         reject(err)
  //       }

  //       else{
  //         resolve(body)
  //       }
  //     })
  //   }).then((body) => {
  //     if(cb) {
  //       cb(body);
  //     }
  //   });
  // }

  // sendRequestDeprecated(endPoint, payload, method, isApplication, cb){
    sendRequest(endPoint, payload, method, isApplication, cb){
    var options = {
      url: Meteor.settings.private.conversationsBaseURL+endPoint,
      body:payload,
      method: method,
      json: true
    };

    console.log('request end point', Meteor.settings.private.conversationsBaseURL + endPoint);
    if(!isApplication){
      var apiKey = this.getApiKey();
      if(!apiKey)
        return {success:false}
      options['headers'] = {
        'x-api-key': apiKey
      }
    }

    new Promise(function (resolve, reject) {
      request(options, function (err, res, body) {
        if(err){
          reject(err)
        }

        else{
          resolve(body)
        }
      })
    }).then((body) => {
      if(cb) {
        cb(body);
      }
    });
  }

  /*  async testApi(){
      var options = {
        url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJKxSwWSZgAUgR0tWM0zAkZBc&key=AIzaSyC53qhhXAmPOsxc34WManoorp7SVN_Qezo"
      }

      const result = await new Promise(function (resolve, reject) {
        request(options, function (err, res, body) {
          if(err){
            reject(err)
          }
          else{
            resolve(body)
          }
        })
      })
      return result;
    }*/
}

const mlConversationsRepo = new ConversationsRepo();
export default mlConversationsRepo;
