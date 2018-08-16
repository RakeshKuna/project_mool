import gql from "graphql-tag";
import {client} from "../../../core/apolloConnection";

export async function updateBackendUserActionHandler(updateUserObject, loginUserDetails) {
  let userId=updateUserObject.userId;
  let user=updateUserObject.userObject
  const {clusterId, chapterId, subChapterId, communityId} = loginUserDetails
   const result = await client.mutate({
   mutation: gql`
   mutation  ($userId:String!, $user: userObject!, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String){
   updateUser(
   userId: $userId,
   user: $user,
   clusterId: $clusterId,
   chapterId : $chapterId,
   subChapterId : $subChapterId,
   communityId : $communityId
   ){
      success,
      code,
      result
      } 
   }
   `,
   variables: {
     userId,
     user,
     clusterId,
     chapterId,
     subChapterId,
     communityId
   }
   })
  const id = result.data.updateUser;
  return id
}

// ,
// moduleName:"USERS",
//   actionName:"UPDATE"


// , $moduleName:String, $actionName:String


// ,
// moduleName:$moduleName,
//   actionName:$actionName
