/*import {client} from "../admin/core/apolloConnection";*/
import gql from 'graphql-tag';
/*import {appClient} from '../app/core/appConnection';*/

export async function verifyEmailHandler(token,connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation  ($token:String){
        verifyEmail(
          token : $token
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      token:token
    }
  });
  //console.log(result);
  return result&&result.data&&result.data.verifyEmail?result.data.verifyEmail:{};
}

export async function verifyMobileNumberHandler(mobileNumber,otp,connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation($mobileNumber:String,$otp:Int){
        verifyMobileNumber(
          mobileNumber :$mobileNumber,
          otp:$otp
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      mobileNumber:mobileNumber,
      otp:otp
    }
  });
  //console.log(result);
  return result&&result.data&&result.data.verifyMobileNumber?result.data.verifyMobileNumber:{};
}

export async function resendSmsOtpHandler(mobileNumber,connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation($mobileNumber:String){
        resendSmsVerification(
          mobileNumber :$mobileNumber
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      mobileNumber:mobileNumber
    }
  });
  //console.log(result);
  return result&&result.data&&result.data.resendSmsVerification?result.data.resendSmsVerification:{};
}

export async function smsUserOtpHandler(connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation{
        sendUserSmsVerification{
            success,
            code,
            result
         } 
      }
    `
  });
  //console.log(result);
  return result&&result.data&&result.data.sendUserSmsVerification?result.data.sendUserSmsVerification:{};
}
export async function resendUserSmsOtpHandler(connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation{
        resendUserSmsVerification{
            success,
            code,
            result
         } 
      }
    `
  });
  //console.log(result);
  return result&&result.data&&result.data.resendUserSmsVerification?result.data.resendUserSmsVerification:{};
}
export async function verifyUserMobileNumberHandler(mobileNumber,otp,connection){
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
    mutation($mobileNumber:String,$otp:Int){
        verifyUserMobileNumber(
          mobileNumber :$mobileNumber,
          otp:$otp
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      mobileNumber:mobileNumber,
      otp:otp
    }
  });
  //console.log(result);
  return result&&result.data&&result.data.verifyUserMobileNumber?result.data.verifyUserMobileNumber:{};
}
