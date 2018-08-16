/**
 * Created by viswadeep on 18/8/17.
 */

import gql from "graphql-tag";
import {client} from "../../core/apolloConnection";

export async function deActivateUser(userId, isActive) {
  const result = await client.mutate({
    mutation: gql `
          mutation($userId: String, $isActive: Boolean){
              deActivateUser(userId:$userId, isActive: $isActive){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      userId,
      isActive
    }
  })
  const id = result.data.deActivateUser;
  return id;
}

export async function deActivateUserProfileByContextHandler(userProfiles) {
  const {clusterId, chapterId ,subChapterId, communityId} = userProfiles
  const result = await client.mutate({
    mutation: gql `
          mutation($userProfiles: userProfiles, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String){
              deActivateUserProfileByContext(userProfiles:$userProfiles, clusterId: $clusterId, chapterId: $chapterId, subChapterId: $subChapterId, communityId: $communityId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      userProfiles,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    }
  })
  const returnData = result.data.deActivateUserProfileByContext;
  return returnData;
}

export async function showOnMapActionHandler(userId, isShowOnMap) {
  const result = await client.mutate({
    mutation:gql`
      mutation($userId: String, $isShowOnMap: Boolean){
        updateUserShowOnMap(userId: $userId, isShowOnMap:$isShowOnMap){
          success
          code
          result
        }
      }
    `,
    variables:{
      userId,
      isShowOnMap
    }
  })
  const resp = result.data.updateUserShowOnMap
  return resp
}
