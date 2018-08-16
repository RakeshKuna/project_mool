/**
 * Created by vishwadeep.kapoor on 14/2/17.
 */

let userType = [
  {_id:'angle',userTypeName:"angle",displayName:"Angle",userTypeDesc:"","isActive":true},
  {_id:'ventureCapitalist',userTypeName:"venture capitalist",displayName:"venture Capitalist",userTypeDesc:"","isActive":true},
  {_id:'privateEquity',userTypeName:"private equity",displayName:"private equity",userTypeDesc:"","isActive":true}
  ];

Meteor.startup(function () {
  for(var i = 0; i < userType.length; i++){
    let userTypeData = MlUserTypes.findOne({_id: userType[i]._id});
    if(!userTypeData){
      MlUserTypes.insert(userType[i]);
    }
  }
})
