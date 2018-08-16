import gql from 'graphql-tag';
import {client} from '../../core/apolloConnection';

export async function updateContactDetails(addressDetails,type) {
  let addressBook = {};

  let addressBookArray = []
  addressBookArray = addressDetails;

 /* addressBookArray  = _.map(addressDetails, function (row) {
    return _.omit(row, ['__typename']);
  });*/
  if(type == "CONTACTTYPE"){
    addressBook = {
      contactInfo : addressBookArray
    }
  }else if(type == "ADDRESSTYPE"){

    addressBook = {
      addressInfo : addressBookArray
    }
  }
  else if(type == "EMAILTYPE")
  {
    addressBook = {
      emailInfo : addressBookArray
    }
  }
  ;

  const result = await client.mutate({
    mutation: gql`
    mutation  ( $moduleName:String!, $actionName:String!,$type:String!,$addressBook:addressBook){
        updateAddressBookInfo(
          moduleName:$moduleName,
          actionName:$actionName,
          addressBook:$addressBook,
          type:$type
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      addressBook:addressBook,
      moduleName:"PROFILE",
      actionName:"UPDATE",
      type:type
    }
  })

  const id = result.data.updateAddressBookInfo;

  return id
}


//===============================================================================

/*




export async function getContactDetails(type,registrationId) {
  let registration = {};

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
        updateAddressBookInfo(
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
      moduleName:"PROFILE",
      actionName:"UPDATE",
    }
  })

  const id = result.data.updateRegistrationGeneralInfo;

  return id
}


//=================================================================================================


export async function addContactDetails(type,registrationId) {
  let registration = {};

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
        updateAddressBookInfo(
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
      moduleName:"PROFILE",
      actionName:"UPDATE",
    }
  })

  const id = result.data.updateRegistrationGeneralInfo;

  return id
}
*/
