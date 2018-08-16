/**
 * Created by venkatsrinag on 21/4/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['createSubDomain'] = (obj, args, context, info) => {
  let firstName = '';
  let lastName = '';
  // let id = MlDepartments.insert({...args.department});
  if (Meteor.users.findOne({_id: context.userId})) {
    let user = Meteor.users.findOne({_id: context.userId}) || {};
    if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

      firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
      lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
    } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName = (user.profile || {}).firstName || '';
      lastName = (user.profile || {}).lastName || '';
    }
  }
  let createdBy = firstName + ' ' + lastName;
  args.SubDomainMasterData.createdBy = createdBy;
  args.SubDomainMasterData.createdDate = new Date();

  if (args && args.SubDomainMasterData) {
    try {
      let findSubDomain = {};
      findSubDomain.name = args.SubDomainMasterData.name.trim();
      findSubDomain.industryId = args.SubDomainMasterData.industryId.trim();

      let resultSubDomain = MlSubDomain.findOne(findSubDomain);
      if (resultSubDomain) {
        let errorMessage = 'SubDomain "' + args.SubDomainMasterData.name + '" given industry' +
          ' exists already !';
        return new MlRespPayload().errorPayload(errorMessage, 400);
      }
      else {
        // let ret = MlSubDomain.insert({...args.SubDomainMasterData});
        let ret = mlDBController.insert('MlSubDomain', args.SubDomainMasterData, context);
        if (ret) {
          return new MlRespPayload().successPayload("Sub Domain added successfully", 200);
        }
        else {
          return new MlRespPayload().errorPayload("Sub-Domain could not be added", 400);
        }
      }
    }
    catch (e) {
      return new MlRespPayload().errorPayload(e.message, 401);
    }
  }
};

MlResolver.MlMutationResolver['updateSelectedSubDomain'] = (obj, args, context, info) => {
  let firstName = '';
  let lastName = '';
  // let id = MlDepartments.insert({...args.department});
  if (Meteor.users.findOne({_id: context.userId})) {
    let user = Meteor.users.findOne({_id: context.userId}) || {};
    if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

      firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
      lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
    } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName = (user.profile || {}).firstName || '';
      lastName = (user.profile || {}).lastName || '';
    }
  }
  let createdBy = firstName + ' ' + lastName;
  args.SubDomainMasterData.updatedBy = createdBy;
  args.SubDomainMasterData.updatedDate = new Date();

  if (args && args.SubDomainId && args.SubDomainMasterData) {
    try {
      let findObject = {};
      findObject.name = args.SubDomainMasterData.name.trim();
      findObject.industryId = args.SubDomainMasterData.industryId.trim();

      let resultSubDomain = MlSubDomain.findOne(findObject);
      if (resultSubDomain && resultSubDomain._id !== args.SubDomainId) {
        return new MlRespPayload().errorPayload("Sub Domain name exists already!", 400);
      }
      // let resp = MlSubDomain.update({_id: args.SubDomainId}, {$set: args.SubDomainMasterData}, {upsert: true});
      let resp = mlDBController.update('MlSubDomain', args.SubDomainId, args.SubDomainMasterData, {
        $set: 1,
        upsert: true
      }, context);
      if (resp) {
        return new MlRespPayload().successPayload("Sub-Domain updated successfully", 200);
      }
      else {
        return new MlRespPayload().errorPayload("Sub-Domain could not be updated", 400);
      }
    }
    catch (e) {
      return new MlRespPayload().errorPayload(e.message, 400);
    }
  }
};

MlResolver.MlQueryResolver['findSubDomain'] = (obj, args, context, info) => {
  if (args && args.SubDomainId) {
    return MlSubDomain.findOne({"_id": args.SubDomainId})
  }
}


MlResolver.MlQueryResolver['fetchIndustryDomain'] = (obj, args, context, info) => {
  if (args && args.industryId) {
    return MlSubDomain.find({industryId: args.industryId, isActive: true}).fetch();
  }
}

MlResolver.MlQueryResolver['fetchIndustryBasedSubDomain'] = (obj, args, context, info) => {

  var queryChange;
  queryChange = {
    $and: [{
      isActive: true
    }, {
      'industryId': {
        $in: args.industryId
      }
    }]
  }
  //return MlSubDomain.find({industryId:args.industryId, isActive : true}).fetch();
  return mlDBController.find('MlSubDomain', queryChange, context).fetch() || []
}
