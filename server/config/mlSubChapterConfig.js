// Created By Rajat Shekhar

// SubChapter Latitude and Longitude
if(Meteor.isServer){
  var subC = MlSubChapters.find({$or:[{latitude:{$exists:false}}, {latitude:NaN}]}).fetch()
  addNoise = () => {
    let x = Math.random() * 0.0007 ;
    x=Math.pow(-1,new Date().getMilliseconds()%2) * x + ""; // random +/-
    return parseFloat(x.substr(0,8));
  }

  subC.forEach(function(sub){
    var chapter = MlChapters.findOne({_id:sub.chapterId});
    var lat = chapter.latitude + addNoise();
    var lng = chapter.longitude + addNoise();
    MlSubChapters.update({_id:sub._id}, {$set:{latitude:lat, longitude:lng}})
  })
}
