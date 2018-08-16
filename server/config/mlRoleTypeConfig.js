/**
 * Created by vishwadeep.kapoor on 14/2/17.
 */

let userType = [
  {_id:'internalRole',roleTypeName:"Internal Role",roleTypeDisplayName:"Internal",roleTypeDescription:"","isActive":true},
  {_id:'externalRole',roleTypeName:"External Role",roleTypeDisplayName:"External",roleTypeDescription:"","isActive":true}
];

Meteor.startup(function () {
  for(var i = 0; i < userType.length; i++){
    let userTypeData = MlRoleTypes.findOne({_id: userType[i]._id});
    if(!userTypeData){
      MlRoleTypes.insert(userType[i]);
    }
  }
})
