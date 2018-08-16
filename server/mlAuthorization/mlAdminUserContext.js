/**
 * Created by mohammed.mohasin on 2/02/17.
 */

import _underscore from "underscore";
import MlSubChapterAccessControl from './mlSubChapterAccessControl'
var _ = require('lodash');

class MlAdminUserContext
{
  constructor(userId){
    this.userId=userId;
  }

  _userDefaultProfileDetails(userId)
  {
   check(userId, String)
    var hierarchyLevel =null;
    var hierarchyCode=null;
    let defaultCluster=null;
    var isMoolya = null
    let defaultChapters = [];
    let defaultSubChapters = [];
    let defaultCommunities = [];
    let defaultCommunityHierarchyLevel;
    let roleName = null;
    let roleId = null;
    var isAnchor = false
    var isInternaluser=false;
    var user = Meteor.users.findOne({_id:userId});
    if(user && user.profile && user.profile.isInternaluser == true)
    {
      isInternaluser=true;
      let user_profiles = user.profile.InternalUprofile.moolyaProfile.userProfiles;
      isMoolya = user.profile.isMoolya
      let user_roles;
      // Selecting Default Profile
      let default_User_Profiles=_.find(user_profiles, {'isDefault': true });
      //if default Profile is available then,
      if(default_User_Profiles){
         for(var i = 0; i < user_profiles.length; i++){
             if(user_profiles[i].isDefault == true){
                  user_roles = user_profiles[i].userRoles;
                  defaultCluster=user_profiles[i].clusterId;
                  break;
             }
          }
      }else{ //else pick the first profile
        user_roles=user_profiles&&user_profiles[0]&&user_profiles[0].userRoles?user_profiles[0].userRoles:[];
        defaultCluster=user_profiles&&user_profiles[0]?user_profiles[0]["clusterId"]:null;
      }

      if(user_roles && user_roles.length > 0)
      {
          user_roles.map(function (userRole)
          {
              if(userRole.isActive) {
                if (!hierarchyLevel) {
                  hierarchyLevel = userRole.hierarchyLevel;
                  hierarchyCode = userRole.hierarchyCode;
                } else if (hierarchyLevel && hierarchyLevel < userRole.hierarchyLevel) {
                  hierarchyLevel = userRole.hierarchyLevel;
                  hierarchyCode = userRole.hierarchyCode;
                }
                if (userRole.communityHierarchyLevel) {
                  defaultCommunityHierarchyLevel = userRole.communityHierarchyLevel
                }
                if (defaultChapters.indexOf(userRole.chapterId < 0))
                  defaultChapters.push(userRole.chapterId)
                if (defaultSubChapters.indexOf(userRole.subChapterId < 0))
                  defaultSubChapters.push(userRole.subChapterId)
                if (defaultCommunities.indexOf(userRole.communityId < 0))
                  defaultCommunities.push({communityId: userRole.communityId, communityCode: userRole.communityCode})
                // defaultCommunities.push(userRole.communityId)
                roleName = userRole.roleName
                roleId = userRole.roleId
                isAnchor = userRole.isAnchor
              }
          })
      }
    }
        return {hierarchyLevel:hierarchyLevel,hierarchyCode:hierarchyCode,
                defaultProfileHierarchyCode:"CLUSTER",
                defaultProfileHierarchyRefId:defaultCluster,
                defaultCluster: defaultCluster,
                defaultChapters:defaultChapters,
                defaultSubChapters:defaultSubChapters,
                defaultCommunities:defaultCommunities,
                defaultCommunityHierarchyLevel:defaultCommunityHierarchyLevel,
                isMoolya:isMoolya,
                isInternaluser:isInternaluser,
                roleName:roleName,
                roleId: roleId,
                isAnchor : isAnchor
        };
  }

  /**
   * conditions added for non-moolya access control
   * @params [on condition on 'userProfile.isMoolya': false]
   * */
  userProfileDetails(userId) {
    var userDetails = this._userDefaultProfileDetails(userId);
    if (userDetails && !userDetails.isMoolya) {
      userDetails.orgSubChapters = userDetails.defaultSubChapters
      userDetails.orgChapters = userDetails.defaultChapters
      var dataContext = MlSubChapterAccessControl.getAccessControl('SEARCH', {userId: userId})
      if (dataContext && dataContext.hasAccess && dataContext.subChapters && dataContext.subChapters.length > 0) {
        userDetails.defaultSubChapters = dataContext.subChapters;
        userDetails.defaultChapters = dataContext.chapters;
      }
      //Sub Chapter can access transactions based on 'TRANSACT' perms (Jira-2956)
      var dataContext = MlSubChapterAccessControl.getAccessControl('TRANSACT', {userId: userId});
      if (dataContext && dataContext.hasAccess && dataContext.subChapters && dataContext.subChapters.length > 0) {
        userDetails.transactionSubChapters = dataContext.subChapters;
        userDetails.transactionChapters = dataContext.chapters;
      }
    }
    return userDetails;
  }

  getDefaultMenu(userId) {
    check(userId, String);
    let userProfile = this.userProfileDetails(userId) || {};
    let hierarchy = null;
    if (userProfile && (userProfile.hierarchyLevel || userProfile.hierarchyLevel == 0)) {
      hierarchy = MlHierarchy.findOne({level: Number(userProfile.hierarchyLevel)});
      if(hierarchy && hierarchy.menuName){
        var menuSelect = _.find(hierarchy.menuName, {isMoolya:userProfile.isMoolya})
        return menuSelect && menuSelect.menuName ? menuSelect.menuName : null;
      }
      // return hierarchy && hierarchy.menuName ? hierarchy.menuName : null;
    }
    return null;  //return default menu
  }

  getDefaultCountry(userId){
    check(userId,String);
    let userProfile=this.userProfileDetails(userId)||{};
    if(userProfile&&userProfile.defaultProfileHierarchyCode&&userProfile.defaultProfileHierarchyCode==="CLUSTER"){
      let defaultProfileHierarchyRefId=userProfile.defaultProfileHierarchyRefId;
      let clusterDetails=MlClusters.findOne(defaultProfileHierarchyRefId);
      if(clusterDetails&&clusterDetails.countryId){
         let countryDetails=MlCountries.findOne(clusterDetails.countryId);
        return {countryId:countryDetails._id,countryCode:countryDetails.countryCode,countryName:countryDetails.country};
      }
    }
    return {};
  }

  getUserLatLng(profile){
    var latitude = null;
    var longitude = null;
    if(profile && profile.addressInfo && profile.addressInfo.length>0){   /*profile of the user should be there*/
      var address = _.find(profile.addressInfo, {isDefaultAddress:true});
      if(!address){
        address = profile.addressInfo[0]
      }
      latitude = address.latitude;
      longitude = address.longitude;
    }
    return {lat: latitude?latitude:0, lng: longitude?longitude:0}
  }
  getCommunityBasedExternalUser(userProfiles, user, userType, locationName){
    var users = [];
    _.each(userProfiles, function (profile) {
        var portfolio = MlPortfolioDetails.findOne({profileId:profile.profileId, status: 'PORT_LIVE_NOW'});
        if(portfolio){
          let userObj = {};
          if (profile.communityId && profile.communityId != "") {
            if (profile.communityDefName == userType) {
              userObj.profile = user.profile;
              userObj.portfolioId = portfolio._id;
              userObj.name = (user.profile.firstName?user.profile.firstName:"")+" "+(user.profile.lastName?user.profile.lastName:"");
              userObj.communityCode = profile.communityDefCode;
              if(locationName){
                userObj.clusterName = profile[locationName];
              }
              let externalProfile = _.find(user.profile.externalUserAdditionalInfo, {profileId:profile.profileId});
              let resp = new MlAdminUserContext().getUserLatLng(externalProfile);
              userObj.latitude = resp.lat;
              userObj.longitude = resp.lng;

              users.push(userObj);
            }
          }
        }

    })
    return users;
  }
  getUserRolesName(userProfile, filteredRoles){
    var roles = [];
    var hierarchyLevel=[];
    var userProfile=userProfile;
    var userRoles = filteredRoles;
    // if(findDefaultProfile) {
    //   userProfile = _.find(userProfiles, {isDefault:true});
    //   userRoles = userProfile && userProfile.userRoles ? userProfile.userRoles : [];
    // }
    if(userRoles && userRoles.length>0){
      hierarchyLevel = _underscore.pluck(userRoles, 'hierarchyLevel') || [];
      hierarchyLevel.sort(function (a, b) {
        return b - a
      });
      _.each(userProfile.userRoles, function (role){
        if (role.hierarchyLevel == hierarchyLevel[0]) {
          roles.push(role.roleName);
        }
      })
    }
    return roles;
  }
  getAllExternalUser(userProfiles, user, locationName){
    var users = [];
    _.each(userProfiles, function (profile) {
        var portfolio = MlPortfolioDetails.findOne({profileId:profile.profileId, status: 'PORT_LIVE_NOW'});
        if(portfolio){
            let userObj = {};
            userObj.portfolioId = portfolio._id;
            userObj.profile = user.profile;
            userObj.name = (user.profile.firstName ? user.profile.firstName : "") + " " + (user.profile.lastName ? user.profile.lastName : "");
            userObj.communityCode = profile.communityDefCode ? profile.communityDefCode : " ";
            if(locationName){
              userObj.clusterName = profile[locationName];
            }
            if (user.profile.externalUserAdditionalInfo && user.profile.externalUserAdditionalInfo.length > 0) {
              let externalProfile = _.find(user.profile.externalUserAdditionalInfo, {profileId:profile.profileId});
              var resp = new MlAdminUserContext().getUserLatLng(externalProfile);
              userObj.latitude = resp.lat;
              userObj.longitude = resp.lng;
              users.push(userObj);
            }
        }
    })
    return users;
  }

  getRelatedSubChaptersForNonMoolya(userId){
    var userProfile = new MlAdminUserContext()._userDefaultProfileDetails(userId);

    // Default Profile. Expecting user default profile changes on profile change.
    var userSubChapterId = userProfile.defaultSubChapters[0];
    if(userSubChapterId == 'all') {
      return {}
    }
    var userSubChapter = mlDBController.findOne('MlSubChapters', {_id:userSubChapterId});
    var clusterId = userSubChapter.clusterId
    var isDefaultSubChapter = userSubChapter.isDefaultSubChapter;
    var relatedSubChapterIds = [];
    var relatedChapterIds = [];
    if(!isDefaultSubChapter){
      var relatedSubChapters = mlDBController.find('MlRelatedSubChapters', {subChapters:{$elemMatch:{subChapterId:userSubChapterId}}}).fetch()
      if(relatedSubChapters&&relatedSubChapters.length>0){
        _.each(relatedSubChapters, function(obj){
          let ids = _.map(obj.subChapters, "subChapterId");
          relatedSubChapterIds = _.concat(relatedSubChapterIds, ids)
        })
        relatedSubChapterIds = _.uniq(relatedSubChapterIds);

        var relatedSC = mlDBController.find('MlSubChapters', {_id:{$in:relatedSubChapterIds}, clusterId:clusterId, isActive:true}).fetch()
        relatedSubChapterIds = _.map(relatedSC, "_id");
        var relatedChapterIds = _.map(relatedSC, "chapterId");
        var relatedC = mlDBController.find('MlChapters', {_id:{$in:relatedChapterIds}, isActive:true}).fetch()
        relatedChapterIds = _.map(relatedC, "_id");
      }

    }else{
      relatedSubChapterIds = [userSubChapterId];
      relatedChapterIds = [userSubChapter.chapterId];
    }
    return{
      userSubChapter:userSubChapter,
      isDefaultSubChapter:isDefaultSubChapter,
      relatedSubChapterIds:relatedSubChapterIds,
      relatedChapterIds:relatedChapterIds,
      clusterId:clusterId
    }
  }

}

module.exports = MlAdminUserContext
