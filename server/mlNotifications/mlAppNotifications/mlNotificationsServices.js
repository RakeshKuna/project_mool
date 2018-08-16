/*-----------------------------------------------------------------------
 * @ file        : mlNotificationsServices.js
 * @ description : This is the Notifications service which will handle the Notifications CRUD.
 * @ author      : Duddukuri Mahesh
 * @ date        : 28/07/2017.
 -----------------------------------------------------------------------*/

/*--------------------------------------------
 * Include internal and external modules.
 ---------------------------------------------*/

import async from "async";

export default MlNotificationsServices = class MlNotificationsServices {

  // register new Alert.
  createNewAlert(params, context) {

    async.waterfall([
      cb => { // Function to save the Alerts Notification Object in DB.

        var saveObj = {

          "notif_msg":{"text": params.text},
          url: params.url || "",
          isProfileSpecific: params.isProfileSpecific || false,
          profileId: params.profileId || "",
          "resource_context":{"resourceId":params.resourceId,"resourceType": params.resourceType},
          "notif_type": params.notif_type,
          "from":{"userId":params.from_userId,"userName": params.from_userName},
          "to": {"userId":params.to_userId,"userName": params.to_userName},
          createdBy: params.createdBy,
          createdAt: new Date()
        };
        //MlNotifications(saveObj).save((err, res) => cb(err, { statusCode: 200, status: 'success', message: 'Notification saved successfully' }));
        //mlDBController.insert('MlNotifications', saveObj, context||{});
        MlNotifications.insert(saveObj);
      }

    ]);
  }

  // Update alert read status.
  updateNotifyStatus(params, context) {

    async.waterfall([
      (data, cb) => { // Update the read status of Alert Notification Object.
        let queryObj = {_id: params.alert_id};
        let updateObj = {updatedAt: new Date(), updatedBy: params.updatedBy};
        if (params.mode == 1) {
          updateObj.isRead = true;
        } else {
          updateObj.isDeleted = true;
        }
        ;
        MlNotifications.update(queryObj, {$set:updateObj});
       // mlDBController.update('MlNotifications', queryObj, updateObj, {$set: true}, context||{});
        //MlNotifications.findOneAndUpdate(queryObj, updateObj, { new: true }, (err, res) => cb(err, { statusCode: 200, status: 'success', message: 'Notification Updated successfully', data: res }));
      }

    ]);
  }

// fetch user Notifications.
  getUserAlerts(params, context) {

    async.waterfall([
      cb => { // Fetch the user Notifications list.
        let queryObj = {
          "to.userId": params.userId
        };
        //let projection = '_id url notif_type to.userId createdBy';
        //MlNotifications.find(queryObj, projection, (err, res) => cb(err, { statusCode: 200, status: 'success', message: 'Notifications fetched successfully.', data: res }));
      }
    ]);
  }

// fetch the Notifications with servier side pagination.
  fetchNotifiPagination(params, context) {

    params.obj1 = {
      $match: {
        $and: [
          {isDeleted: false},
          {"to.userId": params.userId}
        ]
      }
    };

    if (params.profileId) { // if profile Id is given.

      params.obj2 = {
        $match: {
          $or: [
            {isProfileSpecific: false},
            {isProfileSpecific: true, profileId: params.profileId}
          ]
        }
      };

    } else { // if profile Id not provided.

      params.obj2 = {
        $match: {isProfileSpecific: true}
      };
    }
    ;

    async.waterfall([

      /* cb => { // show the total number of notifications first time.
       if (params.pageNum == 1) {
       Utils.universal_fns.aggregate(Models.alerts, [params.obj1, params.obj2], (err, res) => {
       if (err) {
       cb(Utils.error_res.systemError)
       } else {
       params.totalCnt = res.length;
       cb(null, params);
       }
       });
       } else {
       cb(null, params);
       };
       },

       (data, cb) => { // Fetch the user Notifications list with server side pagination.

       let pipeline = [

       params.obj1, // select records based on the to user Id and isDeleted fields.
       params.obj2, // select records based on profilr id logic.
       {
       "$sort": { createdAt: 1 } // sort based on created date.
       },
       {
       "$skip": (params.pageNum * 50) - 50 // skip the records based on page num.
       },
       {
       "$limit": 50 // default resrecords are 50.
       },
       { // get only required fields.
       "$project": {
       _id: 1,
       notif_msg: 1,
       from: 1,
       to: 1,
       createdAt: 1,
       createdBy: 1,
       notif_type: 1
       }
       }
       ];

       MlNotifications.aggregate(pipeline, (err, res) => {
       if (err) {
       cb({ statusCode: 500, status: 'error', message: 'Technical error ! Please try again later.' });
       } else {
       if (params.pageNum == 1) {
       var result = {
       totalCnt: params.totalCnt,
       data: res
       };
       } else {
       var result = {
       data: res
       };
       }
       cb(null, { statusCode: 200, status: 'success', message: 'Notification fetched Successfully.', data: res });
       }
       });
       }*/

    ]);
  }

}
