MlSerialNumbers = new Mongo.Collection("mlSerialNumbers")

// if(Meteor.isServer){
var portfolioNumber = MlSerialNumbers.findOne({_id: "portfolioNumber"});
if (!portfolioNumber) {
  MlSerialNumbers.insert({_id: "portfolioNumber", seq: 0});
}

var registrationNumber = MlSerialNumbers.findOne({_id: "registrationNumber"});
if (!registrationNumber) {
  MlSerialNumbers.insert({_id: "registrationNumber", seq: 0});
}
// }
var transactionNumber = MlSerialNumbers.findOne({_id: "transactionNumber"});
if (!transactionNumber) {
  MlSerialNumbers.insert({_id: "transactionNumber", seq: 0});
}
var requestsNumber = MlSerialNumbers.findOne({_id: "requestsNumber"});
if (!requestsNumber) {
  MlSerialNumbers.insert({_id: "requestsNumber", seq: 0});
}
var officeNumber = MlSerialNumbers.findOne({_id: "officeTransaction"});
if (!officeNumber) {
  MlSerialNumbers.insert({_id: "officeTransaction", seq: 0});
}

var profileNumber = MlSerialNumbers.findOne({_id: "profileNumber"});
if (!profileNumber) {
  MlSerialNumbers.insert({_id: "profileNumber", seq: 0});
}

var internalTaskNumber = MlSerialNumbers.findOne({_id: "internalTaskNumber"});
if (!internalTaskNumber) {
  MlSerialNumbers.insert({_id: "internalTaskNumber", seq: 0});
}

var activityNumber = MlSerialNumbers.findOne({_id: "activityNumber"});
if (!activityNumber) {
  MlSerialNumbers.insert({_id: "activityNumber", seq: 0});
}
var taskNumber = MlSerialNumbers.findOne({_id: "taskNumber"});
if (!taskNumber) {
  MlSerialNumbers.insert({_id: "taskNumber", seq: 0});
}
var sessionNumber = MlSerialNumbers.findOne({_id: "sessionNumber"});
if (!sessionNumber) {
  MlSerialNumbers.insert({_id: "sessionNumber", seq: 0});
}
var serviceNumber = MlSerialNumbers.findOne({_id: "serviceNumber"});
if (!serviceNumber) {
  MlSerialNumbers.insert({_id: "serviceNumber", seq: 0});
}

let userServiceOrderNumber = MlSerialNumbers.findOne({_id: "userServiceOrderNumber"});
if (!userServiceOrderNumber) {
  MlSerialNumbers.insert({_id: "userServiceOrderNumber", seq: 0});
}

let appointmentNumber = MlSerialNumbers.findOne({_id: "appointmentNumber"});
if (!appointmentNumber) {
  MlSerialNumbers.insert({_id: "appointmentNumber", seq: 0});
}

let vactionNumber = MlSerialNumbers.findOne({_id: "vactionNumber"});
if (!vactionNumber) {
  MlSerialNumbers.insert({_id: "vactionNumber", seq: 0});
}

let shareNumber = MlSerialNumbers.findOne({_id: "shareNumber"});
if (!shareNumber) {
  MlSerialNumbers.insert({_id: "shareNumber", seq: 0});
}

let paymentNumber = MlSerialNumbers.findOne({_id: "paymentNumber"});
if (!paymentNumber) {
  MlSerialNumbers.insert({_id: "paymentNumber", seq: 0});
}

var connectionRequestNumber=MlSerialNumbers.findOne({_id: "connectionRequestNumber"});
if (!connectionRequestNumber) {
  MlSerialNumbers.insert({_id: "connectionRequestNumber", seq: 0});
}

var likesNumber=MlSerialNumbers.findOne({_id: "likesNumber"});
if (!likesNumber) {
  MlSerialNumbers.insert({_id: "likesNumber", seq: 0});
}

var reviewsNumber=MlSerialNumbers.findOne({_id: "reviewsNumber"});
if (!reviewsNumber) {
  MlSerialNumbers.insert({_id: "reviewsNumber", seq: 0});
}

var systemTransactionNumber=MlSerialNumbers.findOne({_id: "systemTransactionNumber"});
if (!systemTransactionNumber) {
  MlSerialNumbers.insert({_id: "systemTransactionNumber", seq: 0});
}

var onBoardTransactionNumber=MlSerialNumbers.findOne({_id: "onBoardTransactionNumber"});
if (!onBoardTransactionNumber) {
  MlSerialNumbers.insert({_id: "onBoardTransactionNumber", seq: 0});
}

var shareLibraryNumber=MlSerialNumbers.findOne({_id: "shareLibraryNumber"});
if (!shareLibraryNumber) {
  MlSerialNumbers.insert({_id: "shareLibraryNumber", seq: 0});
}

orderNumberGenService = (function(){
  function getNextSequence(name) {
    var ret = MlSerialNumbers.update(
      { _id: name },
      { $inc: { seq: 1 } },
      {upsert:true}
    )
    if(ret===1){
      let data=MlSerialNumbers.findOne({_id:name})
      if(data){
       return data.seq
      }
    }
    return ret;
  }

  return {
    assignRegistrationId:function(registration){
      registration.registrationId="RE"+FormatUtil.leadingZeros(getNextSequence("registrationNumber"),10);
    },
    assignPortfolioId:function(portfolio){
      let portfolioId = "PF"+FormatUtil.leadingZeros(getNextSequence("portfolioNumber"),10);
      portfolio.portfolioId=portfolioId
      portfolio.transactionId= portfolioId
    },
    assignTransationRequest:function(transaction){
      transaction.transactionTypeId="MLTR"+FormatUtil.leadingZeros(getNextSequence("transactionNumber"),10);
    },
    assignRequests:function(requests){
      requests.requestId="IR"+FormatUtil.leadingZeros(getNextSequence("requestsNumber"),10);
    },
    assignOfficeTransaction: function (officeTransaction) {
      officeTransaction.transactionId = "OF" + FormatUtil.leadingZeros(getNextSequence("officeTransaction"),10);
    },
    assignProcessSetupTransaction: function (officeTransaction) {
      officeTransaction.transactionId = "PS" + FormatUtil.leadingZeros(getNextSequence("officeTransaction"),10);
    },
    createUserProfileId: function (userProfile) {
      userProfile.profileId = "PL" + FormatUtil.leadingZeros(getNextSequence("profileNumber"), 10);
    },
    createinternalTaskId: function (taskObj) {
      taskObj.internalTaskId = "IK" + FormatUtil.leadingZeros(getNextSequence("internalTaskNumber"),10);
    },
    createInteractionSCcode: function (scDef) {
      scDef.code = "IS"+ FormatUtil.leadingZeros(getNextSequence("interactionSC"),10);
    },
    createBspokeOfficeSCcode: function (scDef) {
      scDef.code = "OFF-"+ FormatUtil.leadingZeros(getNextSequence("bspoke"),10);
    },
    createOfficeSCcode: function (scDef) {
      scDef.code = "OFF-"+ FormatUtil.leadingZeros(getNextSequence("office"),10);
    },

    createActivityId: function (userActivity) {
      userActivity.transactionId = "AC"+ FormatUtil.leadingZeros(getNextSequence("activityNumber"),10);
    },
    createTaskId: function (userTask) {
      userTask.transactionId = "TK"+ FormatUtil.leadingZeros(getNextSequence("taskNumber"),10);
    },
    createSessionId: function (userTask) {
      userTask.sessionId = "SE"+ FormatUtil.leadingZeros(getNextSequence("sessionNumber"),10);
    },
    createServiceId: function (userService) {
      userService.transactionId = "SC"+ FormatUtil.leadingZeros(getNextSequence("serviceNumber"),10);
    },
    createUserServiceOrderId: function (data) {
      data.orderId = "SO" + FormatUtil.leadingZeros(getNextSequence("userServiceOrderNumber"),10);
    },
    createAppointmentId: function (appointmentData) {
      appointmentData.appointmentId = "AP"+ FormatUtil.leadingZeros(getNextSequence("appointmentNumber"),10);
    },
    createVactionId: function (vactionData) {
      vactionData.vacationId = "HL"+ FormatUtil.leadingZeros(getNextSequence("vactionNumber"),10);
    },
    createShareId: function (data) {
      data.sharedId = "SH"+ FormatUtil.leadingZeros(getNextSequence("shareNumber"),10);
    },
    createPaymentId: function (data) {
      data.paymentId = "PY"+ FormatUtil.leadingZeros(getNextSequence("paymentNumber"),10);
    },
    createConnectionInteractionId: function (data) {
      var transactionId= "CR"+ FormatUtil.leadingZeros(getNextSequence("connectionRequestNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    createLikeInteractionId: function (data) {
      var transactionId= "LK"+ FormatUtil.leadingZeros(getNextSequence("likesNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    createReviewInteractionId: function (data) {
      var transactionId="RV"+ FormatUtil.leadingZeros(getNextSequence("reviewsNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    createSystemTransactionId: function (data) {
      var transactionId= "SY"+ FormatUtil.leadingZeros(getNextSequence("systemTransactionNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    createOnBoardTransactionId: function (data) {
      var transactionId= "OB"+ FormatUtil.leadingZeros(getNextSequence("onBoardTransactionNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    createShareLibraryId:function(data){
      var transactionId= "SD"+ FormatUtil.leadingZeros(getNextSequence("shareLibraryNumber"),10);
      if(data){data.transactionId = transactionId; return data;};
      return transactionId;
    },
    generateRandomPassword:function(){
      var randomId = function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 7; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
      }

      return "ML"+randomId();
    }

    /*generateProfileId:function(transaction){
      regDetails.profileId="ML-PR-"+FormatUtil.leadingZeros(getNextSequence("profileNumber"),8);
    }*/
  }})();

FormatUtil = {
  leadingZeros: pad
};

function pad(num, size) {
  var s = "00000000000" + num;
  return s.substr(s.length-size);
}
