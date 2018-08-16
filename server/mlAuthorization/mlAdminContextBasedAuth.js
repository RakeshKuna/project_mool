/**
 * Created by vishwadeep.kapoor on 7/03/17.
 */

import MlAdminUserContext from '../mlAuthorization/mlAdminUserContext';

class MlAdminContextBasedAuthorization{
  constructor(context){
    this.userId=context.userId;
    this.setUserProfile(context.userId);
  }

  setUserProfile(userId){
    let userProfile=new MlAdminUserContext().userProfileDetails(userId);
    this.userProfile =userProfile;
  }
}

module.exports = MlAdminContextBasedAuthorization;
