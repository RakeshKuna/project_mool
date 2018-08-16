var noData = "not mentioned";
import mlNotificationRepo from '../mlNotificationRepo'

// const MlSmsNotification= class MlSmsNotification {
//   static  mlUserRegistrationOtp(otpNum,regId) {
//     try {
//       var regDetails = mlDBController.findOne('MlRegistration',{_id:regId});
//       let to=regDetails.registrationInfo.contactNumber;
//       let countryCode=regDetails.registrationInfo.countryId;
//       let msg= "Use "+otpNum+" as One Time Password (OTP) to activate your moolya account. ";
//       Meteor.setTimeout(function () {
//           mlSms.send(countryCode,to,msg);
//       }, 2 * 1000);
//
//     }catch (e) {
//       console.log("mlUserRegistrationOtp:Error while sending the OTP SMS Notification"+e);
//     }
//   }
// }

class MlSmsController{
  constructor(){
  }

  // Genric method to send sms
  sendSMS(data, countryCode, mobileNumber){
    var obj = {
      notificationType: "SMS",
      message:data
    }

    let country=mlDBController.findOne('MlCountries',{$or:[{"_id":countryCode},{"countryCode":countryCode}]});
    let countryPhoneNumberCode=country&&country.phoneNumberCode?country.phoneNumberCode:null;
    if(mobileNumber&&countryPhoneNumberCode){
      obj['toUserId'] = countryPhoneNumberCode.trim()+mobileNumber.trim();
      mlNotificationRepo.sendNotification(obj)
    }
  }
}

const mlSmsController = new MlSmsController();
Object.freeze(mlSmsController);

export default mlSmsController;
