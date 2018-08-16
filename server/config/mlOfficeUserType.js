/**
 * Created by venkatsrinag on 14/7/17.
 */
let userTypes = [
  {name:"officebarers",code:'OFB', displayName:"Office Bearers", "isActive":true},
  {name:"consultant",code:'CNST',   displayName:"Consultant", "isActive":true},
  {name:"serviceprovider",code:'SP', displayName:"Service Provider", "isActive":true},
  {name:"principal",code:'PRI', displayName:"Principal", "isActive":true},
  {name:"cofunder",code:'COF', displayName:"Co-Funder", "isActive":true}
];

Meteor.startup(function () {
    for(var i = 0; i < userTypes.length; i++){
        MlOfficeUserType.update({name:userTypes[i].name}, {$set:userTypes[i]}, {upsert:true})
    }
})
