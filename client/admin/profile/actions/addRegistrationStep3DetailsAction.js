import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function addRegistrationStep3Details(details,type,registrationId) {
  let registration = {}
  /*let detailsList = details.splice(-1,1)*/
  if(type == "CONTACTTYPE"){
    registration = {
      contactInfo : details
    }
  }else if(type == "ADDRESSTYPE"){

    registration = {
      addressInfo : details
    }
  }else if(type == "SOCIALLINKS")
  {
    registration = {
      socialLinksInfo : details
    }
  }else if(type == "EMAILTYPE"){
    registration = {
      emailInfo : details
    }
  }
  else if(type=="KYCDOCUMENT"){
    registration = {
      kycDocuments : details
    }
  }
  ;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($registration: registrationObject!, $moduleName:String!, $actionName:String!,$registrationId:String!,$type:String!){
        createGeneralInfoInRegistration(
          registration : $registration,
          moduleName:$moduleName,
          actionName:$actionName,
          registrationId:$registrationId,
          type:$type
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      registration,
      moduleName:"REGISTRATION",
      actionName:"CREATE",
      registrationId:registrationId,
      type:type
    }
  })

  const id = result.data.createGeneralInfoInRegistration;
  /*  console.log("//////////////////////////");
   console.log(result.data.createStep3InRegistration);*/

  return id
}
