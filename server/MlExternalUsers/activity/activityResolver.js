/**
 * Created by Mukhil on 14/6/17.
 */

import MlResolver from '../../commons/mlResolverDef'
import MlRespPayload from '../../commons/mlPayload'
import MlTransactionsHandler from '../../commons/mlTransactionsLog';
import MlUserContext from '../../MlExternalUsers/mlUserContext'
var _ = require('lodash')

MlResolver.MlQueryResolver['fetchActivities'] = (obj, args, context, info) => {
  if(args.profileId === "all" ) {
   var query = {userId: context.userId, isCurrentVersion: true};
  } else {
    var query = {userId:context.userId, profileId: args.profileId, isCurrentVersion: true
    };
  }
  if(args.isInternal || args.isExternal){
    let typeQuery = _.pickBy(args, _.isBoolean)
    query = _.extend(query, typeQuery)
  }
  let result = mlDBController.find('MlActivity', query , context).fetch()

  return result;
};
//
// MlResolver.MlQueryResolver['getTeamMembers'] = (obj, args, context, info) => {
// let temp = [];
// let temp1 = [];
//   let result = mlDBController.find('MlOffice', {userId:context.userId} , context).fetch()
//
//   result.map(function(communities){
//     communities.availableCommunities.id = communities._id
//     temp.push(communities.availableCommunities)
//   })
//   temp.map(function(community){
//     community.map(function(attributes){
//       attributes.id = community.id
//       temp1.push(attributes)
//     })
//   })
//
//   return temp1
// }
//
// MlResolver.MlQueryResolver['getTeamUsers'] = (obj, args, context, info) => {
//
//   let result = mlDBController.find('MlOfficeMembers', {userId:context.userId, officeId:args.Attributes.officeId, communityType:args.Attributes.communityType} , context).fetch()
//   return result;
// }
//
// MlResolver.MlQueryResolver['getBranchDetails'] = (obj, args, context, info) => {
//
//   let result = mlDBController.find('MlOffice', {userId:context.userId} , context).fetch()
//   return result;
// }

MlResolver.MlQueryResolver['fetchActivity'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlActivity', {_id: args.activityId} , context);
  if (result) {
    let query = {
      transactionId: result.transactionId,
      isCurrentVersion: true
    };
    let activity = mlDBController.findOne('MlActivity', query, context);
    return activity;
  } else  {
    let code = 404;
    let response = new MlRespPayload().successPayload('Activity not found', code);
    return response;
  }
};

MlResolver.MlMutationResolver['createActivity'] = (obj, args, context, info) => {
  if (args.Details) {
    let name = args.Details.name;
    let displayName = args.Details.displayName;
    let profileId = args.Details.profileId;
    let activity = mlDBController.findOne('MlActivity', { profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
    if(activity) {
      let code = 400;
      let response;
      if(activity.name == name){
        // response = new MlRespPayload().errorPayload('Activity already exists', code)
        response = new MlRespPayload().errorPayload('Activity name already exists', code)
      } else {
       response = new MlRespPayload().errorPayload('Activity display name already exists', code)
      }
      return response
    }

    args.Details.userId = context.userId;
    args.Details.isCurrentVersion = true;
    args.Details.createdAt = new Date();
    args.Details.versions = 0.001;
    orderNumberGenService.createActivityId(args.Details);
    let result = mlDBController.insert('MlActivity', args.Details , context)
    if(result){
      new MlTransactionsHandler().recordTransaction({
        'fromUserId': context.userId,
        'moduleName': 'manageSchedule',
        'activity': 'Activity-Created',
        'transactionType': 'manageSchedule',
        'userId': context.userId,
        'activityDocId': result,
        'docId': result,
        'transactionDetails': 'Activity-Created',
        'context': context || {},
        'transactionTypeId': "manageSchedule",
        'fromUserType': 'user'
      });
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Data required', code);
    return response
  }
}

MlResolver.MlMutationResolver['updateActivity'] = (obj, args, context, info) => {
  let oldVersionActivity = mlDBController.findOne('MlActivity', {_id: args.activityId}, context);
  let oldActiveActivity;
  if (oldVersionActivity) {
    let query = {
      transactionId: oldVersionActivity.transactionId,
      isCurrentVersion: true
    };
    oldActiveActivity = mlDBController.findOne('MlActivity', query, context);
  }
  if (oldActiveActivity) {
    /*let activity = _.omit(oldActiveActivity, 'payment');
    if (!args.Details.teams) {
      args.Details.teams = _.cloneDeep(oldActiveActivity.teams)
    } else if (args.Details.teams) {
      //activity = _.omit(oldActiveActivity, 'teams');
      activity.teams = args.Details.teams;
      //args.Details = _.cloneDeep(activity);
    }
    if (!args.Details.payment) {
      args.Details.payment = _.cloneDeep(oldActiveActivity.payment)
    } else if (args.Details.payment) {
      //activity = _.omit(oldActiveActivity, 'payment');
      activity.payment = args.Details.payment;
      //args.Details = _.cloneDeep(activity);
    }
    args.Details = _.cloneDeep(activity); */

    let name = args.Details.name;
    let displayName = args.Details.displayName;
    let profileId = args.Details.profileId;
    let activity = mlDBController.findOne('MlActivity', { transactionId:{$ne: oldActiveActivity.transactionId }, profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
    if(activity) {
      let code = 400;
      let response;
      if(activity.name == name){
        // response = new MlRespPayload().errorPayload('Activity already exists', code)
        response = new MlRespPayload().errorPayload('Activity name already exists', code)
      } else {
        response = new MlRespPayload().errorPayload('Activity display name already exists', code)
      }
      return response
    }

    oldActiveActivity.isCurrentVersion = false;
    let updatedOldVersionActivity = mlDBController.update('MlActivity', {_id: oldActiveActivity._id}, oldActiveActivity, {'$set':1}, context);
    new MlTransactionsHandler().recordTransaction({
      'fromUserId': context.userId,
      'moduleName': 'manageSchedule',
      'activity': 'Activity-Updated',
      'transactionType': 'manageSchedule',
      'userId': context.userId,
      'activityDocId': updatedOldVersionActivity,
      'docId': updatedOldVersionActivity,
      'transactionDetails': 'Activity-Updated',
      'context': context || {},
      'transactionTypeId': "manageSchedule",
      'fromUserType': 'user'
    });
    args.Details.isCurrentVersion = true;
    args.Details.userId = oldActiveActivity.userId
    args.Details.updatedAt = new Date();
    args.Details.transactionId = oldActiveActivity.transactionId;
    args.Details.versions = oldActiveActivity.versions + 0.001;
    for(key in oldActiveActivity){
      if ((typeof args.Details[key] === 'undefined' || args.Details[key] === null) && key !== 'createdAt' && key !== '_id') {
        args.Details[key] = oldActiveActivity[key];
      }
    }
    let newVersionActivity = mlDBController.insert('MlActivity', args.Details , context);
    if(newVersionActivity){
      new MlTransactionsHandler().recordTransaction({
        'fromUserId': context.userId,
        'moduleName': 'manageSchedule',
        'activity': 'Activity-Created',
        'transactionType': 'manageSchedule',
        'userId': context.userId,
        'activityDocId': newVersionActivity,
        'docId': newVersionActivity,
        'transactionDetails': 'Activity-Created',
        'context': context || {},
        'transactionTypeId': "manageSchedule",
        'fromUserType': 'user'
      });
      let code = 200;
      let result = newVersionActivity
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    let code = 404;
    let response = new MlRespPayload().errorPayload('Activity not found', code);
    return response
  }
}

MlResolver.MlQueryResolver['fetchActivitiesForTask'] = (obj, args, context, info) => {
  if(!args.taskId){
    let code = 400;
    let response = new MlRespPayload().errorPayload("Task id is required", code);
    return response;
  }

  let oldVersionTask = mlDBController.findOne('MlTask', {_id: args.taskId}, context);

  let taskQuery = {
    transactionId: oldVersionTask.transactionId,
    isCurrentVersion: true
  };
  let task = mlDBController.findOne('MlTask', taskQuery, context);

  let sessionQuery = [];
  if (task.session && task.session.length > 0) {
    sessionQuery = task.session.reduce(function(result, session) {
      return result.concat(session.activities);
    }, []);
  }
  sessionQuery = _.uniq(sessionQuery);

  let query = {
    userId:context.userId,
    profileId: task.profileId,
    isActive: true,
    $and:[{
      $or: [
        {_id: {'$in': sessionQuery}},
        {isCurrentVersion: true}
      ]
    }]
  }

  if( task.isInternal && !task.isExternal && !task.isServiceCardEligible ) {
    query.isInternal = true;
    query.isServiceCardEligible = false;
  } else if ( !task.isInternal && task.isExternal && !task.isServiceCardEligible ) {
    query.isExternal = true;
    query.isServiceCardEligible = false;
  } else if ( task.isInternal && task.isExternal && !task.isServiceCardEligible ) {
    query["$and"].push({
      $or: [
        {isInternal: true},
        {isExternal: true}
      ]
    });
    query.isServiceCardEligible = false;
  } else if ( !task.isInternal && task.isExternal && task.isServiceCardEligible ) {
    query.isExternal = true;
    query.isServiceCardEligible = true;
  } else if ( task.isInternal && task.isExternal && task.isServiceCardEligible ) {
    query["$and"].push({
      $or: [
        {isInternal: true},
        {isExternal: true}
      ]
    });
    query.isServiceCardEligible = true;
  }

  let result = mlDBController.find('MlActivity', query , context).fetch()

  return result;
}
