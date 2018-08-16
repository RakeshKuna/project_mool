/*
* Created by Sireesha on 4/5/2017
*
* */


import MlAdminUserContext from '../../../../mlAuthorization/mlAdminUserContext'
import _ from 'underscore'

export default class MlFilterListRepo{
  constructor(userId){
    this.userId=userId;
  };

  getFilterDropDownSettings(requestParams) {
    check(requestParams.moduleName, String);

    //let userProfile = new MlAdminUserContext().userProfileDetails(this.userId);
    let userProfile=new MlAdminUserContext().userProfileDetails(this.userId)||{};
    let user = Meteor.users.findOne({_id:this.userId});
    let roleIds=[];
    let hirarichyLevel=[]
    let userProfiles=user&&user.profile.InternalUprofile.moolyaProfile.userProfiles?user.profile.InternalUprofile.moolyaProfile.userProfiles:[];
    let listData = [];
    let clusterIds = userProfile && userProfile.defaultProfileHierarchyRefId?userProfile.defaultProfileHierarchyRefId:[];
    let chapterIds = userProfile && userProfile.defaultChapters?userProfile.defaultChapters:[];
    let subChapterIds = userProfile && userProfile.defaultSubChapters?userProfile.defaultSubChapters:[];
    // let communityIds = userProfile && userProfile.defaultCommunities?userProfile.defaultCommunities:[];
    let communityCode = userProfile && userProfile.defaultCommunities?userProfile.defaultCommunities:[];
    communityCode = _.pluck(communityCode, 'communityCode')
    userProfiles.map(function (doc,index) {

      let userRoles = doc && doc.userRoles ? doc.userRoles : [];
      for (let i = 0; i < userRoles.length; i++) {
        roleIds.push(userRoles[i].roleId);
        break

      }

    });
    let settingsObj = null;
    let result = null;
    let roleExist = null;
    if(requestParams.list && requestParams.list.length>0){
      let valueArray = []
       _.map(requestParams.list, function (val) {

          if(val.roleId){
            roleExist = _.contains(val.roleId,roleIds.toString());
          }
          if(roleExist){

            valueArray = valueArray.concat(val.listValueId);
          }


        });
      listData = valueArray;
    }
    let  options=[]
    switch (requestParams.moduleName) {

      case "Gen_Community":

        if(listData.length < 1){ //if isCustom false
          // let allCommuntities = _.contains(communityIds,"all");
          let allCommuntities = _.contains(communityCode,"all") || null;
          if(allCommuntities){
            result = MlCommunityDefinition.find({isActive : true}).fetch();
          }else{
            result= MlCommunityDefinition.find({ code: { $in: communityCode },isActive : true}).fetch();
          }

        }else{ //if isCustom true

          result= MlCommunityDefinition.find({ _id: { $in: listData },isActive : true}).fetch();
        }

        let communityResponse=_.each(result,function (option,id) {
          options.push({"label":option.displayName,"value":option.code})
        })


        break;

      case "Gen_IdentityType":

        if(listData.length < 1){
          result= MlIdentityTypes.find({isActive : true}).fetch();
        }else{

          result= MlIdentityTypes.find({ _id: { $in: listData },isActive : true}).fetch();
        }

        let identityResponse=_.each(result,function (option,id) {
          options.push({"label":option.identityTypeDisplayName,"value":option.identityTypeName})
        })


        break;

      case "Gen_isActive":


          options.push({"label":"true","value":true},{"label":"false","value":false})



        break;
      case "Gen_Clusters":
        if(requestParams.fieldActive == "Cluster"){
          if(listData.length < 1){ //if isCustom false

            clusterIds = [clusterIds]

            let allclusterIds = _.contains(clusterIds,"all") || null;
            if(allclusterIds){
              result = MlClusters.find({isActive : true}).fetch();
            }else{
              result= MlClusters.find({ _id: { $in: clusterIds },isActive : true}).fetch();
            }

          }else{ //if isCustom true

            result= MlClusters.find({ _id: { $in: listData },isActive : true}).fetch();
          }
        }


        let genClusterResponse=_.each(result,function (option,id) {
          options.push({"label":option.displayName,"value":option._id})
        })


        break;
      case "Gen_Chapters":
        if(requestParams.fieldActive == "Cluster"){

          if(listData.length < 1){ //if isCustom false
            if(userProfile.hierarchyLevel == 4 || userProfile.hierarchyLevel == 3 ){
              let arrayOfChapters = _.pluck(requestParams.filteredListId, 'value') || [];
              result= MlChapters.find({ clusterId: {$in : arrayOfChapters},isActive : true}).fetch();
            }else{
              let allchapterIds = _.contains(chapterIds,"all") || null;
              if(allchapterIds){
                result = MlChapters.find({isActive : true}).fetch();
              }else{
                result= MlChapters.find({ _id: { $in: chapterIds },isActive : true}).fetch();
              }
            }


          }else{ //if isCustom true
            let arrayOfChapters = _.pluck(requestParams.filteredListId, 'value') || [];
            result= MlChapters.find({ clusterId: {$in : arrayOfChapters},isActive : true}).fetch();
          }
        }else if(requestParams.fieldActive == "Chapter"){ //display as per usercontext
          if(listData.length < 1){ //if isCustom false
            if(userProfile.hierarchyLevel == 4 || userProfile.hierarchyLevel == 3 ){
              result=MlChapters.find({ clusterId : { $in: [clusterIds] },isActive : true}).fetch();
            }else{
              let allchapterIds = _.contains(chapterIds,"all") || null;
              if(allchapterIds){
                result = MlChapters.find({isActive : true}).fetch();
              }else{
                result= MlChapters.find({ _id: { $in: chapterIds },isActive : true}).fetch();
              }
            }

          }else{ //if isCustom true
            let arrayOfChapters = _.pluck(requestParams.filteredListId, 'value') || [];
            result= MlChapters.find({ clusterId: {$in : arrayOfChapters},isActive : true}).fetch();
          }
        }
        let genChapterResponse=_.each(result,function (option,id) {
          options.push({"label":option.displayName,"value":option._id})
        })

        break;

      case "Gen_SubChapters":

         if(requestParams.fieldActive == "Cluster" || requestParams.fieldActive == "Chapter"){ //display subchapter as per selected chapter(if chapter or cluster is active)
          if(listData.length < 1){
            if(userProfile.hierarchyLevel == 4 || userProfile.hierarchyLevel == 3 || userProfile.hierarchyLevel == 2){
              let arrayOfGenSubChapter = _.pluck(requestParams.filteredListId, 'value') || [];
              if(requestParams.fieldActive == "Cluster"){
                result= MlSubChapters.find({clusterId: {$in : arrayOfGenSubChapter}, chapterId: {$in : arrayOfGenSubChapter},isActive : true}).fetch();
              }else if(requestParams.fieldActive == "Chapter"){
                result= MlSubChapters.find({chapterId: {$in : arrayOfGenSubChapter},isActive : true}).fetch();
              }else{
                result= MlSubChapters.find({clusterId: {$in : arrayOfGenSubChapter}, chapterId: {$in : arrayOfGenSubChapter},isActive : true}).fetch();
              }

            }else{
              let allsubChapterIds = _.contains(subChapterIds,"all") || null;
              if(allsubChapterIds){
                result = MlSubChapters.find({isActive : true}).fetch();
              }else{
                result= MlSubChapters.find({ _id: { $in: subChapterIds },isActive : true}).fetch();
              }
            }
          }else{
            let arrayOfGenSubChapter = _.pluck(requestParams.filteredListId, 'value') || [];
            result= MlSubChapters.find({clusterId: {$in : arrayOfGenSubChapter}, chapterId: {$in : arrayOfGenSubChapter},isActive : true}).fetch();

          }
        }else if(requestParams.fieldActive == "SubChapter"){ 
          if(listData.length < 1){ //display as per usercontext
              let allsubChapterIds = _.contains(subChapterIds,"all") || null;
              if(allsubChapterIds){
                result = MlSubChapters.find({isActive : true}).fetch();
              }else{
                result= MlSubChapters.find({ _id: { $in: subChapterIds },isActive : true}).fetch();
              }
          }else{
            let arrayOfGenSubChapter = _.pluck(requestParams.filteredListId, 'value') || [];
            result= MlSubChapters.find({clusterId: {$in : arrayOfGenSubChapter}, chapterId: {$in : arrayOfGenSubChapter},isActive : true}).fetch();

          }
        }
        let genSubChapterResponse=_.each(result,function (option,id) {
          options.push({"label":option.subChapterName,"value":option._id})
        })

        break;

      case "Gen_Users":

        //result= Meteor.users.find().fetch();
        result = mlDBController.find('users', {}).fetch()
        let genUsersResponse=_.each(result,function (option,id) {
          if(option.profile.isInternaluser){
            options.push({"label":option.profile.InternalUprofile.moolyaProfile.displayName,"value":option.profile.InternalUprofile.moolyaProfile.displayName})
          }

        })
        options.push({"label": "Un Assigned","value" : "Un Assigned"})

        break;

      case "Gen_TransactionType":

        result= MlTransactionTypes.find({"isActive" : true}).fetch()

        let genTransactionResponse=_.each(result,function (option,id) {
          options.push({"label":option.transactionDisplayName,"value":option._id})
        })

        break;

      case "Gen_UserType":

        result= MlUserTypes.find({"isActive" : true}).fetch()

        let genUserTypeResponse=_.each(result,function (option,id) {
          options.push({"label":option.displayName,"value":option._id})
        })

        break;

      case "Gen_Industries":

        result= MlIndustries.find({"isActive" : true}).fetch()

        let genIndustriesResponse=_.each(result,function (option,id) {
          options.push({"label":option.industryDisplayName,"value":option._id})
        })

        break;

      case "Gen_IdentityTypes":

        result= MlIdentityTypes.find({"isActive" : true}).fetch()

        let genIdentityTypeResponse=_.each(result,function (option,id) {
          options.push({"label":option.identityTypeDisplayName,"value":option._id})
        })

        break;
      case "Gen_Modules":

        result= MlModules.find({"isActive" : true}).fetch()

        let genModulesResponse=_.each(result,function (option,id) {
          options.push({"label":option.code,"value":option.code})
        })

        break;
      case "Gen_Status":
        let moduleType = requestParams&&requestParams.moduleType?requestParams.moduleType:""
        result= MlStatus.find({module: { $in: [moduleType] },"isActive" : true}).fetch()
        let genStatusResponse=_.each(result,function (option,id) {
          options.push({"label":option.code,"value":option.code})
        })

        break;





    }


    return options;
  }


}
