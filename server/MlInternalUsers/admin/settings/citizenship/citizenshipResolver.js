import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateCitizenship'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.citizenshipTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("'Citizenship Name' is Required", code);
    return response;
  } else {
    let query = {
      "$or": [
        {
          citizenshipTypeName: {
            "$regex": new RegExp('^' + args.citizenshipTypeName + '$', 'i')
          }
        },
        {
          citizenshipTypeDisplayName: {
            "$regex": new RegExp("^" + args.citizenshipTypeDisplayName + '$', 'i')
          }
        }
      ]
    };
    let isFind = MlCitizenship.find(query).fetch();
    if (isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Citizenship type' already exists!", code);
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

    // let id = MlCitizenship.insert({...args});
    let id = mlDBController.insert('MlCitizenship', args, context);
    if (id) {
      let code = 200;
      let result = {citizenshipId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlMutationResolver['UpdateCitizenship'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.citizenshipTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Citizenship Name is Required", code);
    return response;
  } else {
    if (args._id) {
      var id = args._id;
      let query = {
        "_id": {
          "$ne": id
        },
        "$or": [
          {
            citizenshipTypeName: {
              "$regex": new RegExp('^' + args.citizenshipTypeName + '$', 'i')
            }
          },
          {
            citizenshipTypeDisplayName: {
              "$regex": new RegExp("^" + args.citizenshipTypeDisplayName + '$', 'i')
            }
          }
        ]
      };

      let isFind = MlCitizenship.find(query).fetch();
      if (isFind.length) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Citizenship type' already exists!", code);
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

      // let result = MlCitizenship.update(id, {$set: args});
      let result = mlDBController.update('MlCitizenship', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response;
    }
  }
};

MlResolver.MlQueryResolver['FindCitizenship'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlCitizenship.findOne({"_id": id});
    return response;
  }
}
MlResolver.MlQueryResolver['FetchCitizenship'] = (obj, args, context, info) => {
  // TODO : Authorization

  let result = MlCitizenship.find({isActive: true}).fetch() || [];
  return result;
}





