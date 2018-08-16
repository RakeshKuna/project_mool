/**
 * Created by venkatsrinag on 28/7/17.
 */
/**
 * Created by venkatsrinag on 28/7/17.
 */

let frequencyType = [
  {name:"onetime", displayName:"One Time", description:"", code:"ONETIME", value:0, isActive:true},
  {name:"monthly", displayName:"Monthly", description:"", code:"MONTHLY", value:1, isActive:true},
  {name:"quaterly", displayName:"Quaterly", description:"", code:"QUATERLY", value:3, isActive:true},
  {name:"halfyearly", displayName:"Half Yearly", description:"", code:"HALFYEARLY", value:6, isActive:true},
  {name:"yearly", displayName:"Yearly", description:"", code:"YEARLY", value:12, isActive:true},
];

Meteor.startup(function () {
  for(var i = 0; i < frequencyType.length; i++){
    MlFrequencyType.update({code: frequencyType[i].code}, {$set:frequencyType[i]}, {upsert:true})
  }
})
