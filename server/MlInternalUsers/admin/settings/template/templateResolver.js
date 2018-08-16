import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateAccount'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
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
  if (!args.accountName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Account Name is Required", code);
    return response;
  }
  if (MlAccountTypes.find({accountName: args.accountName}).count() > 0) {
    let code = 409;
    return new MlRespPayload().errorPayload("'Account type' already exists", code);
  }
  else {
    // let id = MlAccountTypes.insert({...args});
    let id = mlDBController.insert('MlAccountTypes', args, context);
    if (id) {
      let code = 200;
      let result = {templateId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlMutationResolver['UpdateAccount'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
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
  args.updatedBy = createdBy;
  args.updatedDate = new Date();

  if (!args.accountName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Account Name is Required", code);
    return response;
  } else {
    if (args._id) {
      var id = args._id;
      args = _.omit(args, '_id');
      // let result= MlAccountTypes.update({_id:id}, {$set: args});
      let result = mlDBController.update('MlAccountTypes', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['FetchAccount'] = (obj, args, context, info) => {
  // if (args._id) {
  //   var id= args._id;
  let result = mlDBController.find('MlAccountTypes', {isActive: true}, context).fetch() || [];
  // let response= MlAccountTypes.findOne({"_id":id});
  return result;
  // }

}


MlResolver.MlQueryResolver['FindAccount'] = (obj, args, context, info) => {
  // if (args._id) {
  //   var id= args._id;
  let result = mlDBController.findOne('MlAccountTypes', {"_id": args._id}, context) || [];
  // let response= MlAccountTypes.findOne({"_id":id});
  return result;
  // }

}

