let dateFormatType = [
  {_id:'DD/MM/YY',dateFormatName:"DD/MM/YY",dateFormatDisplayName:"DD/MM/YY",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'DD/MM/YYYY',dateFormatName:"DD/MM/YYYY",dateFormatDisplayName:"DD/MM/YYYY",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'MM/DD/YY',dateFormatName:"MM/DD/YY",dateFormatDisplayName:"MM/DD/YY",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'MM/DD/YYYY',dateFormatName:"MM/DD/YYYY",dateFormatDisplayName:"MM/DD/YYYY",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'DD/MON/YY',dateFormatName:"DD/MON/YY",dateFormatDisplayName:"DD/MON/YY",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'DD/MON/YYYY',dateFormatName:"DD/MON/YYYY",dateFormatDisplayName:"DD/MON/YYYY",about:"","isActive":true,"createdDateTime": new Date()}
];
Meteor.startup(function () {
  for(var i = 0; i < dateFormatType.length; i++){
    let dateFormatData = MlDateFormats.findOne({_id: dateFormatType[i]._id});
    if(!dateFormatData){
      MlDateFormats.insert(dateFormatType[i]);
    }
  }
})


