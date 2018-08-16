import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function updateRegistrationActionHandler(registrationDetails) {
  let registrationId = registrationDetails.registrationId;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($registrationId:String,$registrationDetails:registrationInfoInput,$details:RegistrationDetailsInput){
        updateRegistrationInfo(
          registrationId:$registrationId,
          registrationDetails:$registrationDetails,
          details:$details
        ) {
          success
          code
          result
        }
      }
    `,
    variables: {
      registrationId:registrationId,
      registrationDetails:registrationDetails.registrationDetail,
      details:registrationDetails.details
    }
  })
  const id = result.data.updateRegistrationInfo;
  return id
}

export async function updateRegistrationInfoDetails(registrationDetails,type,registrationId) {
  let registration = {};
  /*let detailsList = details.splice(-1,1)*/
  //registrationDetails= registrationDetails.forEach(function(v){ delete v.__typename });
  /*registrationDetails = registrationDetails.filter(function( obj ) {*/
 /* registrationArray= registrationDetails.map(function(item) {
    delete item.__typename;
    return item;
  });*/
 let registrationArray = []
   registrationArray  = _.map(registrationDetails, function (row) {
    return _.omit(row, ['__typename']);
  });
  if(type == "CONTACTTYPE"){
    registration = {
      contactInfo : registrationArray
    }
  }else if(type == "ADDRESSTYPE"){

    registration = {
      addressInfo : registrationArray
    }
  }else if(type == "SOCIALLINKS")
  {
    registration = {
      socialLinksInfo : registrationArray
    }
  }
  else if(type == "EMAILTYPE")
  {
    registration = {
      emailInfo : registrationArray
    }
  }
  ;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($registration: registrationObject!, $moduleName:String!, $actionName:String!,$registrationId:String!,$type:String!){
        updateRegistrationGeneralInfo(
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
      actionName:"UPDATE",
      registrationId:registrationId,
      type:type
    }
  })

  const id = result.data.updateRegistrationGeneralInfo;
  /*  console.log("//////////////////////////");
   console.log(result.data.createStep3InRegistration);*/

  return id
}

