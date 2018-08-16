import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import _ from "lodash";

MlResolver.MlMutationResolver['updateDocumentFormat'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }
  // let department = MlDepartments.findOne({_id: args.departmentId});
  let department = mlDBController.findOne('MlDepartments', {_id: args.departmentId}, context)
  // let deactivate = args.department.isActive;
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

  if (!args.docFormatName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Document Format Name is Required", code);
    return response;
  } else {
    if (args._id) {

      //check for exists condition
      var existingDocFormat = mlDBController.findOne('MlDocumentFormats', {
        _id: {$ne: args._id},
        docFormatName: args.docFormatName
      }, context)
      if (existingDocFormat) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Document Format' already exists!", code);
        return response;
      }


      var id = args._id;
      args = _.omit(args, '_id');
      // let result = MlDocumentFormats.update(id, {$set: args});
      let result = mlDBController.update('MlDocumentFormats', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['findDocumentFormat'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlDocumentFormats.findOne({"_id": id});
    return response;
  }
}

MlResolver.MlMutationResolver['createDocumentFormat'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.documentFormat.docFormatName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Document Format Name is Required", code);
    return response;
  } else {
    if (MlDocumentFormats.find({docFormatName: args.documentFormat.docFormatName}).count() > 0) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Document Format' already exists!", code);
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
    args.documentFormat.createdBy = createdBy;
    args.documentFormat.createdDate = new Date();
    // args.documentFormat.createdDateTime=new Date();
    // let id = MlDocumentFormats.insert({...args.documentFormat});
    let id = mlDBController.insert('MlDocumentFormats', args.documentFormat, context);
    if (id) {
      let code = 200;
      let result = {documentFormatId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}

MlResolver.MlQueryResolver['fetchDocumentsFormat'] = (obj, args, context, info) => {
  let result = MlDocumentFormats.find({isActive: true}).fetch() || [];
  return result;
}


