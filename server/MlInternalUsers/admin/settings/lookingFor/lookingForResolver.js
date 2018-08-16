import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateLookingFor'] = (obj, args, context, info) => {
  // TODO : Authorization
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }
  let query = {
    "$or": [
      {
        lookingForName: {
          "$regex": new RegExp('^' + args.lookingForName + '$', 'i')
        }
      },
      {
        lookingForDisplayName: {
          "$regex": new RegExp("^" + args.lookingForDisplayName + '$', 'i')
        }
      }
    ]
  };
  let isFind = MlLookingFor.find(query).fetch();
  if (isFind.length) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("'Looking for' already exists!", code);
    return response;
  }

  if (MlCommunityDefinition.findOne({code: args.communityCode})) {
    args.communityName = MlCommunityDefinition.findOne({code: args.communityCode}).name;
  }
  var firstName = '';
  var lastName = '';
  // let id = MlDepartments.insert({...args.department});
  if (Meteor.users.findOne({_id: context.userId})) {
    let user = Meteor.users.findOne({_id: context.userId}) || {}
    if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

      firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
      lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
    } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName = (user.profile || {}).firstName || '';
      lastName = (user.profile || {}).lastName || '';
    }
  }
  let createdBy = firstName + ' ' + lastName
  args.createdBy = createdBy;
  args.createdDate = new Date();

  // let id = MlLookingFor.insert({...args});
  let id = mlDBController.insert('MlLookingFor', args, context);
  if (id) {
    let code = 200;
    let result = {lookingForId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}
MlResolver.MlMutationResolver['UpdateLookingFor'] = (obj, args, context, info) => {
  // TODO : Authorization
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (MlCommunityDefinition.findOne({code: args.communityCode})) {
    args.communityName = MlCommunityDefinition.findOne({code: args.communityCode}).name;
  }
  if (args._id) {
    var id = args._id;
    let query = {
      "_id": {
        "$ne": id
      },
      "$or": [
        {
          lookingForName: {
            "$regex": new RegExp('^' + args.lookingForName + '$', 'i')
          }
        },
        {
          lookingForDisplayName: {
            "$regex": new RegExp("^" + args.lookingForDisplayName + '$', 'i')
          }
        }
      ]
    };
    let isFind = MlLookingFor.find(query).fetch();
    if (isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Looking for' already exists!", code);
      return response;
    }
    args = _.omit(args, '_id');
    var firstName = '';
    var lastName = '';
    // let id = MlDepartments.insert({...args.department});
    if (Meteor.users.findOne({_id: context.userId})) {
      let user = Meteor.users.findOne({_id: context.userId}) || {}
      if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

        firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
        lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
      } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
        firstName = (user.profile || {}).firstName || '';
        lastName = (user.profile || {}).lastName || '';
      }
    }
    let createdBy = firstName + ' ' + lastName
    args.updatedBy = createdBy;
    args.updatedDate = new Date();

    // let result = MlLookingFor.update(id, {$set: args});
    let result = mlDBController.update('MlLookingFor', id, args, {$set: 1}, context);
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }

}
MlResolver.MlQueryResolver['FindLookingFor'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlLookingFor.findOne({"_id": id});
    return response;
  }

}

MlResolver.MlQueryResolver['fetchLookingFor'] = (obj, args, context, info) => {
  let result = MlLookingFor.find({isActive: true, communityCode: args.communityCode}).fetch() || [];
  return result;
}


