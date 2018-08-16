import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findTransactionApprovalActionHandler(transactionTypeDetails) {
  let transactionType = transactionTypeDetails
  let status=["Approved"]
  const result = await client.query({
    query: gql`
     query ($transactionType: String) {
  fetchRequestsForApproval(transactionType: $transactionType) {
    _id
    userId
    status
    requestId
    transactionTypeName
    transactionTypeId
    requestTypeName
    requestTypeId
    requestDescription
    transactionAssignedBy
    transactionCompletedBy
    transactionUpdatedDate
    hierarchy
  }
}

    `,
    variables: {
      transactionType,
      status
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchRequestsForApproval;
  return id
}

