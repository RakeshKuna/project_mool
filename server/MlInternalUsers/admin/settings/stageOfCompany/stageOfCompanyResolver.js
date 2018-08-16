import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateStageOfCompany'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  let query = {
    "$or": [
      {
        stageOfCompanyName: {
          "$regex": new RegExp('^' + args.stageOfCompanyName + '$', 'i')
        }
      },
      {
        stageOfCompanyDisplayName: {
          "$regex": new RegExp("^" + args.stageOfCompanyDisplayName + '$', 'i')
        }
      }
    ]
  };

  let isFind = MlStageOfCompany.find(query).fetch();
  if (isFind.length) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("'Stage of company type' already exists!", code);
    return response;
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

  // let id = MlStageOfCompany.insert({...args});
  let id = mlDBController.insert('MlStageOfCompany', args, context);
  if (id) {
    let code = 200;
    let result = {stageOfCompanyId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
};

MlResolver.MlMutationResolver['UpdateStageOfCompany'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (args._id) {
    var id = args._id;
    let query = {
      "_id": {
        "$ne": id
      },
      "$or": [
        {
          stageOfCompanyName: {
            "$regex": new RegExp('^' + args.stageOfCompanyName + '$', 'i')
          }
        },
        {
          stageOfCompanyDisplayName: {
            "$regex": new RegExp("^" + args.stageOfCompanyDisplayName + '$', 'i')
          }
        }
      ]
    };
    let isFind = MlStageOfCompany.find(query).fetch();
    if (isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Stage of company type' already exists!", code);
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

    // let result = MlStageOfCompany.update(id, {$set: args});
    let result = mlDBController.update('MlStageOfCompany', id, args, {$set: 1}, context);
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response;
  }
}
MlResolver.MlQueryResolver['FindStageOfCompany'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlStageOfCompany.findOne({"_id": id});
    return response;
  }
}
MlResolver.MlQueryResolver['fetchStageOfCompany'] = (obj, args, context, info) => {
  let result = MlStageOfCompany.find({isActive: true}).fetch() || [];
  return result;
}

