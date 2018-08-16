/**
 * Created by pankaj on 7/6/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

/**
 * Note: {Attaching the user context for admins}
 * */
export async function updateOfficeStatus(officeId, loggedUserDetails) {
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;
  const result = await client.mutate({
    mutation: gql`
        mutation ($id:String, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String) {
        updateOfficeStatus(id:$id,
          clusterId: $clusterId,
          chapterId: $chapterId,
          subChapterId: $subChapterId,
          communityId: $communityId) {
          success
          code
          result
        }
      }
    `,
    variables: {
      id: officeId,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    },
    fetchPolicy: 'network-only'
  });
  console.log(result);
  const id = result.data.updateOfficeStatus;
  return id
}
