/**
 * Created by mohammed.mohasin on 04/03/17.
 */
import MlAdminUserContext from '../../../../../mlAuthorization/mlAdminUserContext'
export default class MlGlobalSettingRepo{
   constructor(userId){
      this.userId=userId;
   };



  updateGlobalSetting(requestParams, context){
    let settingsObj=null;
    check(requestParams.type,String);
    //fetch the User context
    let userProfile=new MlAdminUserContext().userProfileDetails(this.userId);

    //todo:dynamic handling of resource
    //  let cluster=MlClusters.findOne(userProfile.defaultProfileHierarchyRefId);
    let cluster = mlDBController.findOne('MlClusters', userProfile.defaultProfileHierarchyRefId, context)
     let updateQuery={"hierarchyLevel":3,"hierarchyCode":"CLUSTER","hierarchyRefId":userProfile.defaultProfileHierarchyRefId,"hierarchyRefName":cluster.clusterName};

    switch(requestParams.type){
      case "DATEANDTIME":
        settingsObj={"type":"GLOBALSETTING","dateAndTimeInfo":requestParams.settingsData.dateAndTimeInfo};
        break;
      case "NUMERICAL":
        settingsObj={"type":"GLOBALSETTING","numericalInfo":requestParams.settingsData.numericalInfo};
        break;
      case "REGIONAL":
        let regionalInfo= requestParams.settingsData.regionalInfo
        regionalInfo.clusterName=cluster.clusterName;
        settingsObj={"type":"GLOBALSETTING","regionalInfo":regionalInfo};
        break;
    }

      // MlGlobalSettings.update(updateQuery,{$set:settingsObj},{upsert:true});
      mlDBController.update('MlGlobalSettings', updateQuery, settingsObj, {$set:true, multi:false, upsert:true}, context)
    // return MlGlobalSettings.findOne(updateQuery)._id;
    return mlDBController.findOne('MlGlobalSettings', updateQuery, context)._id;
  }


}
