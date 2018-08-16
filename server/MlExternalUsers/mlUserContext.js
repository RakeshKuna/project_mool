/**
 * Created by venkatsrinag on 27/4/17.
 */
var _ = require('lodash');

class MlUserContext{
    constructor(userId){
        this.userId=userId;
    }

    userProfileDetails(userId){
        let default_User_Profile = {};
        check(userId, String)
        var user = Meteor.users.findOne({_id:userId});
        if(user && user.profile && user.profile.isExternaluser == true){
            let user_profiles = user.profile.externalUserProfiles;
            default_User_Profile = _.find(user_profiles, {'isDefault': true });
            if(!default_User_Profile ){
              // //todo: retrieve the first approved profile(Admin may block the profile)
              //   let userActiveProfile = user_profiles.find((profile)=>{
              //     return profile.isActive;
              //   })
              //   default_User_Profile = userActiveProfile ||{};
              default_User_Profile = user_profiles[0] || {};
            }
          default_User_Profile.email = user.profile.email;
          default_User_Profile.mobileNumber = user.profile.mobileNumber;
          default_User_Profile.firstName = user.profile.firstName;
          default_User_Profile.lastName = user.profile.lastName;
          default_User_Profile.profileImage = user.profile.profileImage || '';
        }
        return default_User_Profile;
    }

    /**
     * expecting ProfileId to be unique in External user profile Array
     * */
    userProfileDetailsByProfileId(profileId) {
      let user_Profile = {};
      check(profileId, String)
      var user = Meteor.users.findOne({$and: [{'profile.isExternaluser': true}, {'profile.externalUserProfiles': {$elemMatch: {'profileId': profileId}}}]}) || {}
      if (user && user.profile && user.profile.externalUserProfiles) {
        let user_profiles = user.profile.externalUserProfiles;
        user_Profile = _.find(user_profiles, {'profileId': profileId});
        if (user_Profile) {
          user_Profile.email = user.profile.email;
          user_Profile.mobileNumber = user.profile.mobileNumber;
          user_Profile.firstName = user.profile.firstName;
          user_Profile.lastName = user.profile.lastName;
        }
      }
      return user_Profile;
    }

    /**
     * @module [app left nav deciding]
     * @cond 1) community code if not then user will be "BRW"
     *       2) if hard registration not approved by admin then also menu will be "BRW"
     *       3) else for all other cases the left nav will be decided by the user community code only
     * */
    getDefaultMenu(userId) {
      check(userId, String);
      var menu = '';
      let userProfile = this.userProfileDetails(userId) || {};
      if (userProfile && userProfile.communityDefCode) {
        const registration = this.isUserRegistrationApproved(userProfile);
        if (registration)
          menu = MlAppMenuConfig.findOne({"$and": [{isProfileMenu: false}, {communityCode: userProfile.communityDefCode}, {isActive: true}]});
        else
          menu = MlAppMenuConfig.findOne({"$and": [{isProfileMenu: false}, {communityCode: 'BRW'}, {isActive: true}]});
      }
      else {
        // commmunity type browser will not have any profile
        menu = MlAppMenuConfig.findOne({"$and": [{isProfileMenu: false}, {communityCode: 'BRW'}, {isActive: true}]});
      }
      if (menu)
        return menu.menuName;
      return menu;
    }

  /**
   * @module [app profile left nav deciding]
   * @cond 1) community code if not then user will be "BRW"
   *       2) if hard registration not approved by admin then also menu will be "BRW"
   *       3) else for all other cases the left nav will be decided by the user community code only
   * */
    getDefaultProfileMenu(userId){
        var  menu = '';
        let userProfile = this.userProfileDetails(userId)||{};
        if(userProfile && userProfile.communityDefCode){
          const registration = this.isUserRegistrationApproved(userProfile);
          if(registration)
            menu =   MlAppMenuConfig.findOne({"$and":[{isProfileMenu: true}, {communityCode: userProfile.communityDefCode}, {isActive:true}]});
          else
            menu =   MlAppMenuConfig.findOne({"$and":[{isProfileMenu: true}, {communityCode: 'BRW'}, {isActive:true}]});
        }
        else{
          // commmunity type browser will not have any profile
          menu =   MlAppMenuConfig.findOne({"$and":[{isProfileMenu: true}, {communityCode: 'BRW'}, {isActive:true}]});
        }
        if(menu)
          return menu.menuName;
        return menu;
    }

    getExploreMenu(userId){
        check(userId,String);
        let userProfile = this.userProfileDetails(userId)||{};
        if(userProfile){
        }
        return 'mlExploreMenu';
    }

    getCalendarMenu(userId) {
      check(userId, String);
      let userProfile = this.userProfileDetails(userId) || {};
      if (userProfile) {
      }
      return 'mlCalendarMenu';
    }

    /**@Note: 1) if user profile is "active" then only checking the registration status
     *           else
     *              making the user profile as "BRW".
     */

  isUserRegistrationApproved(userDefaultProfile) {
    var returnStatus = null;
    const isActiveProfile = userDefaultProfile && userDefaultProfile.isActive ? userDefaultProfile.isActive : false;
    // const statusToValidate = userDefaultProfile.communityDefCode == "OFB" ? "REG_USER_APR" : "REG_KYC_A_APR";
    const statusToValidate = "REG_USER_APR";
    if (isActiveProfile) {
      returnStatus = mlDBController.findOne('MlRegistration', {
        _id: userDefaultProfile.registrationId,
        status: statusToValidate
      })
    }
    return returnStatus;
  }

  currencyTypeForEndUsers(userDetails) {
    const {userId, profileId, userInfo} = userDetails;
    let profileClusterId = null;
    if(profileId !== "all"){
      let userProfiles = userInfo.profile.externalUserProfiles;
      userProfiles.forEach(defaultProfile => {
        if(defaultProfile.profileId === profileId)
          profileClusterId = defaultProfile.clusterId;
      })
      return profileClusterId;
    } else return this.userProfileDetails(userId).clusterId;
  }
}


module.exports = MlUserContext
