/**
 * Created by venkatsrinag on 28/7/17.
 */

let serviceCardType = [
  {name:"officecard", displayName:"Office Card", description:"", code:"OFFICECARD", isActive:true},
  {name:"providercard", displayName:"Service Card", description:"", code:"PROVIDERCARD", isActive:true}
];

Meteor.startup(function () {
  for(var i = 0; i < serviceCardType.length; i++){
    let servicecardtype = MlServiceCardType.findOne({code: serviceCardType[i].code});
    if(!servicecardtype){
      MlServiceCardType.insert(serviceCardType[i]);
    }
  }
})
