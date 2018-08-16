/**
 * Created by muralidhar on 14/02/17.
 */
import _ from "lodash";
import _underscore from "underscore";
import geocoder from "geocoder";
import MlEmailNotification from "../../../../mlNotifications/mlEmailNotifications/mlEMailNotification"
import MlUserContext from '../../../../../server/MlExternalUsers/mlUserContext'
import MlAlertNotification from '../../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlSubChapterAccessControl from '../../../../../server/mlAuthorization/mlSubChapterAccessControl'
import portfolioValidationRepo from '../../portfolio/portfolioValidation'
import MlSMSNotification from "../../../../mlNotifications/mlSmsNotifications/mlSMSNotification"
import MlNotificationController from '../../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import passwordUtil from "../../../../commons/passwordUtil";
import MlAdminUserContext from "../../../../mlAuthorization/mlAdminUserContext";
import getQuery from "../../genericSearch/queryConstructor";
import { getCommunityName } from '../../../../commons/utils';

MlResolver.MlQueryResolver['fetchUserTypeFromProfile'] = (obj, args, context, info) => {
    let user=Meteor.users.findOne(context.userId);
    return user&&user.profile&&user.profile.isInternaluser?"internal":"external";
}

MlResolver.MlQueryResolver['fetchExternalUserDetails'] = (obj, args, context, info) => {
  let user= mlDBController.findOne('users', {'_id':context.userId}, context)
  return user;
}

MlResolver.MlQueryResolver['fetchMapCenterCordsForUser'] = (obj, args, context, info) => {
  //Resolve the context of the User and hierarchy
  //todo: check internal /external user

  if(args.module == "subChapter" || args.module == "users"){
    var chapterId = args.id||null;

    if(!chapterId){
      let userProfile=new MlAdminUserContext().userProfileDetails(context.userId);
      if(userProfile&&userProfile.defaultChapters&&userProfile.defaultChapters!==null) {
        chapterId=userProfile.defaultChapters;
      }
    }
    let chapterDetails = MlChapters.findOne(chapterId);
    if (chapterDetails && chapterDetails.latitude && chapterDetails.longitude) {
      return {lat: chapterDetails.latitude, lng: chapterDetails.longitude};
    }
  }

  var clusterId=args.id||null;

  if(!clusterId){
  let userProfile=new MlAdminUserContext().userProfileDetails(context.userId);
  if(userProfile&&userProfile.defaultProfileHierarchyRefId&&userProfile.defaultProfileHierarchyRefId!==null) {
    clusterId=userProfile.defaultProfileHierarchyRefId;
    }
  }

  let clusterDetails = MlClusters.findOne(clusterId);
  if (clusterDetails && clusterDetails.latitude && clusterDetails.longitude) {
    return {lat: clusterDetails.latitude, lng: clusterDetails.longitude};
  }
}

MlResolver.MlMutationResolver['createUser'] = (obj, args, context, info) => {
    if(!args.user.username){
      let code = 409;
      let response = new MlRespPayload().errorPayload("Username is required", code);
      return response;
    }
  let backEndUserExist = mlDBController.findOne('users', {'profile.email':args.user.profile.email}, context)
  let registrationExist =   mlDBController.findOne('MlRegistration', {'registrationInfo.email':args.user.profile.email}, context)
    if((backEndUserExist && backEndUserExist._id) || (registrationExist && registrationExist._id)){
        let code = 409;
        let response = new MlRespPayload().errorPayload("Already Exist", code);
        return response;
    }
  // let userId = Accounts.createUser(args.user);
    let userId = mlDBController.insert('users', args.user, context)
    if(userId){
        let code = 200;
        let result = {userId: userId}
        let response = new MlRespPayload().successPayload(result, code);
        return response
    }
}

MlResolver.MlMutationResolver['addUserProfile'] = (obj, args, context, info) => {
  // let user = Meteor.users.findOne({_id: args.userId});
  let user = mlDBController.findOne('users', {_id: args.userId}, context)
  if(user){
      let profile = args.userProfile;  //cl
      let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles; //db

      if(userProfiles && userProfiles.length > 0){
          let index = _.findIndex(userProfiles, {clusterId:profile.clusterId})     //db
          if(index >= 0){
              let roles     = profile.userRoles;                //cl
              let userRoles = userProfiles[index].userRoles;    //db
              roles.map(function (role, key){
                  let action =_.find(userRoles, {"roleId": role.roleId, "chapterId":role.chapterId, "subChapterId":role.subChapterId, "communityId":role.communityId, "departmentId":role.departmentId, "subDepartmentId":role.subDepartmentId});
                  if(!action){
                      userRoles.push(role)
                  }else if(userRoles[key]) {
                      userRoles[key].validTo = role.validTo;
                      userRoles[key].validFrom = role.validFrom;
                      userRoles[key].isActive = role.isActive;
                  }
              })
              userProfiles[index].userRoles = userRoles;
          }else{
              userProfiles.push(profile);
          }
      }else{
          userProfiles.push(profile);
      }
      user.profile.InternalUprofile.moolyaProfile.userProfiles = userProfiles;
      if(args.moolyaProfile && args.moolyaProfile.displayName){
        user.profile.InternalUprofile.moolyaProfile.displayName = args.moolyaProfile.displayName
      }

    // let resp = Meteor.users.update({_id:args.userId}, {$set:user}, {upsert:true})
    // let resp = Meteor.users.update({_id:args.userId}, {$set:{"profile":user.profile}})
    let resp = mlDBController.update('users', args.userId, {"profile":user.profile}, {$set:true}, context)

    if(resp){
        let code = 200;
        let response = new MlRespPayload().successPayload('User successfully assigned', code)
        return response
      }
  }
  let response = new MlRespPayload().errorPayload("User Not Found", 404);
  return response
}

MlResolver.MlMutationResolver['resetPassword'] = (obj, args, context, info) => {
    // let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
    // if (!isValidAuth) {
    //   let code = 401;
    //   let response = new MlRespPayload().errorPayload("Not Authorized", code);
    //   return response;
    // }
  let salted = passwordUtil.hashPassword(args.password);
  let resp = mlDBController.update('users', context.userId, {"services.password.bcrypt": salted}, {$set: true}, context)
  if (resp) {
      let emailSent = MlEmailNotification.onChangePassword(context);
      MlSMSNotification.forgotPassword(context.userId,context)
      MlNotificationController.changePassword(context.userId)
      let code = 200;
      let passwordalert =  MlAlertNotification. onPasswordAlert()
      let response = new MlRespPayload().successPayload(passwordalert, code);
      return response

  }
};

//todo:// need to check this update function it is not correct
MlResolver.MlMutationResolver['updateUser'] = (obj, args, context, info) => {
  var userAccess = checkAnchorAccess (args, context)
  var user = mlDBController.findOne('users', {_id: args.userId}, context)
  if (user && userAccess) {
    if (user.profile.isSystemDefined) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("Cannot edit system defined User", code);
      return response;
    } else {
      if (args.user.profile) {
        for (key in args.user) {
          user[key] = args.user[key]
        }

        if (!args.user.username) {
          let code = 409;
          let response = new MlRespPayload().errorPayload("Email/Username is required", code);
          return response;
        }

        let resp = mlDBController.update('users', args.userId, {profile: user.profile}, {$set:true}, context)
        if (resp) {
          let code = 200;
          let response = new MlRespPayload().successPayload("User Details Updated", code);
          return response
        }
      } else {
        let code = 409;
        let response = new MlRespPayload().errorPayload("Profile is required", code);
        return response;
      }
    }
  }else
    return new MlRespPayload().errorPayload('Not Authorised', 409)
};

MlResolver.MlQueryResolver['fetchUser'] = (obj, args, context, info) => {
  var dataContext = {}
  var userProfile = new MlAdminUserContext().userProfileDetails(args.userId);
  if (userProfile && !userProfile.isMoolya) {
    let subChapterId = userProfile.defaultSubChapters ? userProfile.defaultSubChapters[0] : ''
    dataContext = MlSubChapterAccessControl.getAccessControl('VIEW', context, subChapterId)
  }else {
    dataContext.hasAccess = true
  }

  // let checkAccess = new MlAdminUserContext().nonMoolyaBackedUserAccess(args.userId, context.userId);
  if (dataContext && dataContext.hasAccess) {
    let user = mlDBController.findOne('users', {_id: args.userId}, context)
    let userProfiles = user && user.profile.InternalUprofile.moolyaProfile.userProfiles ? user.profile.InternalUprofile.moolyaProfile.userProfiles : [];
    userProfiles.map(function (doc, index) {
      let clusterName = doc.clusterId
      const clusterData = mlDBController.findOne('MlClusters', {_id: clusterName}, context) || [];
      doc.clusterName = clusterData.clusterName || []
      let userRoles = doc && doc.userRoles ? doc.userRoles : [];
      userRoles.map(function (Rdoc, key) {
        if (Rdoc.subChapterId != 'all') {
          const subChapterData = mlDBController.findOne('MlSubChapters', {_id: Rdoc.subChapterId}, context) || [];
          Rdoc.chapterName = subChapterData.chapterName;
          Rdoc.subChapterName = subChapterData.subChapterName;
        }
        if (Rdoc.hierarchyCode == "CHAPTER") {
          const chapterData = mlDBController.findOne('MlChapters', {_id: Rdoc.chapterId}, context) || [];
          Rdoc.chapterName = chapterData.chapterName;
        }
        if (Rdoc.communityCode != 'all') {
          const communityData = mlDBController.findOne('MlCommunityDefinition', {code: Rdoc.communityCode}, context) || [];
          Rdoc.communityName = communityData.name;
        }
      });
    });
    return user;
  }
}

/**
 * @Note: Duplicate of "fetchUser"
 * */
MlResolver.MlQueryResolver['fetchMyProfile'] = (obj, args, context, info) => {
  let user = mlDBController.findOne('users', {_id: args.userId}, context)
  return user
}


MlResolver.MlQueryResolver['fetchUserDetails'] = (obj, args, context, info) =>
{
    let userDetails = {};
    if(args.userId){
        // user = Meteor.users.findOne({_id: args.userId});
        user = mlDBController.findOne('users', {_id: args.userId}, context)
        let assignedRoles = "";
        let userProfiles=user&&user.profile.InternalUprofile.moolyaProfile.userProfiles?user.profile.InternalUprofile.moolyaProfile.userProfiles:[];
        let displayName = user.profile.InternalUprofile.moolyaProfile.displayName;
        let deActive = user.profile.isActive;
        userProfiles.map(function (profile, index) {
          let userRoles = profile.userRoles;
          const clusterData = mlDBController.findOne('MlClusters', { _id: profile.clusterId }, context) || {};
          if (clusterData) {
            userRoles.map(function (role) {
              const roleCombination = getRoleCombination(role, context);
              const isParentRoleActive = getParentRoleStatus(role).isActive;
              const roleStatus = isParentRoleActive && role.isActive ? "Active" : "Inactive";
              assignedRoles += role.roleName + " (" + roleCombination + ")-(" + roleStatus + ")" + ","
            });
          }
        });

        userDetails['alsoAssignedas'] = assignedRoles;
        userDetails['displayName'] = displayName;
        userDetails['userName'] = user.username;
        userDetails['deActive'] = deActive;
        userDetails['genderType'] = user.profile.genderType;
        userDetails['profileImage'] = user.profile.profileImage;
    }
    return userDetails;
};

MlResolver.MlQueryResolver['fetchUserRoles'] = (obj, args, context, info) => {
    let roles = [];
    if(args.userId){
        // let user = Meteor.users.findOne({_id: args.userId});
        let user = mlDBController.findOne('users', {_id: args.userId}, context)
        if (user && user.profile && user.profile.isInternaluser == true){
            let user_profiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
            _.each(user_profiles, function (profile)
            {
                _.each(profile.userRoles,function (item,value)
                {
                    let contextRole = {};
                    contextRole["roleId"] = item.roleId
                    contextRole["roleName"] = item.roleName
                    contextRole["isActive"] = item.isActive
                    contextRole["validFrom"] = item.validFrom
                    contextRole["validTo"] = item.validTo
                    contextRole["clusterId"] = item.clusterId
                    contextRole["chapterId"] = item.chapterId
                    contextRole["subChapterId"] = item.subChapterId
                    contextRole["communityId"] = item.communityId
                    contextRole["departmentId"] = item.departmentId;
                    contextRole["departmentName"] = item.departmentName;
                    contextRole["subDepartmentId"] = item.subDepartmentId;
                    contextRole["subDepartmentName"] = item.subDepartmentName;
                    contextRole["hierarchyLevel"] = item.hierarchyLevel;
                    contextRole["hierarchyCode"] = item.hierarchyCode;
                    contextRole["isAnchor"] = item.isAnchor;
                    if(item.roleName == "chapteradmin")
                        contextRole["isChapterAdmin"] = true;
                    else
                      contextRole["isChapterAdmin"] = false;
                    roles.push(contextRole)
                })

            })
        }
    }

    return roles;
}


MlResolver.MlQueryResolver['fetchAssignedUsers'] = (obj, args, context, info) => {

  let query = ""
  let users = [];

  if(args.clusterId != "" && args.chapterId != "" && args.subChapterId != "" && args.communityId != ""){
      // users = Meteor.users.find({"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.communityId":args.communityId},{"profile.isActive":true}]}).fetch();
    users = mlDBController.find('users', {"$and": [{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId": args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId": args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId": args.subChapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.communityCode": args.communityId}]}, context).fetch();
  }
  else if(args.clusterId != "" && args.chapterId != "" && args.subChapterId != "" && (!args.subChapterName.startsWith("Moolya-") && !args.subChapterName.startsWith("moolya-"))){
      // users = Meteor.users.find({"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId},{"profile.InternalUprofile.moolyaProfile.userType":'non-moolya'},{"profile.isActive":true}]}).fetch();
    users = mlDBController.find('users', {"$and": [{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId": args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId": args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId": args.subChapterId}, {'profile.isMoolya': false}]}, context).fetch();   //InternalUprofile.moolyaProfile.userType
  }
  else if(args.clusterId != "" && args.chapterId != "" && (args.subChapterName.startsWith("Moolya-")||args.subChapterName.startsWith("moolya-"))){
      // users = Meteor.users.find({"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userType":'moolya'},{"profile.isActive":true}]}).fetch();
    users = mlDBController.find('users', {"$and": [{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId": args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId": args.chapterId}, {'profile.isMoolya': true}]}, context).fetch(); //InternalUprofile.moolyaProfile.userType
  }
  else if(args.clusterId){
      // users = Meteor.users.find({"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId},{"profile.isActive":true}]}).fetch();
    users = mlDBController.find('users', {"$and": [{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId": args.clusterId}]}, context).fetch();
  }
  /**showing display name else firstName + lastName*/
  users.map(function (user) {
    // user.username = user.profile.InternalUprofile.moolyaProfile.firstName+" "+user.profile.InternalUprofile.moolyaProfile.lastName;
    user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
  })
  return users;
}

MlResolver.MlQueryResolver['fetchUsersByClusterDepSubDep'] = (obj, args, context, info) => {
  let users = [];
  if (args.clusterId) {
    var clusterActive = mlDBController.findOne('MlClusters', {_id: args.clusterId, isActive: true}, context)
    if (clusterActive) {
      if (args.subChapterId) {
        let subChapter = mlDBController.findOne('MlSubChapters', {_id: args.subChapterId, isActive: true}, context)
        if (subChapter) {
          var isMoolya = subChapter.isDefaultSubChapter    //{isMoolya: isMoolya},
          let departments = mlDBController.find('MlDepartments', {'$or':[{isSystemDefined: true, isActive : true}, {$and: [{"$or": [{"depatmentAvailable.cluster": args.clusterId}, {"depatmentAvailable.cluster": "all"}]}]}]}, context).fetch();
          if (departments && departments.length > 0) {
            departments.map(function (department) {

              if (isMoolya) {
                var moolyaUsersQuery = {"$and": [{"$or": [{"profile.InternalUprofile.moolyaProfile.assignedDepartment.department": department._id}, {"profile.InternalUprofile.moolyaProfile.globalAssignment": true}]}, {'profile.isMoolya': true}]}
                let depUsers = mlDBController.find('users', moolyaUsersQuery, context).fetch();
                depUsers.map(function (user) {
                  let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
                  if ((user.profile.InternalUprofile.moolyaProfile.globalAssignment || user.profile.InternalUprofile.moolyaProfile.userProfiles.length == 0) && (user.profile.isActive)) {
                    user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                    if (_.isEmpty(_.find(users, user))) {
                      users.push(user)
                    }
                  }
                  else if (!user.profile.InternalUprofile.moolyaProfile.globalAssignment && userProfiles.length > 0 && user.profile.isActive) {
                    userProfiles.map(function (profile) {
                      if (profile.clusterId == args.clusterId) {
                        user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                        if (_.isEmpty(_.find(users, user))) {
                          users.push(user)
                        }
                      }
                    })
                  }
                })
              } else {
                var nonMoolyaUsersQuery = {"$and": [{'profile.InternalUprofile.moolyaProfile.assignedDepartment.department': department._id}, {'profile.InternalUprofile.moolyaProfile.subChapter': subChapter._id}, {'profile.isMoolya': false}]}
                let depUsersNon = mlDBController.find('users', nonMoolyaUsersQuery, context).fetch();
                if (depUsersNon && depUsersNon.length > 0) {
                  _.each(depUsersNon, function (user, key) {
                    user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                    users.push(user)
                  })
                }
                users = _.uniqBy(users, '_id')
              }
            })
          }
        }
      } else {
        let departments = mlDBController.find('MlDepartments', {"$or": [{"depatmentAvailable.cluster": args.clusterId}, {"depatmentAvailable.cluster": "all"}]}, context).fetch();
        if (departments && departments.length > 0) {
          departments.map(function (department) {
            let depUsers = mlDBController.find('users', {
              "$and": [{
                "$or": [{
                  "profile.InternalUprofile.moolyaProfile.assignedDepartment.department": department._id
                }, {
                  "profile.InternalUprofile.moolyaProfile.globalAssignment": true
                }]
              }, {
                'profile.isMoolya': true
              }]
            }, context).fetch();
            /**showing display name else firstName + lastName*/
            depUsers.map(function (user) {
              let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
              if ((user.profile.InternalUprofile.moolyaProfile.globalAssignment || user.profile.InternalUprofile.moolyaProfile.userProfiles.length == 0) && (user.profile.isActive)) {
                // user.username = user.profile.InternalUprofile.moolyaProfile.firstName + " " + user.profile.InternalUprofile.moolyaProfile.lastName;
                user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                if (_.isEmpty(_.find(users, user))) {
                  users.push(user)
                }
              }
              else if (!user.profile.InternalUprofile.moolyaProfile.globalAssignment && userProfiles.length > 0 && user.profile.isActive) {
                userProfiles.map(function (profile) {
                  if (profile.clusterId == args.clusterId) {
                    // user.username = user.profile.InternalUprofile.moolyaProfile.firstName + " " + user.profile.InternalUprofile.moolyaProfile.lastName;
                    user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                    if (_.isEmpty(_.find(users, user))) {
                      users.push(user)
                    }
                  }
                })
              }
            })
          })
        }
      }
    }
  }
  return users;
}

MlResolver.MlQueryResolver['fetchUserDepSubDep'] = (obj, args, context, info) =>
{
    let depts = []
    // let user = Meteor.users.findOne({"_id": args.userId})
    let user = mlDBController.findOne('users', {_id: args.userId}, context)
    // let clusterDepts = MlDepartments.find({"$or": [{"depatmentAvailable.cluster": args.clusterId}, {"depatmentAvailable.cluster": "all"}]}).fetch();
    let clusterDepts = mlDBController.find('MlDepartments', {"$or": [{"depatmentAvailable.cluster": args.clusterId}, {"depatmentAvailable.cluster": "all"}]}, context).fetch();
    if (user && clusterDepts && clusterDepts.length > 0) {
        let userDepts = (user.profile && user.profile.InternalUprofile && user.profile.InternalUprofile.moolyaProfile && user.profile.InternalUprofile.moolyaProfile.assignedDepartment);
        userDepts.map(function (userDept) {
          let result = _.find(clusterDepts, {"_id":userDept.department});
          if(result && result.isActive){
            userDept.isAvailiable = true;
          }
          else
            userDept.isAvailiable = false;

          depts.push(userDept)
        })
    }
    depts.map(function (dept) {
        // let departmentName = MlDepartments.findOne({"_id":dept.department}).departmentName;
        let departmentName = mlDBController.findOne('MlDepartments', {_id: dept.department}, context).departmentName;
        // let subDepartmentName = MlSubDepartments.findOne({"_id":dept.subDepartment}).subDepartmentName;
        let subDepartmentName = mlDBController.findOne('MlSubDepartments', {_id: dept.subDepartment}, context).subDepartmentName;
        dept.departmentName =departmentName;
        dept.subDepartmentName = subDepartmentName;
    })
    return depts
}

MlResolver.MlQueryResolver['fetchUsersBysubChapterDepSubDep'] = (obj, args, context, info) => {
  let users = [];
  if (args.subChapterId) {
    let subChapter = mlDBController.findOne('MlSubChapters', {_id: args.subChapterId}, context)
    if (subChapter && subChapter.isActive) {
      if (subChapter.isDefaultSubChapter) {
        users = MlResolver.MlQueryResolver['fetchUsersByClusterDepSubDep'](obj, {
          clusterId: subChapter.clusterId,
          subChapterId: args.subChapterId ? args.subChapterId : ""
        }, context, info)
      } else {
        /**fetching all departments in the case of non-moolya subchapter condition change*/   // {isMoolya: false},
        let departments = mlDBController.find('MlDepartments', {
          $or: [{$and: [{depatmentAvailable: {$elemMatch: {subChapter: {$in: ['all', subChapter._id]}}}}]}, {
            isSystemDefined: true,
            isActive: true
          }]
        }, context).fetch();
        if (departments && departments.length > 0) {
          for (var i = 0; i < departments.length; i++) {
            let depusers = mlDBController.find('users', {
              $and: [{
                "profile.InternalUprofile.moolyaProfile.assignedDepartment.department": departments[i]._id
              }, {
                'profile.isMoolya': false
              },{'profile.InternalUprofile.moolyaProfile.subChapter':subChapter._id}]
            }, context).fetch();
            if (depusers && depusers.length > 0) {
              _.each(depusers,function (user,key) {
                user.username = user.profile.InternalUprofile.moolyaProfile.displayName ? user.profile.InternalUprofile.moolyaProfile.displayName : user.profile.firstName + " " + user.profile.lastName;
                users.push(user)
              })
            }
            /**showing display name else firstName + lastName*/
          }
        }
        users = _.uniqBy(users, '_id')
      }
    }
  }
  return users;
}

MlResolver.MlQueryResolver['fetchsubChapterUserDepSubDep'] = (obj, args, context, info) => {
  let depts = []
  let subChapter = mlDBController.findOne('MlSubChapters', {_id: args.subChapterId}, context)
  if (subChapter && subChapter.isDefaultSubChapter) {
    depts = MlResolver.MlQueryResolver['fetchUserDepSubDep'](obj, {
      userId: args.userId,
      clusterId: subChapter.clusterId
    }, context, info)
  } else if (subChapter && !subChapter.isDefaultSubChapter) {
    let user = mlDBController.findOne('users', {_id: args.userId}, context)
    // let subChapterDep = MlDepartments.find({"depatmentAvailable.subChapter":subChapter._id}).fetch();
    /**fetching all departments for non-moolya*/ //{isMoolya: false},
    let subChapterDep = mlDBController.find('MlDepartments', {
      $or: [{$and: [{depatmentAvailable: {$elemMatch: {subChapter: {$in: ['all', subChapter._id]}}}}]}, {
        isSystemDefined: true,
        isActive: true
      }]
    }, context).fetch();

    if (user && subChapterDep && subChapterDep.length > 0) {
      let userDep = (user.profile && user.profile.InternalUprofile && user.profile.InternalUprofile.moolyaProfile && user.profile.InternalUprofile.moolyaProfile.assignedDepartment);
      userDep.map(function (userDept) {
        let result = _.find(subChapterDep, {"_id": userDept.department});
        userDept.isAvailiable = result.isActive;
        depts.push(userDept)
      })
    }
    depts.map(function (dept) {

      let departmentName = mlDBController.findOne('MlDepartments', {_id: dept.department}, context).displayName;
      //let departmentName = dept_res.departmentName;
      //let departmentDisplayName = dept_res.displayName;

      let  subDepartmentName= mlDBController.findOne('MlSubDepartments', {_id: dept.subDepartment}, context).displayName;
     // let subDepartmentName = subDept_res.subDepartmentName;
     // let subDepartmentDisplayName = subDept_res.displayName;

      dept.departmentName = departmentName;
      dept.subDepartmentName = subDepartmentName;
      //dept.departmentDisplayName = departmentDisplayName;
     // dept.subDepartmentDisplayName = subDepartmentDisplayName;
    })
  }
  return depts
}

//todo://generic way of checking platform admin
/**
 * Users left Nav
 * @Note: "updateUserShowOnMap" both have to be merged
 * */
MlResolver.MlMutationResolver['deActivateUser'] = (obj, args, context, info) => {
  // MlSubChapterPreConditions.hasEditPermSubChapterAccessControl(context);
  var loggedInUser = new MlAdminUserContext().userProfileDetails(context.userId);
  if (loggedInUser && loggedInUser.hierarchyLevel == 4) {
    let user = mlDBController.findOne('users', {_id: args.userId}, context)
    let resp;
    if (user) {
      resp = mlDBController.update('users', args.userId, {"profile.isActive": args.isActive}, {$set: true}, context)
      if (resp) {
        resp = new MlRespPayload().successPayload("User Updated Successfully", 200);
        return resp
      } else {
        resp = new MlRespPayload().errorPayload("Error in update", 400);
        return resp
      }
    }else {
      return new MlRespPayload().errorPayload("Invalid user", 400);
    }
  } else {
    let resp = new MlRespPayload().errorPayload("Not Authorised", 400);
    return resp
  }
}

MlResolver.MlMutationResolver['assignUsers'] = (obj, args, context, info) => {
  let moduleName = args.moduleName
  let actionName = args.actionName
  let userId = args.userId;
  let data = args.user;
  let roles  = data && data.profile && data.profile.InternalUprofile &&  data.profile.InternalUprofile.moolyaProfile.userProfiles && data.profile.InternalUprofile.moolyaProfile.userProfiles.userRoles;
  // let deActive = data.profile.deActive;
  let levelCode = ""
  if(!userId){
    let response = new MlRespPayload().errorPayload("No User Found", 404);
    return response
  }
  if(!roles){
    let response = new MlRespPayload().errorPayload("No Roles Found", 404);
    return response
  }
  let hierarchy = "";
  roles.map(function (role)
  {
      if(!role.hierarchyCode) {
        //community Admin @ subChapter level
          if ((role.clusterId && role.clusterId != "all") && (role.chapterId && role.chapterId != "all") && (role.subChapterId && role.subChapterId != "all") &&
            (role.communityId && role.communityId != "all")) {
            levelCode = "COMMUNITY"
            let community = mlDBController.findOne('MlCommunity', {"$and":[{"clusterId":role.clusterId},{"chapterId":role.chapterId},{"subChapterId":role.subChapterId},{"communityDefCode":role.communityId},{"hierarchyCode":"SUBCHAPTER"}]}, context);
            if(community){
              role.communityCode = role.communityId;
              role.communityId = community._id;
              role.communityHierarchyLevel = 1
            }
          }
          //sub chapter Admin
          else if ((role.clusterId && role.clusterId != "all") && (role.chapterId && role.chapterId != "all") && (role.subChapterId && role.subChapterId != "all") && !args.user.isChapterAdmin) {
            levelCode = "SUBCHAPTER"
            role.communityId = "all";
            role.communityCode = "all";
          }
          //chapter Admin
          else if ((role.clusterId && role.clusterId != "all") && (role.chapterId && role.chapterId != "all") && (role.subChapterId && role.subChapterId != "all") &&
            args.user.isChapterAdmin) {
            // if (role.departmentName == "operations"){
            if (role.isChapterAdmin){
              let chapterAdminRole = mlDBController.findOne('MlRoles', {roleName: 'chapteradmin'}, context)
              levelCode = "CHAPTER"
              role.roleId = chapterAdminRole._id
              role.subChapterId = "all"
              role.communityId = "all"
              role.communityCode = "all";
            } else {
              levelCode = "SUBCHAPTER"
              role.communityId = "all"
              role.communityCode = "all";
            }
          }

          //community Admin @ cluster level
          else if ((role.clusterId && role.clusterId != "all") && (role.communityId && role.communityId != "all")) {
            levelCode = "COMMUNITY"
            role.chapterId = "all"
            role.subChapterId = "all"
            // let community = mlDBController.findOne('MlCommunity', {"$and":[{"clusterId":role.clusterId},{"communityDefCode":role.communityId},{"hierarchyCode":"SUBCHAPTER"}]}, context);
            // if(community){
              role.communityCode = role.communityId;
              role.communityId = "all";
              role.communityHierarchyLevel = 3
            // }
          }
          //cluster Admin
          else if (role.clusterId && role.clusterId != "all") {
            levelCode = "CLUSTER"
            role.chapterId = "all"
            role.subChapterId = "all"
            role.communityId = "all"
            role.communityCode = "all";
          }

          if (levelCode) {
            role.roleName = mlDBController.findOne('MlRoles', {_id: role.roleId}, context).roleName;
            hierarchy = mlDBController.findOne('MlHierarchy', {code: levelCode}, context)
            role.hierarchyLevel = hierarchy.level;
            role.hierarchyCode = hierarchy.code;
          }
      }

  })

  roles  = _.map(roles, function (row) {
    return _.omit(row, ['isChapterAdmin']);
  });

  let userProfile = {
      clusterId:  data.profile.InternalUprofile.moolyaProfile.userProfiles.clusterId,
      userRoles:  roles,
      isDefault: false
  }

  let resp = MlResolver.MlMutationResolver['addUserProfile'](null, {userId:userId, userProfile:userProfile}, context, null)
  return resp;
}

MlResolver.MlQueryResolver['fetchUsersForDashboard'] = (obj, args, context, info) => {

    var totalRecords=0;
    var findOptions = {};

    if(args.offset && args.offset >0){   // `offset` may be `null`
      findOptions.skip=args.offset;
    };

    if (args.limit&&args.limit > 0) { // `limit` may be `null`
      findOptions.limit = args.limit;
    }

    let userFilterQuery={}; //'filter' applied by user
    if (args.fieldsData){
      userFilterQuery = getQuery.searchFunction(args);
    }

  var userType = args.userType; // Backend, Funder, Ideator, Startup, etc.

  var loggedInUser = new MlAdminUserContext().userProfileDetails(context.userId);

  // If selecting Cluster, Chapter And Subachapter and then coming to Community Priming
  var clusterId = args.clusterId?args.clusterId:"";
  var chapterId = args.chapterId?args.chapterId:"";
  var subChapterId = args.subChapterId?args.subChapterId:"";
  var communityCode = args.communityCode?args.communityCode:"";

  var users = [];

  // Generic search query object for EXTERNAL Users
  var queryObj = {isActive: true};

  // Directly clicking on Community Priming
  if(!args.clusterId){

      // If Other Admins(Not PlatformAdmin) log in and directly clicks on Community Priming
      if(loggedInUser.hierarchyCode != "PLATFORM"){

        clusterId = loggedInUser.defaultProfileHierarchyRefId;

          if(loggedInUser.defaultChapters[0] != "all"){
              chapterId = loggedInUser.defaultChapters[0];
          }
          if(loggedInUser.defaultSubChapters[0] != "all"){
              subChapterId = loggedInUser.defaultSubChapters[0];
          }
        if(loggedInUser.defaultCommunities[0].communityCode != "all"){
          communityCode = loggedInUser.defaultCommunities[0].communityCode;
        }
      }
  }
  if(loggedInUser.roleName == "communityadmin"){
    if(loggedInUser.defaultCommunities[0].communityCode != "all"){
      communityCode = loggedInUser.defaultCommunities[0].communityCode;
    }
  }
  if(loggedInUser.hierarchyLevel == 1){
    var related = new MlAdminUserContext().getRelatedSubChaptersForNonMoolya(context.userId);
    var subChapterIds = related.relatedSubChapterIds;
    var chapterIds = related.relatedChapterIds;
    var isDefaultSubChapter = related.isDefaultSubChapter;
    var subChapter = related.userSubChapter

    if(args.chapterId){
      chapterIds = [args.chapterId]
    }

    if(args.subChapterId){
      subChapterId = [args.subChapterId]
    }

    let cluster = mlDBController.findOne('MlClusters', {_id: subChapter.clusterId}, context)
    let chapter = mlDBController.findOne('MlChapters', {_id: subChapter.chapterId}, context)
    queryObj.clusterId = subChapter.clusterId;
    queryObj.chapterId = {$in:chapterIds}
    queryObj.subChapterId = {$in:subChapterIds}

    // if(communityCode != ""){
    //   if(cluster.isActive && chapter.isActive && subChapter.isActive){
    //     queryObj.communityDefCode = communityCode||"all";
    //
    //     // FOR Internal Users
    //     let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {"profile.isActive":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
    //     _.each(internalUsers, function (user){
    //       let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
    //       let profile = _.find(userProfiles, {clusterId:clusterId});
    //       if(profile){
    //         // let roles = _.find(profile.userRoles, {chapterId:(chapterId||"all"), subChapterId:(subChapterId||"all"), communityCode:(communityCode||"all")});
    //         let roles = _.find(profile.userRoles, function (obj) {
    //           if((obj.chapterId == chapterId || obj.chapterId == "all") && (obj.subChapterId == subChapterId || obj.subChapterId == "all") && (obj.communityCode == communityCode || obj.communityCode == "all")){
    //             return obj
    //           }
    //         })
    //         if(roles){
    //           let resp = new MlAdminUserContext().getUserLatLng(user.profile);
    //           user.latitude = resp.lat;
    //           user.longitude = resp.lng;
    //           user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
    //           // let roles = new MlAdminUserContext().getUserRolesName(userProfiles);
    //           user.roleNames = roles.roleName;
    //           users.push(user);
    //         }
    //       }
    //     })
    //
    //     // FOR External Users
    //     queryObj.isApprove=true;
    //     let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {"profile.isActive":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
    //     if(externalUsers && externalUsers.length>0) {
    //       _.each(externalUsers, function (user) {
    //         let userProfiles = user.profile.externalUserProfiles;
    //         // userProfiles = _.filter(userProfiles,  {'clusterId': clusterId, 'chapterId': chapterId, 'subChapterId': subChapterId, 'communityDefCode': communityCode||"all"});
    //         userProfiles = _.filter(userProfiles, function (obj) {
    //           if(obj.clusterId==clusterId && _.indexOf(chapterIds, obj.chapterId) < 0 &&_.indexOf(subChapterId, obj.subChapterId) < 0 && obj.communityDefCode==communityCode){
    //             return obj
    //           }
    //         })
    //         if(userProfiles && userProfiles.length>0){
    //           let locationName = "subChapterName";
    //           var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
    //           var newArr = _.concat(users,resp);
    //           users = newArr
    //         }
    //       })
    //     }
    //   }
    // } else{
      if(cluster.isActive && chapter && chapter.isActive && subChapter && subChapter.isActive){

        if(userType == "All"){
          // FOR Internal Users
          let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(internalUsers, function (user){
            let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
            let profile = _.find(userProfiles, {clusterId:cluster._id});
            if(profile){
              let roles = _.filter(profile.userRoles, function (obj) {
                if((_.indexOf(chapterIds, obj.chapterId) > -1 || _.indexOf(chapterIds, "all") > -1) && (_.indexOf(subChapterIds, obj.subChapterId) > -1 || _.indexOf(subChapterIds, "all") > -1)){
                  return obj
                }
              })
              if(roles){
                let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                user.latitude = resp.lat;
                user.longitude = resp.lng;
                user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

                let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
                user.roleNames = respRoles;
                users.push(user);
              }
            }
          })

          // FOR External Users
          queryObj.isApprove=true;
          let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          if(externalUsers && externalUsers.length>0) {
            _.each(externalUsers, function (user) {
              let userProfiles = user.profile.externalUserProfiles;
              userProfiles = _.filter(userProfiles, function (obj) {
                if((obj.clusterId == cluster._id) && (_.indexOf(chapterIds, obj.chapterId) > -1) && (_.indexOf(subChapterIds, obj.subChapterId) > -1)){
                  return obj
                }
              })
              if (userProfiles && userProfiles.length>0) {
                let locationName = "subChapterName";
                var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                var newArr = _.concat(users,resp);
                users = newArr
              }
            })
          }
        }
        else if(userType == "BackendUsers"){
          let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
            let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
            let profile = _.find(userProfiles, {clusterId:cluster._id});
            if(profile){
              let roles = _.find(profile.userRoles, function (obj) {
                if((_.indexOf(chapterIds, obj.chapterId) > -1 || _.indexOf(chapterIds, "all") > -1) && (_.indexOf(subChapterIds, obj.subChapterId) > -1 || _.indexOf(subChapterIds, "all") > -1)){
                  return obj
                }
              })
              if(roles){
                let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                user.latitude = resp.lat;
                user.longitude = resp.lng;
                user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

                let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
                user.roleNames = respRoles;
                users.push(user);
              }
            }
          })
        }
        else if (userType == "Ideators" || userType =="Investors" || userType =="Startups" || userType =="Service Providers" || userType =="Companies" || userType =="Institutions"){
          queryObj.communityDefName=userType;
          queryObj.isApprove=true;
          let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
            let userProfiles = user.profile.externalUserProfiles;
            userProfiles = _.filter(userProfiles, function (obj) {
              if((obj.clusterId == cluster._id) && (_.indexOf(chapterIds, obj.chapterId) > -1) && (_.indexOf(subChapterIds, obj.subChapterId) > -1)){
                return obj
              }
            })
            let locationName = "subChapterName";
            let resp = new MlAdminUserContext().getCommunityBasedExternalUser(userProfiles, user, userType, locationName);
            let newArr = _.concat(users,resp);
            users = newArr
          })
        }
      }

    // }

    context.module = "Users";
    return {data:users, totalRecords:users&&users.length?users.length:0};
  }

  if(clusterId != "" && chapterId != "" && subChapterId != "" && communityCode != ""){
    let cluster = mlDBController.findOne('MlClusters', {_id: clusterId}, context)
    let chapter = mlDBController.findOne('MlChapters', {_id: chapterId}, context)
    let subChapter = mlDBController.findOne('MlSubChapters', {_id: subChapterId}, context)
    if(cluster.isActive && chapter.isActive && subChapter.isActive){
      queryObj.clusterId = clusterId;
      queryObj.chapterId = chapterId;
      queryObj.subChapterId = subChapterId;
      queryObj.communityDefCode = communityCode||"all";

      // FOR Internal Users
      let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
      _.each(internalUsers, function (user){
        let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
        let profile = _.find(userProfiles, {clusterId:clusterId});
        if(profile){
          // let roles = _.find(profile.userRoles, {chapterId:(chapterId||"all"), subChapterId:(subChapterId||"all"), communityCode:(communityCode||"all")});
          let roles = _.find(profile.userRoles, function (obj) {
            if((obj.chapterId == chapterId || obj.chapterId == "all") && (obj.subChapterId == subChapterId || obj.subChapterId == "all") && (obj.communityCode == communityCode || obj.communityCode == "all")){
              return obj
            }
          })
          if(roles){
            let resp = new MlAdminUserContext().getUserLatLng(user.profile);
            user.latitude = resp.lat;
            user.longitude = resp.lng;
            user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
            // let roles = new MlAdminUserContext().getUserRolesName(userProfiles);
            user.roleNames = roles.roleName;
            users.push(user);
          }
        }
      })

        // FOR External Users
        queryObj.isApprove=true;
        let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
        if(externalUsers && externalUsers.length>0) {
          _.each(externalUsers, function (user) {
            let userProfiles = user.profile.externalUserProfiles;
            // userProfiles = _.filter(userProfiles,  {'clusterId': clusterId, 'chapterId': chapterId, 'subChapterId': subChapterId, 'communityDefCode': communityCode||"all"});
            userProfiles = _.filter(userProfiles, function (obj) {
              if(obj.clusterId==clusterId && obj.chapterId==chapterId && obj.subChapterId==subChapterId && obj.communityDefCode==communityCode){
                return obj
              }
            })
              if(userProfiles && userProfiles.length>0){
                let locationName = "subChapterName";
                var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                var newArr = _.concat(users,resp);
                users = newArr
              }
          })
        }
    }

  }else if(clusterId != "" && chapterId != "" && subChapterId != ""){
      let chapter = mlDBController.findOne('MlChapters', {_id: chapterId}, context)
      let cluster = mlDBController.findOne('MlClusters', {_id: clusterId}, context)
      if(!cluster){
        cluster = mlDBController.findOne('MlClusters', {_id: chapter.clusterId}, context)
      }
      let subChapter = mlDBController.findOne('MlSubChapters', {_id: subChapterId}, context)

      if(cluster.isActive && chapter && chapter.isActive && subChapter && subChapter.isActive){
        queryObj.clusterId = cluster._id;
        queryObj.chapterId = chapterId;
        queryObj.subChapterId = subChapterId;

          if(userType == "All"){
            // FOR Internal Users
            let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
            _.each(internalUsers, function (user){
              let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
              let profile = _.find(userProfiles, {clusterId:cluster._id});
              if(profile){
                // let roles = _.filter(profile.userRoles, {chapterId:(chapterId||"all"), subChapterId:(subChapterId||"all")});
                let roles = _.filter(profile.userRoles, function (obj) {
                  if((obj.chapterId==chapterId || obj.chapterId=="all") && (obj.subChapterId==subChapterId || obj.subChapterId=="all")){
                    return obj
                  }
                })
                if(roles){
                  let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                  user.latitude = resp.lat;
                  user.longitude = resp.lng;
                  user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

                  let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
                  user.roleNames = respRoles;
                  users.push(user);
                }
              }
            })

            // FOR External Users
            queryObj.isApprove=true;
            let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
              if(externalUsers && externalUsers.length>0) {
                _.each(externalUsers, function (user) {
                  let userProfiles = user.profile.externalUserProfiles;
                  userProfiles = _.filter(userProfiles,  {'clusterId': cluster._id, 'chapterId': chapterId, 'subChapterId': subChapterId});
                    if (userProfiles && userProfiles.length>0) {
                      let locationName = "subChapterName";
                      var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                      var newArr = _.concat(users,resp);
                      users = newArr
                    }
                })
              }
          }
          else if(userType == "BackendUsers"){
            let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
              _.each(allUsers, function (user){
                  let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
                  let profile = _.find(userProfiles, {clusterId:cluster._id});
                  if(profile){
                    // let roles = _.find(profile.userRoles, {chapterId:(chapterId||"all"),subChapterId:(subChapterId||"all")});
                    let roles = _.find(profile.userRoles, function (obj) {
                      if((obj.chapterId==chapterId || obj.chapterId=="all") && (obj.subChapterId==subChapterId || obj.subChapterId=="all")){
                        return obj
                      }
                    })
                    if(roles){
                      let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                      user.latitude = resp.lat;
                      user.longitude = resp.lng;
                      user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

                      let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
                      user.roleNames = respRoles;
                      users.push(user);
                    }
                  }
              })
          }
          else if (userType == "Ideators" || userType =="Investors" || userType =="Startups" || userType =="Service Providers" || userType =="Companies" || userType =="Institutions"){
            queryObj.communityDefName=userType;
            queryObj.isApprove=true;
            let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
              _.each(allUsers, function (user){
                let userProfiles = user.profile.externalUserProfiles;
                userProfiles = _.filter(userProfiles,  {'clusterId': cluster._id, 'chapterId': chapterId, 'subChapterId': subChapterId});
                  let locationName = "subChapterName";
                  let resp = new MlAdminUserContext().getCommunityBasedExternalUser(userProfiles, user, userType, locationName);
                  let newArr = _.concat(users,resp);
                  users = newArr
              })
          }
      }

  } else if(clusterId != "" && chapterId != ""){

    let chapter = mlDBController.findOne('MlChapters', {_id: chapterId}, context) || {};
    let cluster = mlDBController.findOne('MlClusters', {_id: clusterId}, context);
    if(!cluster){
      cluster = mlDBController.findOne('MlClusters', {_id: chapter.clusterId}, context);
    }
    if(cluster.isActive && chapter.isActive){
      queryObj.clusterId = cluster._id; // For When ClusterId is 'all'
      queryObj.chapterId = chapterId;

      if(userType == "All"){
        // FOR Internal Users
        let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
        _.each(internalUsers, function (user){
          let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
          let profile = _.find(userProfiles, {clusterId:cluster._id});
          if(profile){
            // let roles = _.find(profile.userRoles, {chapterId:(chapterId||"all")});
            let roles = _.find(profile.userRoles, function(obj){
              if((obj.chapterId==chapterId || obj.chapterId=="all")){
                return obj
              }
            })
            if(roles){
              let resp = new MlAdminUserContext().getUserLatLng(user.profile);
              user.latitude = resp.lat;
              user.longitude = resp.lng;
              user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

              let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
              user.roleNames = respRoles;
              users.push(user);
            }
          }
        })

        // FOR External Users
        queryObj.isApprove=true;
        let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          if(externalUsers && externalUsers.length>0){
            _.each(externalUsers, function (user){
              let userProfiles = user.profile.externalUserProfiles;
              userProfiles = _.filter(userProfiles,  {'clusterId': cluster._id, 'chapterId': chapterId});
                if(userProfiles && userProfiles.length>0){
                  let locationName = "subChapterName";
                  var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                  var newArr = _.concat(users,resp);
                  users = newArr
                }
            })
          }
      }
      else if(userType == "BackendUsers"){
        //   // UserType needed to be introduced
        let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
              let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
              let profile = _.find(userProfiles, {clusterId:cluster._id});
              if(profile){
                // let roles = _.find(profile.userRoles, {chapterId:(chapterId||"all")});
                let roles = _.find(profile.userRoles, function(obj){
                  if((obj.chapterId==chapterId || obj.chapterId=="all")){
                    return obj
                  }
                })
                if(roles){
                  let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                  user.latitude = resp.lat;
                  user.longitude = resp.lng;
                  user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

                  let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
                  user.roleNames = respRoles;
                  users.push(user);
                }
              }
          })
      }
      else if (userType == "Ideators" || userType =="Investors" || userType =="Startups" || userType =="Service Providers" || userType =="Companies" || userType =="Institutions"){
        queryObj.communityDefName=userType;
        queryObj.isApprove=true;
        let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
            let userProfiles = user.profile.externalUserProfiles;
            userProfiles = _.filter(userProfiles,  {'clusterId': cluster._id, 'chapterId': chapterId});
              let locationName = "subChapterName";
              let resp = new MlAdminUserContext().getCommunityBasedExternalUser(userProfiles, user, userType, locationName);
              let newArr = _.concat(users,resp);
              users = newArr
          })
      }
    }

  }else if(clusterId != "" && communityCode != ""){
    let cluster = mlDBController.findOne('MlClusters', {_id: clusterId}, context)
    if(cluster.isActive ){
      queryObj.clusterId = clusterId;
      queryObj.communityDefCode = communityCode||"all";

      // FOR Internal Users
      let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
      _.each(internalUsers, function (user){
        let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
        let profile = _.find(userProfiles, {clusterId:clusterId});
        if(profile){
          // let roles = _.find(profile.userRoles, {communityCode:(communityCode||"all")});
          let roles = _.find(profile.userRoles, function(obj){
            if((obj.communityCode==communityCode || obj.communityCode=="all")){
              return obj
            }
          })
          if(roles){
            let resp = new MlAdminUserContext().getUserLatLng(user.profile);
            user.latitude = resp.lat;
            user.longitude = resp.lng;
            user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

            let respRoles = new MlAdminUserContext().getUserRolesName(profile, roles);
            user.roleNames = respRoles;
            users.push(user);
          }
        }
      })

      // External User
      queryObj.isApprove=true;
      let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
        if(externalUsers && externalUsers.length>0) {
          _.each(externalUsers, function (user) {
            let userProfiles = user.profile.externalUserProfiles;
            // userProfiles = _.filter(userProfiles,  {'clusterId': clusterId, 'communityDefCode': communityCode||"all"});
            userProfiles = _.filter(userProfiles, function(obj){
              if(obj.clusterId==clusterId && (obj.communityDefCode == communityCode || obj.communityDefCode == "all")){
                return obj
              }
            })
            if (userProfiles && userProfiles.length>0) {
                let locationName = "chapterName";
                var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                var newArr = _.concat(users,resp);
                users = newArr
            }
          })
        }
    }

  }else if(clusterId != ""){

    let cluster = mlDBController.findOne('MlClusters', {_id: clusterId}, context)
    if(cluster.isActive ){
      queryObj.clusterId = clusterId;

      if(userType == "All"){
        // FOR Internal Users
        let internalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
        _.each(internalUsers, function (user){
          let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
          let profile = _.find(userProfiles, {clusterId:clusterId});
          if(profile){
            let resp = new MlAdminUserContext().getUserLatLng(user.profile);
            user.latitude = resp.lat;
            user.longitude = resp.lng;
            user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");

            let respRoles = new MlAdminUserContext().getUserRolesName(profile, profile.userRoles);
            user.roleNames = respRoles;
            users.push(user);
          }
        })

        // FOR External Users
        queryObj.isApprove=true;
        let externalUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          if(externalUsers && externalUsers.length>0){
            _.each(externalUsers, function (user){
              let userProfiles = user.profile.externalUserProfiles;
              userProfiles = _.filter(userProfiles,  {'clusterId': clusterId});
              if(userProfiles && userProfiles.length>0){
                  let locationName = "chapterName";
                  var resp = new MlAdminUserContext().getAllExternalUser(userProfiles, user, locationName);
                  var newArr = _.concat(users,resp);
                  users = newArr
              }
            })
          }
      }
      else if(userType == "BackendUsers"){
        let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
              let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
              let profile = _.find(userProfiles, {clusterId:clusterId});
              if(profile){
                let resp = new MlAdminUserContext().getUserLatLng(user.profile);
                user.latitude = resp.lat;
                user.longitude = resp.lng;
                user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
                let respRoles = new MlAdminUserContext().getUserRolesName(profile, profile.userRoles);
                user.roleNames = respRoles;
                users.push(user);
              }
          })
      }
      else if (userType == "Ideators" || userType =="Investors" || userType =="Startups" || userType =="Service Providers" || userType =="Companies" || userType =="Institutions"){
        queryObj.communityDefName=userType;
        queryObj.isApprove=true;
        let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
              let userProfiles = user.profile.externalUserProfiles;
              userProfiles = _.filter(userProfiles,  {'clusterId': clusterId});
              let locationName = "chapterName";
              let resp = new MlAdminUserContext().getCommunityBasedExternalUser(userProfiles, user, userType, locationName);
              let newArr = _.concat(users,resp);
              users = newArr
          })
      }
    }

  } else{

      if(userType == "All"){
        let internal = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isInternaluser":true}]}, context, findOptions).fetch();
        let external = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}]}, context, findOptions).fetch();

        // Internal
        _.each(internal, function (user){
          let resp = new MlAdminUserContext().getUserLatLng(user.profile);
          user.latitude = resp.lat;
          user.longitude = resp.lng;
          user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
          var userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
          let defaultProfile = _.find(userProfiles, {isDefault:true});
          if(defaultProfile){
            let roles = new MlAdminUserContext().getUserRolesName(defaultProfile, defaultProfile.userRoles);
            user.roleNames = roles;
          }
          users.push(user);
        })

        // External
        _.each(external, function (user){
          _.each(user.profile.externalUserProfiles, function(externalUserProfile){
            if(externalUserProfile.isActive && externalUserProfile.isApprove){
              let portfolio = MlPortfolioDetails.findOne({profileId:externalUserProfile.profileId, status: 'PORT_LIVE_NOW'});
              if(portfolio) {
                user.communityCode = externalUserProfile.communityDefCode;
                user.portfolioId = portfolio._id;
                user.name = (user.profile.firstName ? user.profile.firstName : "") + " " + (user.profile.lastName ? user.profile.lastName : "");
                user.clusterName = externalUserProfile.clusterName ? externalUserProfile.clusterName : "";
                if (user.profile.externalUserAdditionalInfo && user.profile.externalUserAdditionalInfo.length > 0) {
                  _.each(user.profile.externalUserAdditionalInfo, function (profile) {
                    if (externalUserProfile.profileId == profile.profileId) {
                      var resp = new MlAdminUserContext().getUserLatLng(profile);
                      user.latitude = resp.lat;
                      user.longitude = resp.lng;
                      users.push(user);
                    }
                  })
                }
              }
            }
          })
        })

      }
      else if(userType == "BackendUsers"){
        var internalUsers = mlDBController.find('users', {"$and":[{"profile.isInternaluser":true},{"profile.isSystemDefined":{$exists:false}}]}, context, findOptions).fetch();
        _.each(internalUsers, function (user){
          let resp = new MlAdminUserContext().getUserLatLng(user.profile);
          user.latitude = resp.lat;
          user.longitude = resp.lng;
          user.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
          var userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
          let defaultProfile = _.find(userProfiles, {isDefault:true});
          if(defaultProfile) {
            let roles = new MlAdminUserContext().getUserRolesName(defaultProfile, defaultProfile.userRoles);
            user.roleNames = roles;
          }
          users.push(user);
        })
      }
      else if(userType == "Ideators" || userType =="Investors" || userType =="Startups" || userType =="Service Providers" || userType =="Companies" || userType =="Institutions"){
        queryObj.communityDefName=userType
        queryObj.isApprove=true;
        let allUsers = mlDBController.find('users', {"$and":[{"profile.isSystemDefined":{$exists:false}},{"profile.isExternaluser":true}, {'profile.externalUserProfiles':{$elemMatch: queryObj}}]}, context, findOptions).fetch();
          _.each(allUsers, function (user){
                  let userProfiles = user.profile.externalUserProfiles;
                  let locationName = "clusterName";
                  let resp = new MlAdminUserContext().getCommunityBasedExternalUser(userProfiles, user, userType, locationName);
                  let newArr = _.concat(users,resp);
                  users = newArr
          })
      }
  }

   context.module = "Users";
  //context.userModule = "Users";
  users = _.uniq(users, function (e) {
    return e.portfolioId;
  });
  return {data:users, totalRecords:users&&users.length?users.length:0};
}


MlResolver.MlQueryResolver['fetchUserForReistration'] = (obj, args, context, info) => {

  let query = ""
  let users = [];
 /*   let clusterId=args.clusterId;
    let chapterId=args.chapterId;
    let subChapterId=args.subChapterId;
    let departmentId=args.departmentId*/
  if(args.clusterId && args.chapterId&& args.subChapterId&&args.departmentId&&args.subDepartmentId&&args.roleId){

    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.departmentId":args.departmentId},{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subDepartmentId":args.subDepartmentId},{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.roleId":args.roleId},{"profile.isActive":true}]}, context).fetch();
  }
  else if(args.clusterId&&args.chapterId&&args.subChapterId &&args.departmentId&args.subDepartmentId){
    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.departmentId":args.departmentId},{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subDepartmentId":args.subDepartmentId},{"profile.isActive":true}]}, context).fetch();
  }
  else if(args.clusterId&& args.chapterId&& args.subChapterId&&args.departmentId){
    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.departmentId":args.departmentId},{"profile.isActive":true}]}, context).fetch();
  }
  else if(args.clusterId&& args.chapterId&& args.subChapterId){
    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId":args.subChapterId},{"profile.isActive":true}]}, context).fetch();
  }
  else if(args.clusterId&&args.chapterId){
    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId}, {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId":args.chapterId},{"profile.isActive":true}]}, context).fetch();
  }
  else if(args.clusterId){
    // users = Meteor.users.find({"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId},{"profile.isActive":true}]}).fetch();
    users = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId},{"profile.isActive":true}]}, context).fetch();
  }
  users.map(function (user) {
    // user.username = user.profile.InternalUprofile.moolyaProfile.firstName+" "+user.profile.InternalUprofile.moolyaProfile.lastName;
    user.username = user.profile.firstName+" "+user.profile.lastName;
  })
  return users;
}


MlResolver.MlMutationResolver['updateDataEntry'] = (obj, args, context, info) => {
  // let user = Meteor.users.findOne({_id: args.userId});
  let user = mlDBController.findOne('users', {_id: context.userId}, context)
  let resp;
  if(user){
    // resp = mlDBController.update('users', context.userId,{"profile.profileImage":args.attributes.profileImage,"profile.InternalUprofile.moolyaProfile.firstName":args.attributes.firstName,"profile.InternalUprofile.moolyaProfile.middleName":args.attributes.middleName, "profile.InternalUprofile.moolyaProfile.lastName":args.attributes.lastName,  "profile.InternalUprofile.moolyaProfile.displayName": args.attributes.userName, "profile.genderType": args.attributes.genderType, "profile.dateOfBirth": args.attributes.dateOfBirth},{$set:true}, context)
    // resp = mlDBController.update('users', context.userId,{"profile.profileImage":args.attributes.profileImage,"profile.firstName":args.attributes.firstName,"profile.middleName":args.attributes.middleName, "profile.lastName":args.attributes.lastName,  "profile.displayName": args.attributes.userName, "profile.genderType": args.attributes.genderType, "profile.dateOfBirth": args.attributes.dateOfBirth},{$set:true}, context)
    resp = mlDBController.update('users', context.userId, {
      "profile.profileImage": args.attributes.profileImage,
      "profile.firstName": args.attributes.firstName,
      "profile.middleName": args.attributes.middleName,
      "profile.lastName": args.attributes.lastName,
      "profile.genderType": args.attributes.genderType,
      "profile.dateOfBirth": args.attributes.dateOfBirth,
      "profile.firebaseInfo.frequency": args.attributes.frequency,
    }, {$set: true}, context)
  }
  if(resp){
    MlNotificationController.profileUpdated(context.userId);
    MlSMSNotification.profileUpdated(context.userId);
    MlEmailNotification.onSuccessfulProfileUpdate(context.userId);
    resp = new MlRespPayload().successPayload("User Profile Updated Successfully", 200);
    return resp
  }
  resp = new MlRespPayload().errorPayload("Unable to save Profile", 400);
  return resp
}


MlResolver.MlMutationResolver['updateSettings'] = (obj, args, context, info) => {
  // let user = Meteor.users.findOne({_id: args.userId});
  let user = mlDBController.findOne('users', {_id: context.userId}, context)
  let resp;
  if(user){
    // resp = Meteor.users.update({_id:args.userId}, {$set:{"profile.isActiv`e":args.isActive}});
    resp = mlDBController.update('users', context.userId,{"profile.numericalFormat":args.settingsAttributes.numericalFormat,"profile.currencyTypes":args.settingsAttributes.currencyTypes, 'profile.languages': args.settingsAttributes.languages,'profile.timeZone': args.settingsAttributes.timeZone},{$set:true}, context)
  }
  if(resp){
    resp = new MlRespPayload().successPayload("User Profile Updated Successfully", 200);
    return resp
  }
  resp = new MlRespPayload().errorPayload("Unable to save Profile", 400);
  return resp
}


MlResolver.MlMutationResolver['updateAddressBookInfo'] = (obj, args, context, info) => {
  let id = " "
  let user = mlDBController.findOne('users', {_id: context.userId}, context) || {};
  if (args && args.addressBook) {
    if (args.type == "CONTACTTYPE") {
        let contactTypes = []
        contactTypes = user.profile.contactInfo?user.profile.contactInfo:[];
        contactTypes.push(args.addressBook.contactInfo[0]);
      id = mlDBController.update('users', context.userId, {"profile.contactInfo": contactTypes}, {$set: true}, context)
    } else if (args.type == "ADDRESSTYPE") {
        var addressTypes = [];
        addressTypes = user.profile.addressInfo?user.profile.addressInfo:[];

        if(args.addressBook.addressInfo.length==1 && !args.addressBook.addressInfo[0].latitude || args.addressBook.addressInfo[0].latitude == null || args.addressBook.addressInfo[0].latitude == undefined){
            // Fetching Lat Lng from Address
            let city = args.addressBook.addressInfo[0].addressCity
            let area = args.addressBook.addressInfo[0].addressArea
            let locality = args.addressBook.addressInfo[0].addressLocality
            let pin =args.addressBook.addressInfo[0].addressPinCode
            geocoder.geocode(locality+","+area+","+city+","+pin, Meteor.bindEnvironment(function ( err, data ) {
                if(err){
                    throw new Error("Invalid Locality selection "+e);
                }
                if(data.results.length==0){
                    throw new Error("Invalid Locality selection");
                }
                args.addressBook.addressInfo[0].latitude = data.results[0].geometry.location.lat;
                args.addressBook.addressInfo[0].longitude = data.results[0].geometry.location.lng;

                try{
                    addressTypes.push(args.addressBook.addressInfo[0]);
                    id = mlDBController.update('users', context.userId, {"profile.addressInfo": addressTypes}, {$set: true}, context)

                    if(id){
                      let code = 200;
                      let result = {addressId: id}
                      let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
                      return response
                    }
                }catch(e){
                    throw new Error("Error while updating address "+e);
                }

            }),{key:Meteor.settings.private.googleApiKey});

        }else{
            for(let i=0;i<args.addressBook.addressInfo.length;i++){
                // Finding selected address type object from Address array
                var selectedAddressIndex = null;
                var selectedAddress = _.find(addressTypes, function (obj, index) {
                    if(obj.addressTypeName == args.addressBook.addressInfo[i].addressTypeName){
                        selectedAddressIndex = index;
                        return obj
                    }
                })
                if(!selectedAddress){
                    addressTypes.push(args.addressBook.addressInfo[i]);
                }else{
                    addressTypes.splice(selectedAddressIndex, 1);
                    addressTypes.splice(selectedAddressIndex, 0, args.addressBook.addressInfo[i]);
                }
            }
            try{
                id = mlDBController.update('users', context.userId, {"profile.addressInfo": addressTypes}, {$set: true}, context)

                if(id){
                  let code = 200;
                  let result = {addressId: id}
                  let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
                  return response
                }
            }catch(e){
                throw new Error("Error while updating address "+e);
            }
        }

    } else if (args.type == "EMAILTYPE") {
        let emailTypes = []
        emailTypes = user.profile.emailInfo?user.profile.emailInfo:[];
        emailTypes.push(args.addressBook.emailInfo[0]);
      id = mlDBController.update('users', context.userId, {"profile.emailInfo": emailTypes}, {$set: true}, context)
    }
    if (id) {
      let code = 200;
      //let insertedData = users.findOne(id) || {};
      let result = {update: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}



MlResolver.MlQueryResolver['fetchAddressBookInfo'] = (obj, args, context, info) => {
  // let rest = null;
  let user = mlDBController.findOne('users', {_id: context.userId}, context);
  return user.profile;
}

MlResolver.MlQueryResolver['findBranchAddressInfo'] = (obj, args, context, info) => {
  let rest = null;
  var branchAddress = [];
  let user = mlDBController.findOne('users', {_id: context.userId}, context);
  if(user && user.profile && user.profile.externalUserAdditionalInfo[0] && user.profile.externalUserAdditionalInfo[0].addressInfo){
      var addressInfo = user.profile.externalUserAdditionalInfo[0].addressInfo
      if(addressInfo){
        branchAddress = _.filter(addressInfo, function (item) {
            return item.addressTypeName === 'Branch'
        })
      }
  }
  return branchAddress;
}

MlResolver.MlQueryResolver['findUserOnToken'] = (obj, args, context, info) => {
  const hashedToken = Accounts._hashLoginToken(args.token)
  const user = Meteor.users.findOne({'services.resume.loginTokens.hashedToken':hashedToken})    //
  if(user){
    let code = 200;
    let result = user.profile.isExternaluser
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }else{
    let code = 401;
    let result = "Not a valid User token"
    let response = new MlRespPayload().errorPayload(result, code);
    return response
  }
}
MlResolver.MlQueryResolver['passwordVerification'] = (obj, args, context, info) => {
  if (context.userId) {
    var user = mlDBController.findOne('users', {_id: context.userId}, context);
    let pwd = {digest: args.Details, algorithm: 'sha-256'};
    var result = Accounts._checkPassword(user, pwd);
    if(result.error) {
      let code = 404;
      let errorResponse = new MlRespPayload().errorPayload(result, code);
      return errorResponse
    }else{

        let code = 200;
        let successResponse = new MlRespPayload().successPayload(result, code);
        return successResponse
    }
  }else{
    return false;
  }
}


MlResolver.MlMutationResolver['uploadUserImage'] = (obj, args, context, info) => {
  const user = Meteor.users.findOne({'_id':args.userId})
  if(user){
    let result = Meteor.users.update({'_id': args.userId}, {$set:{'profile.profileImage':args.userProfilePic}})
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

MlResolver.MlQueryResolver['fetchInternalUserProfiles'] = (obj, args, context, info) => {
  let userId=context.userId
  const user = Meteor.users.findOne({_id:userId}) || {}
  if(user){
    var internalUserProfile = user&&user.profile&&user.profile.isInternaluser?user.profile.InternalUprofile:{};
    let moolyaProfile = internalUserProfile&&internalUserProfile.moolyaProfile?internalUserProfile.moolyaProfile:{}
    let userProfiles = moolyaProfile&&moolyaProfile.isActive&&moolyaProfile.userProfiles?moolyaProfile.userProfiles:[];
    userProfiles = _.filter(userProfiles,  function (userData) {
      const isActiveRole = _.findIndex(userData.userRoles || [], {isActive: true});
      if (isActiveRole!=-1){ return true};
    });
   /* for (var k = 0; k < userProfiles.length; k++) {

      let cName = "";
      if(userProfiles[k]){
        const clusterData = mlDBController.findOne('MlClusters', {_id: userProfiles[k].clusterId}, context) || {};
        cName = clusterData.displayName;
      }else if( userProfiles[k].clusterId == 'all'){
        cName = "All";
      }
      userProfiles[k].clusterName = cName
    }*/

    userProfiles.map(function (user,index) {
      let cName = null
      let cFlag = null
      if(user &&  user.clusterId  && user.clusterId != 'all'){
        let clusterData = mlDBController.findOne('MlClusters', {_id: user.clusterId}, context) || {};
        cName = clusterData.displayName;
        cFlag = clusterData.countryFlag;

      }else if( user.clusterId == 'all'){
        cName = "All";
      }
      userProfiles[index].clusterName = cName
      userProfiles[index].clusterFlag = cFlag
    })


    /* userProfiles=_.filter(userProfiles, {'isDefault': true })||[];*/
    return userProfiles;
  }else {
    let code = 409;
    let response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

}

MlResolver.MlMutationResolver['setAdminDefaultProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  var update=null;
  var result=null;
  const user = mlDBController.findOne('users',{_id:userId}) || {}
  if(user&&args&&args.clusterId){
    var hasSwitchedProfile=user.profile.hasSwitchedProfile;

    /**switch profile/make default- if user has makes a profile as default,check for profile switch flag and set switchedProfileDefaultId to selected id
     * if user has switched his profile, then switchedProfileDefaultId value has the default profile Id.
     *Once user logs in again, default profile Id will be retained and switchProfile details will be cleared.
     * */
    if(hasSwitchedProfile){
      result= mlDBController.update('users',{'_id':userId,"profile.hasSwitchedProfile": true,'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'clusterId': args.clusterId}}},
        {"profile.switchedProfileDefaultId": args.clusterId}, {$set: true}, context);
    }else{
      result= mlDBController.update('users', {'_id':userId,'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'isDefault': true}}},
        {"profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": false}, {$set: true,multi:true}, context);

      /**check if hasSwitchedProfile value is false/null/undefined/not exists*/
      result= mlDBController.update('users',{'_id':userId,$or:[{"profile.hasSwitchedProfile":false},{"profile.hasSwitchedProfile" : { $type: 10 }},{"profile.hasSwitchedProfile":{ $exists: false } }],'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'clusterId': args.clusterId}}},
        {"profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": true,
          "profile.switchedProfileDefaultId":null}, {$set: true}, context);
    }

    response = new MlRespPayload().successPayload({}, 200);


  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }
  return response;
}

MlResolver.MlMutationResolver['deActivateAdminUserProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  const user = mlDBController.findOne('users',{_id:userId}) || {}
  if(user&&args&&args.clusterId){
    result = mlDBController.update('users', {'profile.externalUserProfiles':{$elemMatch: {'clusterId': args.clusterId}}},
      {"profile.externalUserProfiles.$.isActive": true}, {$set: true}, context);
    response = new MlRespPayload().successPayload({}, 200);
  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

  return response;

}


MlResolver.MlQueryResolver['fetchUserRoleDetails'] = (obj, args, context, info) => {
  let userId=context.userId
  const user = mlDBController.findOne('users',{_id:userId}) || {}
  if(user){
    var internalUserProfile = user&&user.profile&&user.profile.isInternaluser?user.profile.InternalUprofile:{};
    let moolyaProfile = internalUserProfile&&internalUserProfile.moolyaProfile?internalUserProfile.moolyaProfile:{}
    let userProfiles = moolyaProfile&&moolyaProfile.isActive&&moolyaProfile.userProfiles?moolyaProfile.userProfiles:[]
    if(args&&args.clusterId){
      userProfiles=_.filter(userProfiles, {'clusterId':args.clusterId})||[]
    }
    let hirarichyLevel = [];
    let userProfileData = userProfiles&&userProfiles[0]?userProfiles[0]:{}
    let userRolesData = userProfileData&&userProfileData.userRoles?userProfileData.userRoles:[];
    hirarichyLevel = _underscore.pluck(userRolesData, 'hierarchyLevel') || [];
    hirarichyLevel.sort(function (a, b) {
      return b - a
    });
    let defaultRole = {}
    for (let i = 0; i < userRolesData.length; i++) {
      if ((userRolesData[i].hierarchyLevel == hirarichyLevel[0]) && userRolesData[i].isActive) {
        defaultRole = userRolesData[i]
        break
      }
    }

    if(defaultRole && defaultRole.clusterId && defaultRole.clusterId != 'all'){
      const clusterData = mlDBController.findOne('MlClusters', {_id: defaultRole.clusterId}, context) || {};
      defaultRole.clusterName = clusterData.displayName;
    }else if( defaultRole.clusterId == 'all'){
      defaultRole.clusterName = "All";
    }

    if(defaultRole && defaultRole.subChapterId && defaultRole.subChapterId != 'all'){
      const subChapterData = mlDBController.findOne('MlSubChapters', {_id: defaultRole.subChapterId}, context) || {};
      defaultRole.subChapterName = subChapterData.subChapterDisplayName;
    }else if( defaultRole.subChapterId == 'all'){
      defaultRole.subChapterName = "All";
    }

    if(defaultRole && defaultRole.chapterId && defaultRole.chapterId != 'all'){
      const chapterData = mlDBController.findOne('MlChapters', {_id: defaultRole.chapterId}, context) || {};
      defaultRole.chapterName = chapterData.chapterName;
    }else if( defaultRole.chapterId == 'all'){
      defaultRole.chapterName = "All";
    }

    if(defaultRole && defaultRole.communityId && defaultRole.communityId != 'all'){
      const communityData= mlDBController.findOne('MlCommunityDefinition', {code: defaultRole.communityId}, context)|| {};
      defaultRole.communityName = communityData.name;
    }else if( defaultRole.communityId == 'all'){
      defaultRole.communityName = "All";
    }

/*    if(defaultRole && defaultRole.departmentId && defaultRole.departmentId != 'all'){
      const departmentData= MlDepartments.findOne({_id:defaultRole.departmentId}) || {}
      defaultRole.departmentName = departmentData.displayName;
    }else if( defaultRole.departmentId == 'all'){
      defaultRole.departmentName = "All";
    }

    if(defaultRole && defaultRole.subDepartmentId && defaultRole.subDepartmentId != 'all'){
      const subdepartmentData= MlSubDepartments.findOne({_id:defaultRole.subDepartmentId}) || {}
      defaultRole.subDepartmentName = subdepartmentData.displayName;
    }else if( defaultRole.subDepartmentId == 'all'){
      defaultRole.subDepartmentName = "All";
    }*/



    /* userProfiles=_.filter(userProfiles, {'isDefault': true })||[];*/
    return defaultRole;
  }else {
    let code = 409;
    let response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }

}


MlResolver.MlQueryResolver['fetchMoolyaInternalUsers'] = (obj, args, context, info) => {
  var getUsers = mlDBController.find('users', {
      'profile.isActive': true, 'profile.isExternaluser': false, 'profile.isMoolya': true
    }, context).fetch() || [];
  return getUsers
}


MlResolver.MlQueryResolver['getUserProfiles'] = (obj, args, context, info) => {

  let result = mlDBController.find('users', {_id:context.userId} , context).fetch()
  let temp =[];
  let userProfile = result[0].profile.externalUserProfiles;
  userProfile.map(function(profile){
        temp.push(profile)
  })

  temp.map(function(inst){
    inst.displayName = result[0].profile.displayName;
    inst.profileImage = result[0].profile.profileImage;
  })
  return temp;
}

MlResolver.MlQueryResolver['getUserProfile'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('users', {'profile.externalUserProfiles.profileId':args.profileId} , context)
let profile = [];
  let temp = result.profile.externalUserProfiles;
  temp.map(function(data) {
    if(data.profileId === args.profileId) {
      profile.push(data)
    }
  })

  return profile[0];
}

MlResolver.MlMutationResolver['switchProfile'] = (obj, args, context, info) => {
  let userId=context.userId;
  var response=null;
  var result=null;
  const user = mlDBController.findOne('users',{_id:userId}) || {};
  if(user&&args&&args.clusterId){
    var defaultUserProfile=_.find(user.profile.InternalUprofile.moolyaProfile.userProfiles, {'isDefault':true })||user.profile.InternalUprofile.moolyaProfile.userProfiles[0];
    var defaultUserProfileId=defaultUserProfile?defaultUserProfile.clusterId:null;
    /**Check if switchedProfileDefaultId exists for the first time and update defaultUserProfileId*/
    result= mlDBController.update('users',{'_id':userId,$or:[{"profile.switchedProfileDefaultId" : { $type: 10 }},{"profile.switchedProfileDefaultId":{ $exists: false } }]},
      {"profile.switchedProfileDefaultId":defaultUserProfileId}, {$set: true,multi:false}, context);

    /**clear the default flag of all profiles*/
    result= mlDBController.update('users', {'_id':userId,'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'isDefault': true}}},
      {"profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": false}, {$set: true,multi:true}, context);

    /**switch profile - if user has switched profile,make the profile as default */
      result= mlDBController.update('users',{'_id':userId,'profile.InternalUprofile.moolyaProfile.userProfiles':{$elemMatch: {'clusterId': args.clusterId}}},
        {"profile.hasSwitchedProfile": true,
         "profile.InternalUprofile.moolyaProfile.userProfiles.$.isDefault": true}, {$set: true}, context);

      if(result==1) response = new MlRespPayload().successPayload({}, 200);


  }else {
    let code = 409;
    response = new MlRespPayload().errorPayload('Not a valid user', code);
    return response;
  }
  return response;
}

MlResolver.MlQueryResolver['getUserProfileForService'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('users', {'profile.externalUserProfiles.profileId':args.profileId} , context)
  let profile = [];
  let temp = result.profile.externalUserProfiles;
  temp.map(function(data) {
    if(data.profileId === args.profileId) {
      profile.push(data)
    }
  })
  if (profile && profile.length > 0) {
    let cluster = mlDBController.findOne('MlClusters', {_id: profile[0].clusterId} , context);
    profile[0].countryId = cluster && cluster.countryId;
  }
  return profile[0];
}

/**
 * @module ['left nav USERS']
 * getting external user addition info
 * */
MlResolver.MlQueryResolver['findExternalUserAddressBook'] = (obj, args, context, info) => {
  var additionalInfo = {}
  let registrationId=args.registrationId;
  var  reg= mlDBController.findOne('MlRegistration',{_id:registrationId},context) || {};

  // var userId = reg.registrationInfo.userId
  var userId = reg.registrationInfo && reg.registrationInfo.userId?reg.registrationInfo.userId : ''
  var  user= mlDBController.findOne('users',{_id:userId},context) || {};
  if(user && user.profile && user.profile.externalUserProfiles && user.profile.externalUserAdditionalInfo){
    // var clusterId;
    // let profile = new MlUserContext(userId).userProfileDetails(userId)
    // registrationId = profile.registrationId;

    var profile = _.find(user.profile.externalUserProfiles, {registrationId:registrationId})
    var profileId = profile.profileId;
    additionalInfo = _.find(user.profile.externalUserAdditionalInfo, {'profileId': profileId});
    return additionalInfo;

    // clusterId = profile.clusterId;
    // const addInfo = user.profile.externalUserAdditionalInfo?user.profile.externalUserAdditionalInfo:[]
    // var infoDetails;
    // infoDetails = _underscore.find(addInfo, {'profileId': profile.profileId}) || {};
    // return infoDetails;
  }else
    return additionalInfo

  // else {
  //   let code = 409;
  //   let response = new MlRespPayload().errorPayload('Not a valid user', code);
  //   return response;
  // }
}

MlResolver.MlQueryResolver['fetchAnchorUsers'] = (obj, args, context, info) => {
  var query = []
  var clusterId = args.clusterId || ''
  var chapterId = args.chapterId || ''
  var subChapterId = args.subChapterId || ''
  if (args.clusterId && args.chapterId && args.subChapterId) {
    // query.push({
    //   '$match': {
    //     '$and': [{'profile.isInternaluser': true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.isAnchor': true}],
    //     '$or': [{'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId': args.clusterId},
    //       {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId': args.chapterId},
    //       {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId': args.subChapterId}]
    //   }
    // })
    query.push({
      '$match': {
        '$and': [{'profile.isInternaluser': true}, {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.isAnchor': true},{'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId': args.clusterId},
          {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.chapterId': args.chapterId},
          {'profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subChapterId': args.subChapterId}]
      }
    })
  }
  query.push({
    "$project": {
      _id: 1, "displayName": {$concat: ["$profile.firstName", " ", "$profile.lastName"]},
      "userName": "$username",
      "profileImage": "$profile.profileImage"
    }
  })
  var response = mlDBController.aggregate('users', query, context)
  var portfolioCount = portfolioValidationRepo.getLivePortfolioCount(clusterId, chapterId, subChapterId)
  return {userDetails: response, portfolioCounter: portfolioCount}
}
//todo:// restrict anchor user to update "isActive" status maintain the old status only
checkAnchorAccess = function (args, context) {
  var isAccess = true
  var userProfile = new MlAdminUserContext().userProfileDetails(context.userId)
  if (userProfile && userProfile.isAnchor) {
    if (args.userId === context.userId)
      isAccess = true
    else
      isAccess = false
  }
  return isAccess
}


MlResolver.MlQueryResolver['checkDefaultRole'] = (obj, args, context, info) => {
  var  userInfo = mlDBController.findOne('users',{_id:args.userId},context) || {};
   return userInfo.profile.InternalUprofile.moolyaProfile.userProfiles;
};

MlResolver.MlQueryResolver['fetchCurrencyType'] = (obj, args, context, info) => {
  let clusterId = null;

  if(args.portfolioDetailsId) clusterId = mlDBController.findOne('MlPortfolioDetails', args.portfolioDetailsId, context).clusterId;

  else {
    let userId = args.userId ? args.userId : context.userId;
    var userInfo = mlDBController.findOne('users', userId, context) || {};
    let userDetails = {userInfo: userInfo, userId: userId, profileId: args.profileId}
    let userType = userInfo.profile && userInfo.profile.InternalUprofile && userInfo.profile.InternalUprofile.moolyaProfile ? "admin" : "user"
    if (userType === "admin") clusterId = new MlAdminUserContext().userProfileDetails(userId).clusterId;
    else clusterId = new MlUserContext(userId).currencyTypeForEndUsers(userDetails);
  }

  var  clusterInfo = MlClusters.findOne(clusterId, context)
  var  currencyInfo = MlCurrencyType.findOne({countryName:clusterInfo.countryName}, context);
  return currencyInfo;
  }

/**
 * @function <**************<start>*****************>
 */
  getParentRoleStatus = (role)=>{
    return mlDBController.findOne('MlRoles', {_id:role.roleId}) || {}
  }

  getRoleCombination = (role, context) => {
    let roleCombination;
    if (role.communityId != 'all') {
      const communityData = mlDBController.findOne('MlCommunity', { _id: role.communityId }, context) || {};
      roleCombination = communityData.clusterName + ' - ' + communityData.chapterName + ' - ' + communityData.subChapterName + ' - ' + getCommunityName(role.communityCode)
    } else if (role.communityId == 'all' && role.hierarchyLevel == 0) {
      const clusterData = mlDBController.findOne('MlClusters', { _id: role.clusterId }, context) || {};
      roleCombination = clusterData.clusterName + ' - ' + getCommunityName(role.communityCode)
    } else if (role.subChapterId != 'all') {
      const subChapterData = mlDBController.findOne('MlSubChapters', { _id: role.subChapterId }, context) || [];
      roleCombination = subChapterData.clusterName + ' - ' + subChapterData.chapterName + ' - ' + subChapterData.subChapterName
    } else if (role.chapterId != 'all') {
      const chapterData = mlDBController.findOne('MlChapters', { _id: role.chapterId }, context) || {};
      roleCombination = chapterData.clusterName + ' - ' + chapterData.chapterName
    } else if (role.clusterId != 'all') {
      const clusterData = mlDBController.findOne('MlClusters', { _id: role.clusterId }, context) || {};
      roleCombination = clusterData.clusterName
    }
    return roleCombination;
  }
