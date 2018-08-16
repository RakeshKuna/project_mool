let timeFormatType = [
  {_id:'HH:MM',timeFormatName:"HH:MM",timeFormatDisplayName:"HH:MM",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'HH:MM:SS',timeFormatName:"HH:MM:SS",timeFormatDisplayName:"HH:MM:SS",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'HH:MM AM/PM',timeFormatName:"HH:MM AM/PM",timeFormatDisplayName:"HH:MM AM/PM",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'HH:MM:SS AM/PM',timeFormatName:"HH:MM:SS AM/PM",timeFormatDisplayName:"HH:MM:SS AM/PM",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'HH:MM:SS 24h',timeFormatName:"HH:MM:SS 24h",timeFormatDisplayName:"HH:MM:SS 24h",about:"","isActive":true,"createdDateTime": new Date()}
];
Meteor.startup(function () {
  for(var i = 0; i < timeFormatType.length; i++){
    let timeFormatData = MlTimeFormats.findOne({_id: timeFormatType[i]._id});
    if(!timeFormatData){
      MlTimeFormats.insert(timeFormatType[i]);
    }
  }
})


