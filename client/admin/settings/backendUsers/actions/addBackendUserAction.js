import gql from "graphql-tag";
import {client} from "../../../core/apolloConnection";

export async function addBackendUserActionHandler(userObjectDetails, loginUserDetails) {   /*adding user context for others admins*/
let user=userObjectDetails
  let clusterId = loginUserDetails.clusterId
  let chapterId = loginUserDetails.chapterId
  let subChapterId = loginUserDetails.subChapterId
  let communityId = loginUserDetails.communityId
  const result = await client.mutate({
    mutation: gql`
       mutation  ($user: userObject!,$clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String){
        createUser(          
          user :$user,
          clusterId: $clusterId,
          chapterId: $chapterId,
          subChapterId: $subChapterId,
          communityId: $communityId
        ){
            success,
            code,
            result
        }
      }
    `,
    variables: {
      user,
      clusterId: clusterId,
      chapterId: chapterId,
      subChapterId: subChapterId,
      communityId: communityId
    }
  });
  const id = result.data.createUser;
  return id
}
// , $moduleName:String, $actionName:String   /* removing useless code*/

// moduleName:$moduleName,
//   actionName:$actionName
//
// moduleName:"USERS",
//   actionName:"CREATE",
