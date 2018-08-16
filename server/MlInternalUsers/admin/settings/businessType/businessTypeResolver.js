import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateBusinessType'] = (obj, args, context, info) => {
  // TODO : Authorization
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.businessTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Business Name is Required", code);
    return response;
  } else {
    let query = {
      "$or": [
        {
          businessTypeName: {
            "$regex": new RegExp('^' + args.businessTypeName + '$', 'i')
          }
        },
        {
          businessTypeDisplayName: {
            "$regex": new RegExp("^" + args.businessTypeDisplayName + '$', 'i')
          }
        }
      ]
    };
    let isFind = MlBusinessType.find(query).fetch();
    if (isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("Already Exists!!!!", code);
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

    // let id = MlBusinessType.insert({...args});
    let id = mlDBController.insert('MlBusinessType', args, context);
    if (id) {
      let code = 200;
      let result = {businessTypeId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}

MlResolver.MlMutationResolver['UpdateBusinessType'] = (obj, args, context, info) => {
  // TODO : Authorization
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.businessTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Business Name is Required", code);
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
            businessTypeName: {
              "$regex": new RegExp('^' + args.businessTypeName + '$', 'i')
            }
          },
          {
            businessTypeDisplayName: {
              "$regex": new RegExp("^" + args.businessTypeDisplayName + '$', 'i')
            }
          }
        ]
      };
      let isFind = MlBusinessType.find(query).fetch();
      if (isFind.length) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("Already Exists!!!!", code);
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

      // let result = MlBusinessType.update(id, {$set: args});
      let result = mlDBController.update('MlBusinessType', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}

MlResolver.MlQueryResolver['FindBusinessType'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id = args._id;
    let response = MlBusinessType.findOne({"_id": id});
    return response;
  }
}

MlResolver.MlQueryResolver['fetchBusinessTypes'] = (obj, args, context, info) => {
  let result = MlBusinessType.find({isActive: true}).fetch() || [];
  return result;
}

