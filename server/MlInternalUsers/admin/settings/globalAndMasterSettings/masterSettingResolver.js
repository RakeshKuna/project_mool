/**
 * Created by mohammed.mohasin on 05/03/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
import MlMasterSettingRepo from './repository/mlMasterSettingRepo';
// import MlRespPayload from '../../../../commons/mlPayload'

MlResolver.MlQueryResolver['fetchMasterSettingsForDropDown'] = (obj, args, context, info) => {
  // TODO : Authorization
  console.log(args);
  let masterRecord=new MlMasterSettingRepo(context.userId).getDroDownMasterSettings(args);
  return masterRecord;
}
MlResolver.MlQueryResolver['fetchMasterSettings'] = (obj, args, context, info) => {
  // TODO : Authorization
         console.log(args);
     return MlMasterSettings.find({type:args.type,isActive:true}).fetch();
}

MlResolver.MlQueryResolver['findMasterSetting'] = (obj, args, context, info) => {
  // TODO : Authorization
  console.log(args);

  return MlMasterSettings.findOne({_id:args._id});
}

MlResolver.MlMutationResolver['createMasterSetting'] = (obj, args, context, info) => {
  // TODO : Authorization
  let masterRecord=new MlMasterSettingRepo(context.userId).updateMasterSetting(args);
  return masterRecord;
};

MlResolver.MlMutationResolver['updateMasterSetting'] = (obj, args, context, info) => {
  // TODO : Authorization
  // let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  // if (!isValidAuth) {
  //   let code = 401;
  //   let response = new MlRespPayload().errorPayload("Not Authorized", code);
  //   return response;
  // }

  let masterRecord=new MlMasterSettingRepo(context.userId).updateMasterSetting(args, context);
  return masterRecord;
};

MlResolver.MlQueryResolver['fetchMasterSettingsForPlatFormAdmin'] = (obj, args, context, info) => {
  // TODO : Authorization
  let masterRecord=new MlMasterSettingRepo().dropDownMasterSettingsPlatformAdmin(args);
  return masterRecord;
}



