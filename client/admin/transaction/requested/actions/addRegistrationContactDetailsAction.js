import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addRegistrationContactDetails(contactDetails) {



  let contactInfo = {}
  contactInfo = contactDetails;
  let registrationObject = {
    contactInfo : [contactDetails]
  }


  //   let clusters = departmentAvailableArray[0].cluster[0].clusterId;
  //   let clusterObject = '';
  //   let clusterArray = null;
  //
  //     for(var i in clusters) {
  //       var cluster = clusters[i];
  //       clusterObject=clusterObject+'"'+cluster+'"' +",";
  //     }
  //   clusterArray = "["+clusterObject+"]";
  // console.log(clusterArray);
  // departmentAvailableArray[0].cluster[0].clusterId=clusterArray;
  //
  //  let departmentAvailable = departmentAvailableArray;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($registration: registrationObject!, $moduleName:String, $actionName:String){
        createRegistration(
          registration : $registration,
          moduleName:$moduleName,
          actionName:$actionName
        ){
            success,
            code,
            result
         } 
      }
    `,
    variables: {
      registrationObject,
      moduleName:"REGISTRATION",
      actionName:"CREATE"
    }
  })

  const id = result.data.createRegistration;
  console.log(result.data.createRegistration);
  console.log("//////////////////////////");
  return id
}
