import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateRequestTypeActionHandler(RequestTypeDetails) {
  let _id=RequestTypeDetails.id;
  let requestName = RequestTypeDetails.requestName;
  let displayName = RequestTypeDetails.displayName;
  let requestDesc = RequestTypeDetails.requestDesc;
  let isActive = RequestTypeDetails.isActive;
  let transactionType = RequestTypeDetails.transactionType;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$requestName: String, $displayName: String, $requestDesc: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateRequestType(
          _id:$_id
          requestName: $requestName,
          displayName: $displayName,
          requestDesc: $requestDesc,
          isActive :$isActive,
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
      _id,
      requestName,
      displayName,
      requestDesc,
      isActive,
      transactionType,
      moduleName:"REQUEST",
      actionName:"UPDATE"
    }
  })
  const id = result.data.UpdateRequestType;
  return id
}
