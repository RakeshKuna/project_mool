/**
 * Created by venkatasrinag on 30/1/17.
 */

import MlAdminUserContext from './mlAdminUserContext'
import { parse, buildASTSchema } from 'graphql';
import MlResolver from '../commons/mlResolverDef';

var _ = require('lodash');

class MlAuthorization
{
    constructor(){
    }

    authChecker({req, context, res}){
          let query = parse(req.body.query);
          let schemaDef;
          let moduleName;
          let actionName;
          let operation;
          let typeName = '';
          let isValidAuth = false;
          let isWhiteList = false;
          let isContextSpecSearch = false
          for(var i = 0; i < query.definitions.length; i++){
            const d = query.definitions[i];
            switch (d.kind){
              case 'OperationDefinition':
                if (schemaDef) {
                  throw new Error('Must provide only one schema definition.');
                }
                schemaDef = d;
                break;
            }
          }
          operation = schemaDef.operation;
          schemaDef.selectionSet.selections.forEach(operationType => {
            typeName = operationType.name.value
          })
          let modules = MlResolver.MlModuleResolver;
          var ret = this.valiateApi(MlResolver.MlModuleResolver, typeName);
          isWhiteList = ret.isWhiteList;
          moduleName = ret.moduleName;
          actionName = ret.actionName;
          if(isWhiteList)
              return true
          if((typeName == 'ContextSpecSearch' || typeName == 'SearchQuery') && moduleName == 'GENERIC' && actionName == 'READ'){
              var startToken = schemaDef.loc.startToken
              do{
                  if(startToken.value == 'module'){
                      moduleName = startToken.next.next.value.toUpperCase();
                      /*
                      Handling all three modules of interanal requests
                      */

                      if(moduleName == 'INTERNALREQUESTS' || moduleName == 'INTERNALAPPROVEDREQUESTS' || moduleName=='INTERNALREJECTEDREQUESTS'){
                        moduleName = 'INTERNALREQUESTS';
                      }

                      if(moduleName == 'REGISTRATIONINFO' || moduleName == 'REGISTRATIONAPPROVEDINFO' || moduleName=='REGISTRATIONREJECTEDINFO'){
                          moduleName = 'REGISTRATION';
                      }

                      if(moduleName == 'PORTFOLIOREQUESTS' || moduleName == 'PORTFOLIOAPPROVED'){
                          moduleName = 'PORTFOLIO';
                      }
                      if(moduleName == 'OFFICETRANSACTION'){
                        moduleName = 'OFFICE';
                      }
                      if(moduleName == 'USERTRANSACTION'){
                        moduleName = 'USERS';
                      }
                      if(moduleName == 'CLUSTERHIERARCHY'){
                        moduleName = 'CLUSTER';
                      }
                      if(moduleName == 'HIERARCHYDEPARTMENTS'){
                        moduleName = 'HIERARCHY';
                      }
                      if(moduleName == 'INTERACTIONSLOG'){
                       // moduleName = 'INTERACTION';
                      }
                      if(moduleName == 'AUDIT_LOG' ||moduleName == "BUG_REPORT")
                          return true
                      isContextSpecSearch = true;
                      break;
                  }
                  startToken = startToken.next
              }while(startToken)
          }

          if(!moduleName){
            return false;
          }

          let variables = _.cloneDeep(req.body.variables)
          isValidAuth = this.validteAuthorization(context.userId, moduleName, actionName, variables, isContextSpecSearch, context);
          return isValidAuth
    }

  valiateApi(modules, typeName){
    var moduleName, actionName, isWhiteList;
    _.each(modules, function (module)
    {
      let validApi = _.find(module, {api:typeName})
      if(validApi && validApi.isWhiteList){
        isWhiteList = true
        return;
      }
      if(validApi){
        moduleName = validApi.moduleName;
        actionName = validApi.actionName;
        return;
      }
    })

    return {isWhiteList:isWhiteList, moduleName:moduleName, actionName:actionName}
  }


    validteAuthorization(userId, moduleName, actionName, variables, isContextSpecSearch, context)
    {
        check(userId, String)
        check(moduleName, String)
        check(actionName, String)
        // check(variables, Object)

        let ret = false;

        let self = this;
        let action = mlDBController.findOne('MlActions', {code:actionName})
        if(!action){
            return false;
        }
        let module = mlDBController.findOne('MlModules', {code:moduleName})
        if(!module){
            return false;
        }

        var user = mlDBController.findOne('users', {_id: userId})
        if(user && user.profile && user.profile.isInternaluser == true)
        {
          const isUrlValidate = this.isCanAccessUrl(context, true);
          if (!isUrlValidate){
            return false;
          }
            let userProfileDetails = new MlAdminUserContext().userProfileDetails(userId);
            var hierarchy = MlHierarchy.findOne({level:Number(userProfileDetails.hierarchyLevel)});

            if(hierarchy.isParent===true){
              return true;
            }
            let user_profiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
            let user_roles;



            // Selecting Default Profile
            for(var i = 0; i < user_profiles.length; i++){
                if(user_profiles[i].isDefault == true){
                    user_roles = user_profiles[i].userRoles
                    break;
                }
            }

            if(user_roles && user_roles.length > 0){
                var sortedRoles = _.reverse(_.sortBy(user_roles, ['hierarchyLevel']))
                for(var i = 0; i < sortedRoles.length; i++){
                  ret = this.validateRole(sortedRoles[i].roleId, module, action)
                  if(ret){
                    break;
                  }
                }
                if(ret){
                  return this.validateDataContext(userProfileDetails, moduleName, actionName, variables, isContextSpecSearch, hierarchy)
                }
                return ret;
            }
        }
        else if (user && user.profile && user.profile.isExternaluser == true) {
          return this.isCanAccessUrl(context, false);
        }
        return ret;
    }

    validateRole(roleId, accessModule, accessAction){
    const _this = this;
      let ret = false;
      let role = mlDBController.findOne('MlRoles', {_id: roleId})
      if(role)
      {
        role.modules.map(function (module) {
          let isValidity = _this.validateModuleValidity(module);
          if(!isValidity)
            return;
          else if(module && !module.isActive)
            return;
          else if(module.moduleId == "all" || module.moduleId == accessModule._id){
            let actions = module.actions;
            actions.map(function (action) {
              if(action.actionId == "all" || action.actionId == accessAction._id || action.actionId == accessAction.code){
                ret = true
                return;
              }
            })
          }
        })
      }
      return ret;
    }

  validateModuleValidity(module) {
    var response = false;
    const fromDate = module.validFrom ? module.validFrom : new Date();
    const toDate = module.validTo ? module.validTo : new Date();
    const curDate = new Date();
    if (curDate >= fromDate && curDate <= toDate)
      response = true;
    return response
  }

      validateDataContext(userProfileDetails, moduleName, actionName, variables, isContextSpecSearch){
        if(isContextSpecSearch || moduleName == 'GLOBALSETTINGS' || moduleName == 'MASTERSETTINGS')
          return true;

        var ctxDetails = this.getContextDetails(moduleName, actionName, variables);
        if(!_.isEmpty(ctxDetails))
          variables = ctxDetails;

        if(!this.validateCluster(userProfileDetails, variables))
          return false

        switch (moduleName){
          case 'TAXATION':
          case 'CLUSTER':
            return true;
          case 'CHAPTER':
          case 'SUBCHAPTER':
          case 'COMMUNITY':
          case 'USERS':
          case 'REGISTRATION':
          case 'PORTFOLIO':
          case 'TEMPLATEASSIGNMENT':
          case "INTERNALREQUESTS":
          case "SERVICECARD":
          case "OFFICE":              /*adding office for others five admin */
          case "SHARE":
          case "HIERARCHY":
          case "APPOINTMENT":
          case "PROCESSSETUP": {
            if(!userProfileDetails.isMoolya){
              return this.validateNonMoolyaChapterSubChapterCommunity(userProfileDetails, variables, actionName);
            }else{
              return this.validateChapterSubChapterCommunity(userProfileDetails, variables, actionName);
            }
          }
          break;
        }
      }

      getContextDetails(moduleName, actionName, variables){
        switch(moduleName){
          case 'REGISTRATION':{
            if(actionName == 'CREATE')
            {
                var reg = variables.registration;
                return {clusterId:reg.clusterId, chapterId:reg.chapterId, subChapterId:reg.subChapterId, communityId:reg.registrationType}
            }
            return this.getRegistrationContextDetails(variables.registrationId)
          }
          break;
          case 'PORTFOLIO':{
            var portfolio = MlPortfolioDetails.findOne(variables.portfoliodetailsId)
            if(!portfolio)
              return {}
            return {clusterId:portfolio.clusterId, chapterId:portfolio.chapterId, subChapterId:portfolio.subChapterId, communityId:portfolio.communityCode}
          }
          break;
          case 'TEMPLATEASSIGNMENT':{
            if(actionName == 'CREATE'){
              var reg = variables.template;
              return {clusterId:reg.templateclusterId, chapterId:reg.templatechapterId, subChapterId:reg.templatesubChapterId, communityId:reg.templatecommunityCode}
            }

            var template = MlTemplateAssignment.findOne(variables.id);
            if(!template)
              return;

            return {clusterId:template.templateclusterId, chapterId:template.templatechapterId, subChapterId:template.templatesubChapterId, communityId:template.templatecommunityCode}
          }
          break;
          case 'INTERNALREQUESTS':{
            return this.getInternalRequestContextDetails(variables, actionName)
          }
          break;
          case 'HIERARCHY':{
            var hierarchy = variables.hierarchy;
            if(hierarchy){
              return {clusterId:hierarchy.clusterId, subChapterId:hierarchy.subChapterId}
            }
          }
            break;
        }
        return variables;
      }

      validateCluster(roleDetails, variables){
        if(!variables)
          return false
        if(roleDetails.defaultProfileHierarchyRefId == variables['clusterId'])
          return true;
        return false;
      }

      validateChapterSubChapterCommunity(roleDetails, variables){
        if(!variables)
          return false

        isChapter = this.findChapterSubChapter(roleDetails.defaultChapters, variables['chapterId'])
        if(!isChapter) {
          if (variables['subChapterId']) {
            isSubChapter = this.findChapterSubChapter(roleDetails.defaultSubChapters, variables['subChapterId'])
            if (!isSubChapter)
              return false
          } else {
            return false;
          }
        }
        isSubChapter = this.findChapterSubChapter(roleDetails.defaultSubChapters, variables['subChapterId'])
        if(!isSubChapter)
          return false
        isCommunity = this.findCommunity(roleDetails.defaultCommunities, variables['communityId'], variables['subChapterId'], variables['chapterId'])
        if(!isCommunity)
          return false

        return true;
      }

      /**
       * condition added for non-moolya
       * @params [if 1) actionName: READ [defaultSubChapters + defaultChapters] = roleChapter && roleSubChapter
       *             2) actionName: UPDATE && CREATE [original Chapters + original subChapters] = roleChapter && roleSubChapter]
       * */
      validateNonMoolyaChapterSubChapterCommunity(roleDetails, variables, actionName) {
        if (!variables)
          return false
        let roleChapters = roleDetails.orgChapters
        let roleSubChapters = roleDetails.orgSubChapters
        if (actionName == 'READ') {
          roleChapters = roleDetails.defaultChapters
          roleSubChapters = roleDetails.defaultSubChapters
        }
        isChapter = this.findChapterSubChapter(roleChapters, variables['chapterId'])
        if (!isChapter) {
          if (variables['subChapterId']) {
            isSubChapter = this.findChapterSubChapter(roleSubChapters, variables['subChapterId'])
            if (!isSubChapter)
              return false
          } else {
            return false;
          }
        }
        isSubChapter = this.findChapterSubChapter(roleSubChapters, variables['subChapterId'])
        if (!isSubChapter)
          return false
        isCommunity = this.findCommunity(roleDetails.defaultCommunities, variables['communityId'], variables['subChapterId'], variables['chapterId'])
        if (!isCommunity)
          return false

        return true;
      }

      findChapterSubChapter(defaultArray, value){
        var index = _.indexOf(defaultArray, "all")
        if(index >= 0){
          return true;
        }
        index = _.indexOf(defaultArray, value)
        if(index >= 0){
          return true;
        }

        return false;
      }

      /**code change sending 2 parameter and reciving 4 paraments */
      // findCommunity(communityArray, chapterId, subChapterId, communityId) {
      findCommunity(communityArray, communityId, subChapterId, chapterId) {
        for (var i = 0; i < communityArray.length; i++) {
          var index = _.isMatch(communityArray[i], {communityCode: 'all'})
          if (index)
            return true

          index = _.isMatch(communityArray[i], {communityId: 'all'})
          if (index)
            return true

          var community = MlCommunity.findOne({_id: communityId});
          if (!community) {
            community = MlCommunity.findOne({communityDefCode: communityId, chapterId:chapterId, subChapterId:subChapterId});
          }
          if (community) {
            index = _.isMatch(communityArray[i], {communityId: community._id})
            if (index)
              return true

            index = _.isMatch(communityArray[i], {communityCode: community.communityDefCode})
            if (index) {
              return true;
            }
          }
        }
        return false
      }

      getRegistrationContextDetails(registrationId){
        var registration = MlRegistration.findOne(registrationId)
        if(!registration)
          return {}
        var reg = registration.registrationInfo
        return {clusterId:reg.clusterId, chapterId:reg.chapterId, subChapterId:reg.subChapterId, communityId:reg.registrationType}
      }

      getInternalRequestContextDetails(variables, actionName){
        if(actionName == 'CREATE'){
          // return {clusterId:variables['clusterId'], chapterId:variables['chapterId'], subChapterId:variables['subChapterId'], communityId:variables['community']};
          return {clusterId:variables['clusterId'], chapterId:variables['chapterId'], subChapterId:variables['subChapterId'], communityId:variables['communityId']};
        }
        let request = MlRequests.findOne({requestId:variables.requestsId})
        if(!request)
          return {}
        return {clusterId:request.cluster, chapterId:request.chapter, subChapterId:request.subChapter, communityId:request.community};
      }

  /**
   * @Note: function used to check the url coming from the app or admin
   *        1) if user try to access admin url ['Not authorised'] page will be displayed.
   * */
  isCanAccessUrl(context, isInternalUserCheck) {
    let res = true;
    const urlPath = context && context.url ? context.url : '';
    const urlSplit = urlPath ? urlPath.split('/') : [];
    const pathCheck = isInternalUserCheck ? urlSplit.indexOf('app') : urlSplit.indexOf('admin');
    if (pathCheck != -1)
      res = false;
    return res
  }

}

module.exports = MlAuthorization
