import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from 'lodash'

export async function updateProcessSetupActionHandler(data, details, loggedUserDetails)
{
  let tId = data._id;
  let process = {
    userId:data.userId,
    username:data.username,
    processTransactionId:data._id,
    processSteps:details
  }
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;                     /*attaching default user role context*/
  const result = await client.mutate({
    mutation: gql`
    mutation ($processTransactionId:String, $processSetup:processSetup, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String) {
        updateProcessSetup(processTransactionId:$processTransactionId, processSetup:$processSetup, clusterId: $clusterId,
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
      processTransactionId:tId,
      processSetup:process,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    }
  })
  const id = result.data.updateProcessSetup;
  return id
}

export async function updateProcessTransaction(transId, data) {

  const result = await client.mutate({
    mutation: gql`
        mutation ($processTransactionId:String, $processTransactions: processTransactions) {
        updateProcessTransaction(processTransactionId:$processTransactionId, processTransactions: $processTransactions) {
          success
          code
          result
        }
      }
    `,
    variables: {
      processTransactionId: transId,
      processTransactions:data
    },
    fetchPolicy: 'network-only'
  });
  console.log(result);
  const id = result.data.updateProcessTransaction;
  return id
}
