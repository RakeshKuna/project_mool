import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function createUserGeneralInfoDetails(details,type,registrationId,profileId) {
/*
  const result = await appClient.mutate({
    mutation: gql`
          mutation($contactObj: String){
              updateContactNumber(contactDetails:$contactObj){
                  success,
                  code,
                  result
              }
          }
      `,
    variables: {
      details
    }
  })
  const id = result.data.updateContactNumber;
  return id*/

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

  const result = await appClient.mutate({
    mutation: gql`
    mutation  ($registration: registrationObject!, $moduleName:String!, $actionName:String!,$registrationId:String!,$profileId:String!,$type:String!){
        createUserGeneralInfo(
          registration : $registration,
          moduleName:$moduleName,
          actionName:$actionName,
          registrationId:$registrationId,
          profileId:$profileId
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
      moduleName:"USERS",
      actionName:"UPDATE",
      registrationId:registrationId,
      profileId:profileId,
      type:type
    }
  })

  const id = result.data.createUserGeneralInfo
  return id
}



export async function updateUserGeneralInfoDetails(registrationDetails,type,registrationId,profileId) {
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

  const result = await appClient.mutate({
    mutation: gql`
    mutation  ($registration: registrationObject!, $moduleName:String!, $actionName:String!,$registrationId:String!,$profileId:String!,$type:String!){
        updateUserGeneralInfo(
          registration : $registration,
          moduleName:$moduleName,
          actionName:$actionName,
          registrationId:$registrationId,
          profileId:$profileId
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
      moduleName:"USERS",
      actionName:"UPDATE",
      registrationId:registrationId,
      profileId:profileId,
      type:type
    }
  })

  const id = result.data.updateUserGeneralInfo;
  /*  console.log("//////////////////////////");
   console.log(result.data.createStep3InRegistration);*/

  return id
}




