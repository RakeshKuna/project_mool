/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import gql from 'graphql-tag'

import {appClient} from '../../core/appConnection';

export async function followActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($resourceId: String!,$resourceType:String!,$follow:Boolean){
              followUser(resourceId:$resourceId,resourceType:$resourceType,follow:$follow){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType,
      follow:details.follow
    }
  })
  const resp = result.data.followUser;
  if (resp.success) {
    toastr.success(resp.result);
    return resp;
  }
  return null;
}

export default async function handleFollowAction(details){

    var resp = await followActionHandler(details);
    return resp;
}



