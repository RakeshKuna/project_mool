/**
 * Created by Mohammed.Mohasin on 21/09/17.
 */

import _ from 'lodash'
import MlUserContext from '../../../MlExternalUsers/mlUserContext';

/**
 * MlInteractionAccessControlRepo  returns the access control for user based on criteria
 * Returns Boolean
 * canPerform: Boolean (specifies if the context can interact with external source)
 * */
class MlInteractionAccessControlRepo{

  constructor(){
  }

  /**
   * This method returns default profile of external user
   * @param userId(Id of user)
   * returns Object (Profile context object)
   */
  getDefaultProfile(userId){
    return new MlUserContext().userProfileDetails(userId);
  }

  /**
   * This method returns permission for portfolio interaction
   * @param resourceDetails(both context and resourceOwner Details)
   * returns Boolean true/false
   */
  canPerformPortfolioInteraction(resourceDetails){
    var isInteractionAllowed=true;
    var contextUser=resourceDetails.contextUser;
    var resourceOwnerUser=resourceDetails.resourceOwner;
    //1-cannot allow interaction for unknown user
    if(!contextUser||!resourceOwnerUser||!contextUser._id||!resourceOwnerUser._id){
      isInteractionAllowed=false;
      return isInteractionAllowed;
    }
    //2-check if the resource is owned by context user and return false
    if(contextUser&&resourceOwnerUser&&contextUser._id===resourceOwnerUser._id){
      isInteractionAllowed=false;
      return isInteractionAllowed;
    }
    //3-check if the context user is Office Bearer/Principal
    var defaultProfile=this.getDefaultProfile((contextUser||{})._id);
    if(defaultProfile&&defaultProfile.communityDefCode==="OFB"){
      isInteractionAllowed=false;
      return isInteractionAllowed;
    }

    return isInteractionAllowed;
  }

  /**
   * This method returns permission for interaction
   * @param resourceDetails(both context and resourceOwner Details)
   * returns Boolean true/false
   */
  canPerformInteraction(resourceDetails){
    var resourceType=(resourceDetails||{}).resourceType||"";
    var canPerform=false;
    switch (resourceType) {
      case 'portfolio':
        canPerform=this.canPerformPortfolioInteraction(resourceDetails);
        break;
    }
    return canPerform;
  }

}

const mlInteractionAccessControlRepo = new MlInteractionAccessControlRepo();
Object.freeze(mlInteractionAccessControlRepo);
export default mlInteractionAccessControlRepo;
