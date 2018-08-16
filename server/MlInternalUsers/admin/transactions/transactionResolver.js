import MlResolver from "../../../commons/mlResolverDef";
import MlRespPayload from "../../../commons/mlPayload";
import mlTransactionsListRepo from './mlTransactionsListRepo';
import mlHierarchyAssignment from '../../admin/genericTransactions/impl/MlHierarchyAssignment'
import MlAdminContextQueryConstructor from '../../admin/core/repository/mlAdminContextQueryConstructor'
import _ from "underscore";
import _lodash from 'lodash'
import MlStatusRepo from '../../../../server/commons/mlStatus'
import MlEmailNotification from '../../../mlNotifications/mlEmailNotifications/mlEMailNotification'
import MlSMSNotification from '../../../mlNotifications/mlSmsNotifications/mlSMSNotification'
import MlNotificationController from '../../../mlNotifications/mlAppNotifications/mlNotificationsController'

MlResolver.MlMutationResolver['createTransaction'] = (obj, args, context, info) => {

  if (!args.transaction.requestTypeId) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("Request Type is mandatory!!!!", code);
    return response;
  }
  let requestDetails = MlRequestType.findOne({"_id": args.transaction.requestTypeId}) || {};
  args.transaction.requestTypeName = requestDetails.requestName;
  args.transaction.transactionTypeName = requestDetails.transactionType;
  args.transaction.transactionTypeId = requestDetails.transactionId;
  args.transaction.userId = context.userId;
  args.transaction.transactionCreatedDate = new Date();
  orderNumberGenService.assignTransationRequest(args.transaction)
  let transactionDetails = args.transaction
  let id = mlDBController.insert('MlTransactions', args.transaction, context)
  if (id) {
    let code = 200;
    let result = {transactionId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

MlResolver.MlMutationResolver['updateTransactionStatus'] = (obj, args, context, info) => {
  var collection = args.collection
  let id = mlDBController.update(collection, {_id: args.transactionId}, {status: args.status}, {$set: true}, context)
  if (id) {
    let code = 200;
    let result = {transactionId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}


MlResolver.MlMutationResolver['assignTransaction'] = (obj, args, context, info) => {

  var collection = args.collection
  var params = args.params;
  var hierarchyDesicion = false
  var canUpdateAllTransactions = true
  var hierarchy = null
  var successCount = 0
  var user = mlDBController.findOne('users', {_id: params.user}, context)
  var transactions = args.transactionId

  transactions.map(function (transaction) {
    if (canUpdateAllTransactions) {
      let trans = mlDBController.findOne(collection, {"transactionId": transaction}, context)

      if (user && params.cluster == null && params.department == null && params.role == null) {
        var defaultRole = {};
        var userProfile = _.find(user.profile.InternalUprofile.moolyaProfile.userProfiles, {clusterId: trans.registrationInfo.clusterId});
        if (userProfile) {
          let userRolesData = userProfile && userProfile.userRoles ? userProfile.userRoles : [];
          hirarichyLevel = _.pluck(userRolesData, 'hierarchyLevel') || [];
          hirarichyLevel.sort(function (a, b) {
            return b - a
          });
          for (let i = 0; i < userRolesData.length; i++) {
            if ((userRolesData[i].hierarchyLevel == hirarichyLevel[0]) && userRolesData[i].isActive) {
              defaultRole = userRolesData[i]
              break
            }
          }
          if (defaultRole) {
            if (defaultRole.hierarchyLevel == 0) {
              if (defaultRole.chapterId != trans.registrationInfo.chapterId || defaultRole.subChapterId != trans.registrationInfo.subChapterId || defaultRole.communityCode != trans.registrationInfo.communityDefCode) {
                canUpdateAllTransactions = false;
              }

            }
            else if (defaultRole.hierarchyLevel == 1) {
              if (defaultRole.chapterId != trans.registrationInfo.chapterId || defaultRole.subChapterId != trans.registrationInfo.subChapterId) {
                canUpdateAllTransactions = false;
              }
            }
            else if (defaultRole.hierarchyLevel == 2) {
              if (defaultRole.chapterId != trans.registrationInfo.chapterId) {
                canUpdateAllTransactions = false;
              }
            }
            if (canUpdateAllTransactions) {
              try {
                hierarchy = mlHierarchyAssignment.findHierarchy(trans.registrationInfo.clusterId, defaultRole.departmentId, defaultRole.subDepartmentId, defaultRole.roleId, trans.registrationInfo.subChapterId)
                if (!hierarchy)
                  canUpdateAllTransactions = false;
              } catch (e) {
                canUpdateAllTransactions = false;
                console.log('Not available in hierarchy')
              }
            }
          }
        } else {
          canUpdateAllTransactions = false;
        }
      }

      if (canUpdateAllTransactions) {
        if (trans && trans.allocation && trans.allocation.assigneeId) {
          hierarchyDesicion = mlHierarchyAssignment.canSelfAssignTransactionAssignedTransaction(transaction, collection, context.userId, trans.allocation.assigneeId)
        } else {
          hierarchyDesicion = mlHierarchyAssignment.assignTransaction(transaction, collection, context.userId, params.user)
        }
        if (hierarchyDesicion === true) {
          successCount++
        }
      }
    }
  })
  //get user details iterate through profiles match with role and get department and update allocation details.

  if (hierarchyDesicion === true && successCount == transactions.length && canUpdateAllTransactions) {

    let date = new Date();
    let allocationObj = MlStatusRepo.getStatusDefinition("ADM_ASSIGN_COMP", "allocation");
    let allocation = {
      assignee: user.profile.InternalUprofile.moolyaProfile.displayName,
      assigneeId: user._id,
      assignedDate: date,
      department: params.department,
      departmentId: params.department,
      subDepartment: params.subDepartment,
      subDepartmentId: params.subDepartment,
      allocationStatus: allocationObj && allocationObj.code ? allocationObj.code : "",
    }

    //find hierarchy
    if (!hierarchy) {
      try {
        hierarchy = mlHierarchyAssignment.findHierarchy(params.cluster, params.department, params.subDepartment, params.role, params.subChapter)
      } catch (e) {
        let code = 400;
        let result = {message: "Not available in hierarchy"}
        let response = new MlRespPayload().errorPayload(result, code);
        return response
      }
    }
    let updateCount = 0
    if (canUpdateAllTransactions) {
      transactions.map(function (trans) {
        if (hierarchy) {
          let id = mlDBController.update(collection, {transactionId: trans},
            {
              allocation: allocation,
              // status:"WIP",
              //userId:params.user,
              hierarchy: hierarchy._id,
              transactionUpdatedDate: date
            }
            , {$set: true}, context)
          if (id) {
            updateCount++
            MlEmailNotification.onAdminAssigned(collection, trans);
            MlSMSNotification.AdminAssignedToUser(collection, trans);
            MlNotificationController.onUserAssigned(collection, trans);
          }
        } else {
          let code = 400;
          let result = {message: "Not available in hierarchy"}
          let response = new MlRespPayload().errorPayload(result, code);
          return response
        }
      })
    } else {
      let code = 400;
      let result = {message: "Not available in hierarchy"}
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }

    if (updateCount > 0) {
      let code = 200;
      let result = {transactionId: ''}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    let code = 400;
    let result = {message: "Not available in hierarchy"}
    let response = new MlRespPayload().errorPayload(result, code);
    return response
  }

}

MlResolver.MlQueryResolver['fetchTransactions'] = (obj, args, context, info) => {
  if (args.transactionType) {
    //todo: conditions based on record id for steps like registration,portfolio
    //resolve userType:internal/external and send with response
    let transactionType = args.transactionType;
    let status = args.status
    let userId = context.userId;
    let transactions = mlTransactionsListRepo.fetchTransactions(transactionType, userId, status);
    return transactions;
  }
  return null;
}

/**
 * @Note: this resolver seems to have no use need to remove it.
 * @ref: registrationResolver
 * */
MlResolver.MlMutationResolver['createRegistrationTransaction'] = (obj, args, context, info) => {
  let transaction = {};
  let transact = MlTransactionTypes.findOne({"_id": args.transactionType}) || {};
  transaction.transactionTypeName = transact.transactionName;
  transaction.transactionTypeId = transact._id;
  transaction.status = "Pending";
  orderNumberGenService.assignTransationRequest(transaction)
  let id = mlDBController.insert('MlTransactions', transaction, context)
  if (id) {
    let code = 200;
    let result = transaction.requestId
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

MlResolver.MlMutationResolver['updateRegistrationTransaction'] = (obj, args, context, info) => {
  let transaction = MlTransactions.findOne({"requestId": args.transactionInfo.requestId}) || {};
  let date = new Date();
  transaction.cluster = args.transactionInfo.cluster;
  transaction.chapter = args.transactionInfo.chapter;
  transaction.transactionUpdatedDate = date.date;

  let id = mlDBController.update('MlTransactions', {requestId: args.transactionInfo.requestId}, {
    'cluster': args.transactionInfo.cluster,
    'chapter': args.transactionInfo.chapter,
    'transactionUpdatedDate': date.date
  }, {$set: true}, context)
  if (id) {
    let code = 200;
    let result = {transactionId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

MlResolver.MlMutationResolver['selfAssignTransaction'] = (obj, args, context, info) => {
  var collection = args.collection
  var hierarchyDesicion = false
  var successCount = 0
  var transactions = args.transactionId
  transactions.map(function (transaction) {
    let trans = mlDBController.findOne(collection, {"transactionId": transaction}, context)
    if (trans && trans.allocation && trans.allocation.assigneeId) {
      hierarchyDesicion = mlHierarchyAssignment.canSelfAssignTransactionAssignedTransaction(trans, collection, context.userId, trans.allocation.assigneeId)
    } else {
      hierarchyDesicion = mlHierarchyAssignment.canSelfAssignTransaction(trans, collection, context.userId)
    }
    if (hierarchyDesicion === true) {
      successCount++
    }
  })

  //get user details iterate through profiles match with role and get department and update allocation details.

  if (hierarchyDesicion === true && successCount == transactions.length) {
    let user = mlDBController.findOne('users', {_id: context.userId}, context)
    let userprofiles = user.profile.InternalUprofile.moolyaProfile.userProfiles
    let userProfile = _.find(userprofiles, function (item) {
      return item.isDefault == true
    });
    let roles = userProfile.userRoles
    roleDetails = roles[0]
    let date = new Date();
    let allocationObj = MlStatusRepo.getStatusDefinition("ADM_ASSIGN_COMP", "allocation");
    let allocation = {
      assignee: user.username,
      assigneeId: user._id,
      assignedDate: date,
      department: roleDetails.departmentName,
      departmentId: roleDetails.departmentId,
      subDepartment: roleDetails.subDepartmentName,
      subDepartmentId: roleDetails.subDepartmentId,
      allocationStatus: allocationObj && allocationObj.code ? allocationObj.code : ""
    }
    //find hierarchy
    let updateCount = 0
    transactions.map(function (trans) {
      let hierarchy = mlHierarchyAssignment.findHierarchy(roleDetails.clusterId, roleDetails.departmentId, roleDetails.subDepartmentId, roleDetails.roleId, roleDetails.subChapterId)
      if (hierarchy) {
        let id = mlDBController.update(collection, {transactionId: trans}, {
          allocation: allocation,
          // status: "WIP",
          //userId: user._id,
          hierarchy: hierarchy._id,
          transactionUpdatedDate: date
        }, {$set: true}, context)
        if (id) {
          updateCount++
        }
      } else {
        let code = 400;
        let result = {message: "Not available in hierarchy"}
        let response = new MlRespPayload().errorPayload(result, code);
        return response
      }
    })
    if (updateCount > 0) {
      let code = 200;
      let result = {transactionId: ''}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }

  } else {
    let code = 400;
    let result = {message: "Not available in hierarchy"}
    let response = new MlRespPayload().errorPayload(result, code);
    return response
  }
}

MlResolver.MlMutationResolver['unAssignTransaction'] = (obj, args, context, info) => {
  var collection = args.collection
  var hierarchyDesicion = false
  var successCount = 0
  var transactions = args.transactionId
  transactions.map(function (transaction) {
    let trans = mlDBController.findOne(collection, {"transactionId": transaction}, context)
    hierarchyDesicion = mlHierarchyAssignment.canUnAssignTransaction(transaction, collection, context.userId)
    if (hierarchyDesicion === true) {
      successCount++
    }
  })
  if (hierarchyDesicion === true && successCount == transactions.length) {
    let updateCount = 0
    transactions.map(function (trans) {
      let date = new Date();
      let allocationObj = MlStatusRepo.getStatusDefinition("ADM_ASSIGN_PEND", "allocation");
      let id = mlDBController.update(collection, {transactionId: trans}, {
        allocation: {allocationStatus: allocationObj && allocationObj.code ? allocationObj.code : ""},
        // status: "Yet To Start",
        //userId: "",
        hierarchy: "",
        transactionUpdatedDate: date
      }, {$set: true}, context)
      if (id) {
        updateCount++
      }
    })
    if (updateCount > 0) {
      let code = 200;
      let result = {transactionId: ''}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } else {
    let code = 400;
    let result = {message: "Not available in hierarchy"}
    let response = new MlRespPayload().errorPayload(result, code);
    return response
  }

}

MlResolver.MlQueryResolver['fetchTransactionsLog'] = (obj, args, context, info) => {
  if (args.userId) {
    let userId = args.userId;
    let transactions = mlDBController.find('MlTransactionsLog', {
      userId: userId,
      transactionTypeName: args.transactionTypeName
    }).fetch();
    return transactions;
  }
  return null;
}

MlResolver.MlMutationResolver['createTransactionLog'] = (obj, args, context, info) => {
  // let transaction = mlDBController.findOne('MlTransactionsLog', {"userId": args.transactions.userId}, context)
  let date = new Date();
  args.transaction.userAgent = {};
  args.transaction.userAgent.ipAddress = context.ip;
  args.transaction.userAgent.browser = context.browser;
  context.userId = args.transaction.userId;
  let id = mlDBController.insert('MlTransactionsLog', args.transaction, context)
  if (id) {
    let code = 200;
    let result = {transactionId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}


MlResolver.MlQueryResolver['validateTransaction'] = (obj, args, context, info) => {
  var collection = args.collection
  let transaction = mlDBController.findOne(collection, {"transactionId": args.transactionId}, context)
  let hierarchyDesicion = false;
  if (!args.assignedUserId) {
    let systemRoles = mlHierarchyAssignment.checkSystemSystemDefinedRole(mlHierarchyAssignment.getUserRoles(context.userId));
    if (systemRoles === true) {
      let code = 200;
      let result = {status: systemRoles}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    } else {
      let code = 400;
      let result = {message: "Not available in hierarchy"}
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }
  } else {
    hierarchyDesicion = mlHierarchyAssignment.validateTransaction(args.transactionId, collection, context.userId, args.assignedUserId)
    if (hierarchyDesicion === true) {
      let code = 200;
      let result = {status: hierarchyDesicion}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    } else {
      let code = 400;
      let result = {message: "Not available in hierarchy"}
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }
  }

}

/*
 validateAssignmentsDataContext to validate assignments
*/

MlResolver.MlQueryResolver['validateAssignmentsDataContext'] = (obj, args, context, info) => {
  let data = args.data
  let userId = args.userId
  // let matchNotFound = false
  // if(data && userId){
  //   let adminContext = new MlAdminContextQueryConstructor(userId).contextQuery()
  //   let context = _lodash.concat(adminContext.clusterId, adminContext.chapterId,adminContext.subChapterId,adminContext.communityId)
  //   if(adminContext.clusterId && !adminContext.chapterId && !adminContext.subChapterId && !adminContext.communityId){
  //     data.map(function (trans) {
  //       if(!_.contains(context,trans.clusterId)){
  //         matchNotFound = true
  //       }
  //     })
  //   }else if(adminContext.clusterId && adminContext.chapterId && !adminContext.subChapterId && !adminContext.communityId){
  //     data.map(function (trans) {
  //       if(!_.contains(context,trans.clusterId) || !_.contains(context,trans.chapterId)){
  //         matchNotFound = true
  //       }
  //     })
  //   }else if(adminContext.clusterId && adminContext.chapterId && adminContext.subChapterId && !adminContext.communityId){
  //     data.map(function (trans) {
  //       if(!_.contains(context,trans.clusterId) || !_.contains(context,trans.chapterId) || !_.contains(context,trans.subChapterId)){
  //         matchNotFound = true
  //       }
  //     })
  //   }else if(adminContext.clusterId && adminContext.chapterId && adminContext.subChapterId && adminContext.communityId){
  //     data.map(function (trans) {
  //       if(!_.contains(context,trans.clusterId) || !_.contains(context,trans.chapterId) || !_.contains(context,trans.subChapterId) || !_.contains(context,trans.communityId)){
  //         matchNotFound = true
  //       }
  //     })
  //   }

  // if(matchNotFound === true){
  //   let code = 200;
  //   let result = {status : ''}
  //   let response = new MlRespPayload().successPayload(result, code);
  //   return response
  // }else{
  //   let code = 400;
  //   let result = {status:''}
  //   let response = new MlRespPayload().errorPayload(result, code);
  //   return response
  // }

  var matchFound = false
  if (data && userId) {
    var userRoles = [];
    var user = mlDBController.findOne('users', {_id: userId})
    var userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
    _.each(userProfiles, function (profile) {
      // Picking Highest Active Role from each User Profile
      var roles = _lodash.filter(profile.userRoles, {isActive: true})
      var highestRole = _lodash.maxBy(roles, 'hierarchyLevel')
      userRoles.push(highestRole);
    })

    for (let i = 0; i < data.length; i++) {
      try {
        if (data[i].clusterId && !data[i].chapterId && !data[i].subChapterId && !data[i].communityId) {
          var role = _lodash.find(userRoles, function (obj) {
            if ((obj.clusterId == data[i].clusterId || obj.clusterId == "all")) {
              return obj
            }
          })
          if (role) {
            matchFound = true
          }
        } else if (data[i].clusterId && data[i].chapterId && !data[i].subChapterId && !data[i].communityId) {
          var role = _lodash.find(userRoles, function (obj) {
            if ((obj.clusterId == data[i].clusterId || obj.clusterId == "all") && (obj.chapterId == data[i].chapterId || obj.chapterId == "all")) {
              return obj
            }
          })
          if (role) {
            matchFound = true
          }
        } else if (data[i].clusterId && data[i].chapterId && data[i].subChapterId && !data[i].communityId) {
          var role = _lodash.find(userRoles, function (obj) {
            if ((obj.clusterId == data[i].clusterId || obj.clusterId == "all") && (obj.chapterId == data[i].chapterId || obj.chapterId == "all") && (obj.subChapterId == data[i].subChapterId || obj.subChapterId == "all")) {
              return obj
            }
          })
          if (role) {
            matchFound = true
          }
        } else if (data[i].clusterId && data[i].chapterId && data[i].subChapterId && data[i].communityId) {
          var role = _lodash.find(userRoles, function (obj) {
            if ((obj.clusterId == data[i].clusterId || obj.clusterId == "all") && (obj.chapterId == data[i].chapterId || obj.chapterId == "all") && (obj.subChapterId == data[i].subChapterId || obj.subChapterId == "all") && (obj.communityCode == data[i].communityCode || obj.communityCode == "all")) {
              return obj
            }
          })
          if (role) {
            matchFound = true
          }
        }
      } catch (e) {
        console.log('error: ' + e)
        return new MlRespPayload().errorPayload({status: e}, 400);
      }
    }

    if (matchFound === true) {
      let code = 200;
      let result = {status: ''}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    } else {
      let code = 400;
      let result = {status: ''}
      let response = new MlRespPayload().errorPayload(result, code);
      return response
    }
  }

}


// MlResolver.MlQueryResolver['findUserTransactionLogs'] = (obj, args, context, info) => {
//   var result = [];
//   var reg = mlDBController.findOne('MlRegistration', {'_id':args.registrationId} , context)
//
//   let pipeline = [{
//     '$match': {_id: reg.registrationInfo.userId}},
//     {'$lookup': {from: 'mlRegistration',localField: '_id',foreignField: 'registrationInfo.userId',as: 'registration'}},
//     {'$lookup':{from:'mlPortfolioDetails',localField:'_id',foreignField:'userId', as:'portfolio'}},
//     {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'userId', as:'transactionLog'}},
//     {'$project':{"registration":{
//       '$map':
//         { "input":"$registration", "as":"reg", 'in':
//           { "createdAt" :"$$reg.registrationInfo.registrationDate", "transactionId":"$$reg._id" ,"transactionType":"$$reg.registrationInfo.transactionType", "cluster":'$$reg.registrationInfo.clusterName', "chapter":'$$reg.registrationInfo.chapterName', "community":'$$reg.registrationInfo.communityName', "status":'$$reg.status'}
//         }
//     },
//       "portfolio":{
//         '$map':
//           { "input":"$portfolio", "as":"port", 'in':
//             { "createdAt" :"$$port.createdAt", "transactionId":"$$port._id" ,"transactionType":"$$port.transactionType", "cluster":'$$port.clusterName', "chapter":'$$port.chapterName', "community":'$$port.communityName', "status":'$$port.status'}
//           }
//       },
//       "transactionLog":{
//         '$map':
//           { "input":"$transactionLog", "as":"trans", 'in':
//             { "createdAt" :"$$trans.createdAt", "transactionId":"$$trans._id" ,"transactionType":"$$trans.transactionTypeName", "cluster":'$$trans.clusterName', "chapter":'$$trans.chapterName', "community":'$$trans.communityName', "status":'$$trans.activity'}
//           }
//       },
//     }},
//     {'$project': {data: { "$concatArrays" : [ "$registration", "$portfolio", "$transactionLog" ] } }},
//     // {'$addFields': { 'data.totalRecords': { $size: "$data" } } },
//     {"$unwind" : "$data"},
//     {"$replaceRoot": { newRoot: "$data"}}
//   ];
//
//   result = mlDBController.aggregate('users', pipeline, context);
//   // if(reg.registrationInfo.userId)
//   //   result = mlDBController.find('MlTransactionsLog', {'userId':reg.registrationInfo.userId} , context).fetch();
//
//   return result;
// }
