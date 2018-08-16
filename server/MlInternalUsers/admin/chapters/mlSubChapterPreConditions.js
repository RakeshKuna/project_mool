/**
 * Created by mohammed.mohasin on 19/8/17.
 */

import MlAdminUserContext from '../../../mlAuthorization/mlAdminUserContext';
class MlSubChapterPreConditions {
  constructor() {
  }

  static hasEditPermSubChapterAccessControl(context) {
    var hasPerm=false;
    let userProfile=new MlAdminUserContext().userProfileDetails((context||{}).userId);
    if(userProfile&&userProfile.hierarchyLevel) {
      var hierarchy = MlHierarchy.findOne({level:Number(userProfile.hierarchyLevel)});
      //Platform Admin Hierarchy
      if(hierarchy&&hierarchy.isParent===true) hasPerm=true;
    }
    return hasPerm;
  }
}

export default MlSubChapterPreConditions;
