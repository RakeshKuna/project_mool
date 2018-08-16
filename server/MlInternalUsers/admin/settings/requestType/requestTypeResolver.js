import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";


MlResolver.MlMutationResolver['CreateRequestType'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  /* if (!isValidAuth) {
     let code = 401;
     let response = new MlRespPayload().errorPayload("Not Authorized", code);
     return response;
   }*/
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
  if (!args.requestName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Request Name is Required", code);
    return response;
  } else {
    // let id = MlRequestType.insert({...args});
    let id = mlDBController.insert('MlRequestType', args, context);
    if (id) {
      let code = 200;
      let result = {permissionId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlMutationResolver['UpdateRequestType'] = (obj, args, context, info) => {

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

  if (!args.requestName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Request Name is Required", code);
    return response;
  } else {
    if (args._id) {
      var id = args._id;
      args = _.omit(args, '_id');
      // let result= MlRequestType.update(id, {$set: args});
      let result = mlDBController.update('MlRequestType', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }

};

MlResolver.MlQueryResolver['FindRequestType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlRequestType.findOne({"_id": id});
    return response;
  }

}

MlResolver.MlQueryResolver['FetchRequestType'] = (obj, args, context, info) => {
  // let result=MlDocumentCategories.find({isActive:true}).fetch()||[];
  let result = MlRequestType.find({isActive: true}).fetch() || [];
  return result;
};

