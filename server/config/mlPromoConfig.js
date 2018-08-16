let promoCodes = [
  {_id:'TIE100',code:"TIE100",description:"TIE100","isActive":true,"validityFrom":new Date(Date.UTC(2017,3,29)),"validityTo":new Date(Date.UTC(2017,6,31))},
  {_id:'TCD100',code:"TCD100",description:"TCD100","isActive":true,"validityFrom":new Date(Date.UTC(2017,3,29)),"validityTo":new Date(Date.UTC(2017,6,31))},
];
Meteor.startup(function () {
  for(var i = 0; i < promoCodes.length; i++){
    let promo = MlPromocodes.findOne({_id: promoCodes[i]._id});
    if(!promo){
      MlPromocodes.insert(promoCodes[i]);
    }
  }
})

