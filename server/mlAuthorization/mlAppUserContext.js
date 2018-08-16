/**
 * Created by mohammed.mohasin on 2/02/17.
 */

var _ = require('lodash');

class MlAppUserContext
{
  constructor(userId){
    this.userId=userId;
  }

  userProfileDetails(userId)
  {
    check(userId, String);
    var defaultProfile={};
    var user = Meteor.users.findOne({_id:userId});
    if(user && user.profile && user.profile.isExternaluser === true)
    {
      var user_profiles = user.profile.externalUserProfiles||[];
       // Selecting Default Profile
       defaultProfile=_.find(user_profiles, {'isDefault': true });
      //if default Profile is available then,
      if(!defaultProfile){//else pick the first profile
        //todo: retrieve the first approved profile(Admin may block the profile)
        defaultProfile=user_profiles&&user_profiles[0]?user_profiles[0]:{};
      }

    }
        return {defaultCluster:defaultProfile.clusterId,defaultClusterName:defaultProfile.clusterName,
                defaultChapter:defaultProfile.chapterId,defaultChapterName:defaultProfile.chapterName,
                defaultSubChapter:defaultProfile.subChapterId,defaultSubChapterName:defaultProfile.subChapterName,
                defaultCommunity:defaultProfile.communityId,defaultCommunityName:defaultProfile.communityName,
                profileId: defaultProfile.profileId
                };
  }

}

module.exports = MlAppUserContext
