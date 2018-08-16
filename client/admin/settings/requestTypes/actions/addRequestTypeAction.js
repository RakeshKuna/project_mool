import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addRequestActionHandler(RequestTypeDetails) {
  let requestName = RequestTypeDetails.requestName;
  let displayName = RequestTypeDetails.displayName;
  let requestDesc = RequestTypeDetails.requestDesc;
  let isActive = RequestTypeDetails.isActive;
  let transactionType = RequestTypeDetails.transactionType;
  let transactionId = RequestTypeDetails.transactionId;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($requestName: String, $displayName: String, $requestDesc: String,$isActive: Boolean, $moduleName:String, $actionName:String, $transactionType:String,$transactionId:String){
        CreateRequestType(
          requestName: $requestName,
          displayName: $displayName,
          requestDesc: $requestDesc,
          isActive :$isActive,
          moduleName:$moduleName,
          actionName:$actionName,
          transactionType:$transactionType,
          transactionId:$transactionId
        ){
            success,
            code,
            result
        }  
      }
    `,
    variables: {
      requestName,
      displayName,
      requestDesc,
      isActive,
      moduleName:"REQUEST",
      actionName:"CREATE",
      transactionType,
      transactionId
    }
  })
  const id = result.data.CreateRequestType;
  return id
}
