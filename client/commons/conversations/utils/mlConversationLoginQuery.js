/**
 * Created by venkatsrinag on 8/21/17.
 */
import gql from 'graphql-tag'


// export async function loginHandler(moolyaClient) {
//   const result = await moolyaClient.query({
//     query: gql`
//         fetchConversationAuthToken{
//             success,
//             code,
//             result
//         }
//     `
//   })
//
//   const ret = result.data.fetchConversationAuthToken;
//   return ret;
// }
/**
 * Note: Function to be used for all the post request from the client
 *      [auth_token, build_version]
 * */
export function loginHandler(endPoint, cb) {
  new Promise(function (resolve, reject) {
    // Make ajax call
    let xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if(xmlhttp) {
      const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
      let serverEndPoint=Meteor.absoluteUrl(endPoint);
      xmlhttp.open('POST', serverEndPoint, true);
      xmlhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
      xmlhttp.setRequestHeader('meteor-login-token', localStorageLoginToken);
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          var response = JSON.parse(xmlhttp.response)
          if(response.success)
            resolve(xmlhttp.response);
          else
            reject(xmlhttp.response);
        }
      };
      xmlhttp.send()
    }
  }).then(result=>{
    if(cb) {
      cb(JSON.parse(result));
    }
  });
}

export function firbaseClientHandler(endPoint, token, isAllowedNotifications, cb) {
  new Promise(function (resolve, reject) {
    let xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if(xmlhttp) {
      const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
      let serverEndPoint=Meteor.absoluteUrl(endPoint);
      xmlhttp.open('POST', serverEndPoint, true);
      xmlhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
      xmlhttp.setRequestHeader('meteor-login-token', localStorageLoginToken);
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          var response = JSON.parse(xmlhttp.response)
          if(response.success)
            resolve(xmlhttp.response);
          else
            reject(xmlhttp.response);
        }
      };
      xmlhttp.send(
      JSON.stringify({
        firebaseId: token,
        isAllowedNotifications: isAllowedNotifications
      }));
    }
  }).then(result=>{
    if(cb) {
      cb(result);
    }
  });
}
