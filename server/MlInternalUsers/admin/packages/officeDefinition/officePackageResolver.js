/**
 * Created by venkatsrinag on 28/7/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import MlUserContext from "../../../../MlExternalUsers/mlUserContext";
import _ from "lodash";

MlResolver.MlMutationResolver['createOfficePackage'] = (obj, args, context, info) => {
  if(_.isEmpty(args.package)){
    return new MlRespPayload().errorPayload('Error in creating office package', 400)
  }
  try {
    var office = args.package
    orderNumberGenService.createOfficeSCcode(office)
    office['createdBy'] = context.userId;
    office['createdOn'] = new Date();
    mlDBController.insert('MlOfficeSCDef', office, context)
  }catch (e){
    return new MlRespPayload().errorPayload(e.message, 400)
  }
  return new MlRespPayload().successPayload('Office Package Created Successfully', 200)
}

MlResolver.MlMutationResolver['updateOfficePackage'] = (obj, args, context, info) => {
  if(_.isEmpty(args.packageId) || _.isEmpty(args.package)){
    return new MlRespPayload().errorPayload('Invalid Office', 400)
  }

  try {
    var isOffice = mlDBController.findOne('MlOfficeSCDef', {_id:args.packageId}, context)
    if(!isOffice){
      return new MlRespPayload().errorPayload('Invalid Office', 400)
    }

    var office = args.package;

    //office['_id'] = args.packageId;

    var result = mlDBController.update('MlOfficeSCDef', args.packageId, office, {$set:true, upsert:true}, context)
    if(!result){
      return new MlRespPayload().errorPayload('Error in updating office package', 400)
    }
  }catch (e){
    return new MlRespPayload().errorPayload(e.message, 400)
  }

  return new MlRespPayload().successPayload('Office Package Updated Successfully', 200)
}

/**
 * @module ['OfficePackage']
 * @params [context.userId]
 * @returns *Array* [officePackages]
 * @update [MOOLYA-3478] checking active package
 * */
MlResolver.MlQueryResolver['fetchOfficePackages'] = (obj, args, context, info) => {
  let extProfile = new MlUserContext(context.userId).userProfileDetails(context.userId)
  let query = [
    {'$lookup': {from: 'mlOfficeSC', localField: '_id', foreignField: 'scDefId', as: 'def'}},
    {'$unwind': {"path": "$def", "preserveNullAndEmptyArrays": true}},
    {
      '$match': {
        "$or": [
          {"def.profileId": extProfile.profileId},
          {
            isBSpoke: false,
            isActive: true,
            clusters: {$elemMatch: {clusterId: extProfile.clusterId}},
            chapters: {$elemMatch: {chapterId: extProfile.chapterId}},
            subChapters: {$elemMatch: {subChapterId: extProfile.subChapterId}}
          }]
      }
    }
  ]
  var response = mlDBController.aggregate('MlOfficeSCDef', query, context)
  return response
}

MlResolver.MlQueryResolver['fetchOfficePackageById'] = (obj, args, context, info) => {
  var office;
  if(!args.officePackageId){
    return office
  }

  try {
    office = mlDBController.findOne('MlOfficeSCDef', {_id:args.officePackageId}, context)
    // var frequencyType = mlDBController.findOne('MlFrequencyType', {_id:office.frequencyType}, context)
    // if(!frequencyType)
    //   return;
    // office.frequencyType = frequencyType.displayName
    //
    // var cardType = mlDBController.findOne('MlServiceCardType', {_id:office.cardType}, context)
    // if(!cardType)
    //   return;
    // office.cardType = cardType.displayName
    //
    // var accountType = mlDBController.findOne('MlAccountTypes', {_id:office.accountType}, context)
    // if(!accountType)
    //   return;
    // office.accountType = accountType.accountName

  }catch (e){
    return office
  }

  return office
}
