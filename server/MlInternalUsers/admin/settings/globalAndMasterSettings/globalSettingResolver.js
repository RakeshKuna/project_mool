/**
 * Created by mohammed.mohasin on 04/03/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
import MlGlobalSettingRepo from './repository/mlGlobalSettingRepo';
import MlRespPayload from '../../../../commons/mlPayload'
import MlAdminUserContext from '../../../../mlAuthorization/mlAdminUserContext'

MlResolver.MlQueryResolver['fetchGlobalSettings'] = (obj, args, context, info) => {
  // TODO : Authorization
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
   let result = mlDBController.findOne('MlGlobalSettings', {hierarchyRefId:clusterId}, context)||{};
   // return MlGlobalSettings.find({}).fetch();
  let cluster = mlDBController.findOne("MlClusters", {"_id": clusterId}, context)
  if(cluster){
    let countryCode = cluster.clusterCode
    let countryCapital = mlDBController.findOne("MlCountries", {"countryCode": countryCode}, context) || {}
    if(!result.regionalInfo){
      result.regionalInfo={};
    }
    result.regionalInfo.capitalName = countryCapital.capital
    result.regionalInfo.regionalFlag = cluster.countryFlag
  }
     return [result];
}


MlResolver.MlMutationResolver['updateGlobalSetting'] = (obj, args, context, info) => {
  // TODO : Authorization
     let globalSettingRecord=new MlGlobalSettingRepo(context.userId).updateGlobalSetting(args, context);
     return globalSettingRecord;
}

MlResolver.MlQueryResolver['findTimeZones'] = (obj, args, context, info) => {
  //ommited args clusterId
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
  let response
  if(clusterId){
    if(clusterId === "all") {
      let timeZones = mlDBController.find("MlTimeZones", {}, context).fetch();
      return timeZones
    }else {
      let cluster = mlDBController.findOne("MlClusters", {"_id": clusterId}, context)
      if(cluster && cluster._id){
        let timeZones = mlDBController.find("MlTimeZones", {"countryCode": cluster.clusterCode}, context).fetch();
        if (timeZones) {
          timeZones.map(function (tz) {
            tz.timeZone = tz.timeZone+" "+tz.gmtOffset
          })
          let code = 200;
          let response = new MlRespPayload().successPayload('', code);
          return timeZones
        }
      }
    }

  }

  return [];
}
MlResolver.MlQueryResolver['findRounding'] = (obj, args, context, info) => {
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
  if (clusterId) {
      let cluster = mlDBController.findOne("MlClusters", {"_id": clusterId}, context)
      if(cluster && cluster.clusterCode){
        let roundings = mlDBController.find("MlCurrencyType", {"countryCode": cluster.clusterCode}, context).fetch();
        if (roundings) {
          let code = 200;
          let response = new MlRespPayload().successPayload('', code);
          return roundings
        }
      }
  }
}
MlResolver.MlQueryResolver['findCurrencyNames'] = (obj, args, context, info) => {
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
  if (clusterId) {
    let cluster = mlDBController.findOne("MlClusters", {"_id": clusterId}, context)
    if(cluster && cluster.clusterCode){
      let currencyName = mlDBController.find("MlCurrencyType", {"countryCode": cluster.clusterCode}, context).fetch();
      if (currencyName) {
        let code = 200;
        let result = []
        let response = new MlRespPayload().successPayload('', code);
        currencyName.map(function (currency) {
          let json={
            regionalCurrencyName : currency.currencyName,
            _id : currency._id
          }
          result.push(json)
        })

        return result
      }
    }
  }
}

MlResolver.MlQueryResolver['findLanguages'] = (obj, args, context, info) => {
  let userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
  let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
  if (clusterId) {
    let languages = mlDBController.find("MlMasterSettings", {"hierarchyRefId": clusterId}, context).fetch();
    if(languages){
      let response = []
      // data = languages.languageInfo
      languages.map(function (lang) {
        if(lang.languageInfo){
          let json = {
            lang_code : lang.languageInfo.languageName,
            language_name : lang.languageInfo.languageName
          }
          response.push(json)
        }
      })
      return response;
    }
  }
}
