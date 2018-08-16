let countryPhoneNumberList = [
  {
    "_id" : "c101",
    phoneNumberCode:"+91"
  },
  {
    _id:"c191",
    phoneNumberCode:"+966"
  },
  {
    _id:"c229",
    phoneNumberCode:"+971"
  },
  {
    _id:"c231",
    phoneNumberCode:"+1"
  }
]

Meteor.startup(function () {
  for(var i = 0; i < countryPhoneNumberList.length; i++){
    let countryData = MlCountries.findOne({_id: countryPhoneNumberList[i]._id});
    if(countryData&&!countryData.phoneNumberCode&&countryPhoneNumberList[i].phoneNumberCode){
      MlCountries.update({_id: countryPhoneNumberList[i]._id},{$set:{"phoneNumberCode":countryPhoneNumberList[i].phoneNumberCode}});
    }
  }
  console.log("Countries phone numbers updated");
})
