/**
 * Created by Mukhil on 14/6/17.
 */

import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";
import MlTransactionsHandler from '../../commons/mlTransactionsLog';
var _ = require('lodash')

MlResolver.MlQueryResolver['fetchTasks'] = (obj, args, context, info) => {
  let query = {
    userId: context.userId,
    isCurrentVersion: true
  };
  if(args.profileId !== "all"){
    query.profileId = args.profileId;
  };
  let result = mlDBController.find('MlTask', query, context).fetch()
  return result;
}

MlResolver.MlQueryResolver['fetchTask'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlTask', {_id: args.taskId} , context);
  if (result) {
    let query = {
      transactionId: result.transactionId,
      isCurrentVersion: true
    };
    let task = mlDBController.findOne('MlTask', query, context);
    return task;
  } else  {
    let code = 404;
    let response = new MlRespPayload().successPayload('Task not found', code);
    return response;
  }
}

MlResolver.MlMutationResolver['createTask'] = (obj, args, context, info) => {
  if (args.taskDetails) {

    let name = args.taskDetails.name;
    let displayName = args.taskDetails.displayName;
    let profileId = args.taskDetails.profileId;
    let taskInfo = mlDBController.findOne('MlTask', { profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
    if(taskInfo) {
      let code = 400;
      let response;
      if(taskInfo.name == name){
        // response = new MlRespPayload().errorPayload('Activity already exists', code)
        response = new MlRespPayload().errorPayload('Task name already exists', code)
      } else {
        response = new MlRespPayload().errorPayload('Task display name already exists', code)
      }
      return response
    }

    orderNumberGenService.createTaskId(args.taskDetails);
    args.taskDetails.userId = context.userId;
    args.taskDetails.createdAt = new Date ();
    args.taskDetails.versions = 0.001;
    args.taskDetails.isCurrentVersion = true;
    let res = mlDBController.insert('MlTask', args.taskDetails, context)
    if (res) {
      new MlTransactionsHandler().recordTransaction({
        'fromUserId': context.userId,
        'moduleName': 'manageSchedule',
        'activity': 'Task-Created',
        'transactionType': 'manageSchedule',
        'userId': context.userId,
        'activityDocId': res,
        'docId': res,
        'transactionDetails': 'Task-Created',
        'context': context || {},
        'transactionTypeId': "manageSchedule",
        'fromUserType': 'user'
      });
      let code = 200;
      let result = res;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Data required', code);
    return response
  }
}

MlResolver.MlMutationResolver['updateTask'] = (obj, args, context, info) => {
  if(!_.isEmpty(args.taskDetails)){
    let oldTask = mlDBController.findOne('MlTask', {_id: args.taskId}, context);
    let task;
    if (oldTask) {
      let name = args.taskDetails.name;
      let displayName = args.taskDetails.displayName;
      let profileId = args.taskDetails.profileId;
      let taskInfo = mlDBController.findOne('MlTask', { transactionId:{$ne: oldTask.transactionId }, profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
      if(taskInfo) {
        let code = 400;
        let response;
        if(taskInfo.name == name){
          // response = new MlRespPayload().errorPayload('Activity already exists', code)
          response = new MlRespPayload().errorPayload('Activity name already exists', code)
        } else {
          response = new MlRespPayload().errorPayload('Activity display name already exists', code)
        }
        return response
      }

      let query = {
        transactionId: oldTask.transactionId,
        isCurrentVersion: true
      };
      task = mlDBController.findOne('MlTask', query, context);
    }
    if(task){
      if(!_.isEmpty(args.taskDetails.session)){
        let countSessionAry = []
        _.each(args.taskDetails.session,function (item,say) {   //attaching sessionId in session array
          if(!item.sessionId)
            orderNumberGenService.createSessionId(item);
          countSessionAry.push(item)
        })
        args.taskDetails.session = countSessionAry;
        let activity = _.map(args.taskDetails.session, 'activities')
        let act= []
        _.each(activity, function (item,say) {   //removing the empty array
          if(!_.isEmpty(item))
            act.push(item)
        })

        let costAry = [];
        let activitiesAmount = [];
        let activitiesDerivedAmount = [];
        _.each(act,function (item,say) {    //amount calculation based on activity
          let details = mlDBController.find('MlActivity',{_id:{$in:item}}, context).fetch()
          let amount = _.map(details, 'payment.amount');
          _.each(amount, function (i,s) {
            activitiesAmount.push(i ? i : 0);
          });
          let derivedAmount = _.map(details, 'payment.derivedAmount');
          _.each(derivedAmount, function (i,s) {
            activitiesDerivedAmount.push(i ? i : 0);
          });
        });
        let finalActivitiesAmount = _.sum(activitiesAmount);
        let finalActivitiesDerivedAmount = _.sum(activitiesDerivedAmount);
        let pick;
        if(args.taskDetails.payment)   //picking up the last details without amount
          pick = _.pick(args.taskDetails.payment, ['activitiesDerived', 'activitiesDiscount', 'activitiesAmount', 'isDiscount','discountType','discountValue', 'derivedAmount', 'currencyType'])
        else
          pick = _.pick(task.payment, ['isDiscount','discountType','discountValue', 'derivedAmount'])
        let paymentAmount = {
          activitiesAmount: finalActivitiesAmount,
          activitiesDiscount: parseFloat(finalActivitiesAmount - finalActivitiesDerivedAmount).round(2),
          activitiesDerived: finalActivitiesDerivedAmount,
          amount: finalActivitiesDerivedAmount,
          currencyType: args.taskDetails && args.taskDetails.payment && args.taskDetails.payment.currencyType ? args.taskDetails.payment.currencyType : ""
        };
        let newFinalAmount = finalActivitiesDerivedAmount;
        if (args.taskDetails.payment && args.taskDetails.payment.isDiscount && args.taskDetails.payment.discountValue > 0) {
          if (args.taskDetails.payment.discountType === 'amount') {
            newFinalAmount = parseFloat(finalActivitiesDerivedAmount).round(2) - parseFloat(args.taskDetails.payment.discountValue).round(2);
          } else {
            var newAmount = (parseFloat(finalActivitiesDerivedAmount).round(2) * parseFloat(args.taskDetails.payment.discountValue)/100).round(2);
            newFinalAmount = parseFloat(finalActivitiesDerivedAmount).round(2) - parseFloat(newAmount).round(2);
          }
        } else if (task.payment && task.payment.isDiscount && task.payment.discountValue > 0) {
          if (task.payment.discountType === 'amount') {
            newFinalAmount = parseFloat(finalActivitiesDerivedAmount).round(2) - parseFloat(task.payment.discountValue).round(2);
          } else {
            var newAmount = (parseFloat(finalActivitiesDerivedAmount).round(2) * parseFloat(task.payment.discountValue)/100).round(2);
            newFinalAmount = parseFloat(finalActivitiesDerivedAmount).round(2) - parseFloat(newAmount).round(2);
          }
        }
        paymentAmount = _.extend(paymentAmount, pick);
        paymentAmount['derivedAmount'] = newFinalAmount;
        args.taskDetails = _.extend(args.taskDetails, {payment:paymentAmount})
      }
      task.isCurrentVersion = false;
      let updatedOldVersionTask = mlDBController.update('MlTask', {_id: task._id}, task, {'$set':1}, context);
      new MlTransactionsHandler().recordTransaction({
        'fromUserId': context.userId,
        'moduleName': 'manageSchedule',
        'activity': 'Task-Updated',
        'transactionType': 'manageSchedule',
        'userId': context.userId,
        'activityDocId': task._id,
        'docId': task._id,
        'transactionDetails': 'Task-Updated',
        'context': context || {},
        'transactionTypeId': "manageSchedule",
        'fromUserType': 'user'
      });
      args.taskDetails.isCurrentVersion = true;
      args.taskDetails.userId = task.userId;
      // args.taskDetails.transactionId = task.transactionId;
      args.taskDetails.updatedAt = new Date();
      args.taskDetails.versions = task.versions + 0.001;
      args.taskDetails.attachments = (args.taskDetails.attachments && args.taskDetails.attachments.length > 0) ?
        args.taskDetails.attachments : task.attachments;
      for(key in task){
        if ((typeof args.taskDetails[key] === 'undefined' || args.taskDetails[key] === null) && key !== 'createdAt' && key !== '_id') {
          args.taskDetails[key] = task[key];
        }
      }
      let newVersionActivity = mlDBController.insert('MlTask', args.taskDetails , context);
      if (newVersionActivity) {
        let code = 200;
        let response = new MlRespPayload().successPayload('Successfully Updated', code);
        return response
      }
    }else {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Require a valid Task', code);
      return response
    }
  }else{
    let code = 400;
    let response = new MlRespPayload().errorPayload('Cannot save empty task', code);
    return response
  }


}

MlResolver.MlQueryResolver['fetchTaskDetails'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlTask', {_id:args.name}, context)
  return result;
};


MlResolver.MlQueryResolver['fetchTasksInBooking'] = (obj, args, context, info) => {
  let result = mlDBController.find('MlTask', {_id:{$in:args.id}}, context).fetch()
  return result;
};


MlResolver.MlQueryResolver['fetchTaskDetailsForServiceCard'] = (obj, args, context, info) => {
  let query;
  let orderId = args.orderId;
  if(args.profileId) {
    query = {
      userId: context.userId,
      profileId: args.profileId,
      isExternal: true,
      isActive: true,
      isServiceCardEligible: true
    };
  } else {
    query = {};
  }

  if (args.serviceId) {
    let service = mlDBController.findOne('MlServiceCardDefinition', args.serviceId , context);
    //console.log(service.tasks);
    let taskQuery = [];
    if (service.tasks && service.tasks.length > 0) {
      taskQuery = service.tasks.reduce(function(result, task) {
        return result.concat(task.id);
      }, []);
      taskQuery = _.uniq(taskQuery);
    }
    query["$or"] = [
      {_id: {'$in': taskQuery}}
    ];
    if(!orderId) {
      query["$or"].push ({'isCurrentVersion': true});
    }
  }
  let result = mlDBController.find('MlTask', query, context).fetch();
  //console.log('result',result);
  if (result && result.length > 0) {
    result.map((task, taskIndex) => {
      if (task.session && task.session.length > 0) {
        task.session.map((taskSession, sessionIndex) => {
          if(orderId) {
            let appointmentQuery = {
              isCancelled: false,
              'appointmentInfo.sessionId': taskSession.sessionId,
              'appointmentInfo.serviceOrderId': orderId
            };
            let appointment = mlDBController.findOne('MlAppointments', appointmentQuery );
            if(appointment){
              result[taskIndex]['session'][sessionIndex]['startDate'] = appointment.startDate;
              result[taskIndex]['session'][sessionIndex]['status'] = appointment.status;
              result[taskIndex]['session'][sessionIndex]['isRescheduled'] = appointment.isRescheduled;
            }
          }
          console.log('sessionId', taskSession.sessionId );
          if (taskSession.activities && taskSession.activities.length > 0) {
            taskSession.activities.map((activityId, index) => {
              if (activityId) {
                let activity = mlDBController.findOne('MlActivity', activityId , context);
                result[taskIndex]['session'][sessionIndex]['activities'][index] = activity;
              }
            })
          }
        });
      }
    });
  }
  return result;
};

MlResolver.MlQueryResolver['fetchTaskDetailsForAdminServiceCard'] = (obj, args, context, info) => {
  let query = {
    // userId: context.userId,
    isExternal: true,
    isActive: true,
    isServiceCardEligible: true
  };
  if (args.serviceId) {
    let service = mlDBController.findOne('MlServiceCardDefinition', args.serviceId , context);
    let taskQuery = [];
    if (service.tasks && service.tasks.length > 0) {
      taskQuery = service.tasks.reduce(function(result, task) {
        return result.concat(task.id);
      }, []);
      taskQuery = _.uniq(taskQuery);
    }
    query["$or"] = [
      {_id: {'$in': taskQuery}},
      {isCurrentVersion: true}
    ];
  }
  if(args.profileId){
    query.profileId = args.profileId;
  };
  let result = mlDBController.find('MlTask', query, context).fetch()
  if (result && result.length > 0) {
    result.map((task, taskIndex) => {
      if (task.session && task.session.length > 0) {
        task.session.map((taskSession, sessionIndex) => {
          if (taskSession.activities && taskSession.activities.length > 0) {
            taskSession.activities.map((activityId, index) => {
              if (activityId) {
                let activity = mlDBController.findOne('MlActivity', activityId , context);
                result[taskIndex]['session'][sessionIndex]['activities'][index] = activity;
              }
            })
          }
        });
      }
    });
  }
  return result;
};

MlResolver.MlQueryResolver['fetchTaskForApointment'] = (obj, args, context, info) => {
  console.log(args);
  if (args.taskId) {
    let result = mlDBController.findOne('MlTask', args.taskId, context);
    if (result) {
      if (result.session && result.session.length > 0) {
        result.session.map((taskSession, sessionIndex) => {
          if (taskSession.activities && taskSession.activities.length > 0) {
            taskSession.activities.map((activityId, index) => {
              if (activityId) {
                let activity = mlDBController.findOne('MlActivity', activityId, context);
                result['session'][sessionIndex]['activities'][index] = activity;
              }
            })
          }
        });
      }
    }
    return result;
  }
};

MlResolver.MlQueryResolver['fetchActivitiesTeams'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlTask', {_id: args.taskId} , context);
  if (result) {
    let session = result.session && result.session.filter((session) => { return session.sessionId === args.sessionId});
    let activityIds = session && session[0].activities;
    let activity = mlDBController.find('MlActivity', {_id: {$in: activityIds}}, context).fetch();
    return activity;
  } else  {
    let code = 404;
    let response = new MlRespPayload().errorPayload('Task not found', code);
    return response;
  }
};
