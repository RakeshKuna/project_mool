/**
 * Created by venkatsrinag on 9/6/17.
 */

import MlUserContext from '../mlUserContext'

class MlActionValidationService{
    constructor(){
    }

    validateUserActions(userId, resourceName, userAction, interactionType){
      var defaultProfile = new MlUserContext().userProfileDetails(userId);
      if(defaultProfile)
        return false;

      switch (userAction){
        case 'ADD':{
          return this.validateSCInteractions(userId, defaultProfile, resourceName, actionName, interactionType)
        }
        break;
      }
    }

    validateSCInteractions(userId, defaultProfile, resourceName, actionName, interactionType){
        var isValid = false;
        var serviceCards = MlUserInteractionSC.find({userId:userId, profileId:defaultProfile.profileId, isActive:true}).fetch()
        if(!serviceCards)
            return isValid;

        var interactionCount = this.getSCInteractionsCount(serviceCards);
        var interactionDefCount = this.getSCInteractionsDefCount(serviceCards);

        var action = _.find(serviceCard.actionList, {actionCode:interactionType})
        if(!action)
          return isValid

        return isValid;
    }

    validateSCExpiryDate(){

    }

    getSCInteractionsCount(services){
      var counter = [];
      _.each(services, function(service){
        _.each(service.actions, function(action){
          var interaction = {interactionType:action.actionName, limit:action.limit}
          var index = _.findIndex(counter, {interactionType:action.actionName})
          if(index < 0)
            counter.push(interaction)
          else{
            counter[index].limit += action.limit;
          }
        })

      })
      return counter
    }

    // getSCInteractionsDefCount(services){
    //   var counter = [];
    //   _.each(services, function(service){
    //       var defId = MlInteractionSCDef.findOne(service.serviceCardDefId)
    //     _.each(defId.actions, function(action){
    //       var interaction = {interactionType:action.actionName, limit:action.limit}
    //       var index = _.findIndex(counter, {interactionType:action.actionName})
    //       if(index < 0)
    //         counter.push(interaction)
    //       else{
    //         counter[index].limit += action.limit;
    //       }
    //     })
    //   })
    //   return counter
    // }
    getInteractionSCLedgerBalance(userId, profile){

    }

    updateInteractionSCLedgerBalance(userId, profile){

    }

    createInteractionSCLedgerBalance(){

    }

    createInteractionSCJournal(){

    }

    getInteractionSCJournal(){

    }
}

const mlActionValidationService = new MlActionValidationService();
Object.freeze(mlActionValidationService);

export default mlActionValidationService;
