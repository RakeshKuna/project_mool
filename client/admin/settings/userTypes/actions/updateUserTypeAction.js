import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateUserTypeActionHandler(UserTypeDetails) {
  let _id = UserTypeDetails.id;
  let userTypeName = UserTypeDetails.userTypeName;
  let displayName = UserTypeDetails.displayName;
  let userTypeDesc = UserTypeDetails.userTypeDesc;
  let isActive = UserTypeDetails.isActive
  let communityCode = UserTypeDetails.communityCode;
  let communityName = UserTypeDetails.communityName
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String, $userTypeName: String, $displayName: String, $userTypeDesc: String,$isActive: Boolean, $communityCode: String, $communityName:String, $moduleName:String, $actionName:String){
        UpdateUserType(
          _id: $_id,
          userTypeName: $userTypeName,
          displayName: $displayName,
          userTypeDesc: $userTypeDesc,
          isActive :$isActive,
          communityCode :$communityCode
          communityName :$communityName,
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
      userTypeName,
      displayName,
      userTypeDesc,
      isActive,
      communityCode,
      communityName,
      moduleName: "USERTYPE",
      actionName: "UPDATE"
    }
  })
  const id = result.data.UpdateUserType;
  return id
}
