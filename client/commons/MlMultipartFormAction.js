/**
 * Created by venkatasrinag on 21/2/17.
 */

import {progressbar,removeProgressbar} from '../commons/utils/progressbar';
export async function multipartFormHandler(data, file, endPoint) {
    // if(!file)
    //     return  false;

    let formdata = new FormData();
    formdata.append('data', JSON.stringify(data));
    if(file)
        formdata.append('file', file);

    const result = await new Promise(function (resolve, reject) {
        // Make ajax call
        let filexmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            filexmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            filexmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if(filexmlhttp){
            const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
            let serverEndPoint=endPoint?endPoint:Meteor.absoluteUrl('adminMultipartFormData');
            filexmlhttp.open('POST',serverEndPoint , true);
            filexmlhttp.setRequestHeader("enctype", "multipart/form-data");
            filexmlhttp.setRequestHeader('meteor-login-token',localStorageLoginToken);
            filexmlhttp.onreadystatechange = function() {
                if (filexmlhttp.readyState === 4 && filexmlhttp.status === 200) {
                    resolve(filexmlhttp.response);
                }
            }
            filexmlhttp.send(formdata)
        }
    })

    console.log(result)
    const id = result;
    // if(result.unAuthorized){
    //     FlowRouter.go('/unauthorize')
    // } //no use of this handling this on the receiving page only
    return JSON.parse(id)
}

export function multipartASyncFormHandler(data,file,endPoint,callback) {
  let formdata = new FormData();
  let imageOnly=false;
  if(data.imageOnly){
    imageOnly=true;
    delete data.imageOnly;
  }
    formdata.append('data', JSON.stringify(data));
  if(file)
    formdata.append('file', file);
    let fileSizeExceeded = file.size/1024/1024 > 10 ? true : false;
    if(imageOnly){
      if(!file.type || !(file.type).includes('image')){
        toastr.error('Invalid file type');
        callback('Invalid file type');
        return false;
      }
    }
    if(fileSizeExceeded) {
      callback('Maximum file size exceeded');
      return false;
    } else {
      // Make ajax call
      let filexmlhttp;
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        filexmlhttp = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        filexmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      if(filexmlhttp){
        const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
        let serverEndPoint=Meteor.absoluteUrl(endPoint)?Meteor.absoluteUrl(endPoint):Meteor.absoluteUrl('');
        filexmlhttp.open('POST',serverEndPoint , true);
        filexmlhttp.setRequestHeader("enctype", "multipart/form-data");
        filexmlhttp.setRequestHeader('meteor-login-token',localStorageLoginToken);

        filexmlhttp.addEventListener("load", function () {

          if (filexmlhttp.status < 400) {
            removeProgressbar(()=>{
              callback(filexmlhttp.response);
            });
          }
          else {
            callback({success:false,code:500,result:"error"});
          }
        });

        filexmlhttp.addEventListener("error", function () {
          callback({success:false,code:500,result:"error"});
        });

        filexmlhttp.addEventListener("abort", function () {
          callback({success:false,code:500,result:"error"});
        });



        filexmlhttp.onloadstart = start_progress;
        filexmlhttp.onprogress = update_progress;

        // filexmlhttp.addEventListener("progress", function (evt) {
        //   if (evt.lengthComputable) {
        //     var progress = Math.ceil(((upload.loaded + evt.loaded) / upload.total) * 100);
        //   }
        // }, false);

        /*filexmlhttp.onreadystatechange = function() {
         if (filexmlhttp.readyState === 4 && filexmlhttp.status === 200) {
         console.log(filexmlhttp.response);
         callback(filexmlhttp.response);
         }
         }*/

        filexmlhttp.send(formdata);
      }

    }
}

let update_progress=(e)=> {
  if (e.lengthComputable) {
    const percentage = Math.round((e.loaded/e.total)*100);
    progressbar(percentage);
  }
  else
    console.log("Unable to compute progress information since the total size is unknown");
}

let start_progress=(e)=>{
  progressbar(0);
  setTimeout(()=>{
    removeProgressbar(()=>{
      // callback({success:false,code:500,result:"error"});
    });
  },180000); //after 3min progressbar will expire and close
};
