/**
 * Created by venkatsrinag on 21/4/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'


MlResolver.MlMutationResolver['createAssets'] = (obj, args, context, info) => {
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
  args.assetsMasterData.createdBy = createdBy;
  args.assetsMasterData.createdDate = new Date();
  if (args && args.assetsMasterData) {
    try {
      // let ret = MlAssets.insert({...args.assetsMasterData});
      let ret = mlDBController.insert('MlAssets', args.assetsMasterData, context);
      if (ret) {
        let response = new MlRespPayload().successPayload("Asset added successfully", 200);
        return response;
      }
      else {
        let response = MlRespPayload.errorPayload("Asset could not be added", 400);
        return response;
      }
    }
    catch (e) {
      let response = MlRespPayload.errorPayload(e.message, 400);
      return response;
    }

  }
}

MlResolver.MlMutationResolver['updateSelectedAsset'] = (obj, args, context, info) => {
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
  args.assetsMasterData.updatedBy = createdBy;
  args.assetsMasterData.updatedDate = new Date();

  if (args && args.assetId && args.assetsMasterData) {
    try {
      // let resp = MlAssets.update({_id: args.assetId}, {$set: args.assetsMasterData}, {upsert: true});
      let resp = mlDBController.update('MlAssets', args.assetId, args.assetsMasterData, {
        $set: 1,
        upsert: true
      }, context);
      if (resp) {
        let response = new MlRespPayload().successPayload("Asset updated successfully", 200);
        return response;
      }
      else {
        let response = new MlRespPayload.errorPayload("Asset could not be updated", 400);
        return response;
      }
    }
    catch (e) {
      let response = new MlRespPayload.errorPayload(e.message, 400);
      return response;
    }
  }
}

MlResolver.MlQueryResolver['fetchAssets'] = (obj, args, context, info) => {
  return MlAssets.find({isActive: true}).fetch();
}

MlResolver.MlQueryResolver['findAsset'] = (obj, args, context, info) => {
  if (args && args.assetId) {
    return MlAssets.findOne({"_id": args.assetId})
  }
}
