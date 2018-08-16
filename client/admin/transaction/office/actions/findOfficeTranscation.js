/**
 * Created by pankaj on 6/6/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findOfficeTransactionHandler(TransId, loggedUserDetails) {  /*sending user context to server for auth*/
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;
  const result = await client.query({
    query: gql`
        query ($id: String, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String) {
        findOfficeTransaction(
          officeTransactionId: $id,
          clusterId: $clusterId,
          chapterId: $chapterId,
          subChapterId: $subChapterId,
          communityId: $communityId
        ) {
          success
          code
          result
        }
      }
    `,
    variables: {
      id: TransId,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findOfficeTransaction;
  return id;
}
// export async function findOfficeTransactionHandler(TransId) {
//   const result = await client.query({
//     query: gql`
//         query ($id: String) {
//         findOfficeTransaction(officeTransactionId: $id) {
//           success
//           code
//           result
//         }
//       }
//     `,
//     variables: {
//       id:TransId
//     },
//     fetchPolicy: 'network-only'
//   })
//   const id = result.data.findOfficeTransaction;
//   return id
// }
