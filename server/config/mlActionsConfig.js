/**
 * Created by venkatasrinag on 27/1/17.
 */
let actions = [ "create", "read", "update", "delete", "like","connect",
                  "collaborate","view","partner","enquire",
                "conversation","feedback","compare","share","download","upload",
                "wishlist","favourite","edit","save","golive","comment","onboard",
                "shortlist","review","assess","discuss","promote","negotiate","valuation",
                "handover", "report card", "invest", "term sheet", "exit", "remove"];

let processActions=["like","compare","share","wishlist","comment","onboard","shortlist","review","assess","discuss","promote","negotiate",
                    "valuation","handover","report card","invest","term sheet","exit","remove"];
// Meteor.startup(function () {
  for(i = 0; i < actions.length; i++){
      let action = MlActions.findOne({name: actions[i]});
      if(!action){
          var actionName=actions[i];
          let code = actions[i].toUpperCase();
          action = {name:actions[i], displayName:actions[i], code: code, isActive:true, isAdmin:true};
         //check if its process setup action
          var isProcessAction=_.lastIndexOf(processActions,actions[i]) < 0 ? false : true;
          if(isProcessAction){action['isProcessAction']=true};
          MlActions.insert(action);
      }
  }
// })
