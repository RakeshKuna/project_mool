let weekDay = [
  {_id:'Monday',dayName:"Monday",displayName:"Monday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Tuesday',dayName:"Tuesday",displayName:"Tuesday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Wednesday',dayName:"Wednesday",displayName:"Wednesday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Thursday',dayName:"Thursday",displayName:"Thursday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Friday',dayName:"Friday",displayName:"Friday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Saturday',dayName:"Saturday",displayName:"Saturday",about:"","isActive":true,"createdDateTime": new Date()},
  {_id:'Sunday',dayName:"Sunday",displayName:"Sunday",about:"","isActive":true,"createdDateTime": new Date()}
];
Meteor.startup(function () {
  for(var i = 0; i < weekDay.length; i++){
    let weekData = MlWeekDays.findOne({_id: weekDay[i]._id});
    if(!weekData){
      MlWeekDays.insert(weekDay[i]);
    }
  }
})

