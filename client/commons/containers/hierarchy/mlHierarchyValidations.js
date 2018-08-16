
/**
 * Created by muralidhar on 30/05/17.
 */

import _ from 'lodash';
import {getAdminUserContext} from '../../../../client/commons/getAdminUserContext'

class MlHierarchyValidations{

  constructor(){
    if(! MlHierarchyValidations.instance){
      MlHierarchyValidations.instance = this;
     // this.validateEditAction.bind(this);
      this.validateAssignAction.bind(this);
    }
    return MlHierarchyValidations.instance;
  }
/*

  validateEditAction(assignedUserId){
    let userProfile = getAdminUserContext()
    let hierarchyLevel =userProfile.hierarchyLevel;// Meteor.user().profile.InternalUprofile.moolyaProfile.userProfiles[0].userRoles[0].hierarchyLevel;
    let roleName = userProfile.roleName;//Meteor.user().profile.InternalUprofile.moolyaProfile.userProfiles[0].userRoles[0].roleName;
    if((hierarchyLevel==4 && roleName=="platformadmin") || (hierarchyLevel==3 && roleName=="clusteradmin")||(hierarchyLevel==2 && roleName=="chapteradmin")||(hierarchyLevel==1 && roleName=="subchapteradmin")||(hierarchyLevel==0 && roleName=="communityadmin")){
      return true;
    }else if(Meteor.userId()==assignedUserId){
      return true;
    }else{
      return false;
    }
  }
*/

  validateAssignAction(recordClusterId,selectedClusterId){
   if(recordClusterId == selectedClusterId){
      return true;
    }else{
      return false;
    }
  }

}

const mlHierarchyValidations = new MlHierarchyValidations();
Object.freeze(mlHierarchyValidations);

export default mlHierarchyValidations;

