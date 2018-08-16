import gql from 'graphql-tag'
import {client} from '../../admin/core/apolloConnection';

export async function updateTransactionLogActionHandler(transactionparams, action) {
  // var userId = transactionparams._id
  // let userName = transactionparams.username;
  // let emailId = transactionparams.profile.internalUprofile.moolyaProfile.email
  // let action = 'logout'
  // let createdAt = new Date()
  // let transactionDetails = `User ${userName} performed ${action} action at ${createdAt}`}

  const result = await client.mutate({
    mutation: gql`
  mutation ($transactions: TransactionsLogInput) {
  createTransactionLog(transaction: $transactions) {
    success
    code
    result
  }
}

   `,
    variables: {
    transactions:{
      userId:transactionparams._id,
      userName:transactionparams.profile.InternalUprofile.moolyaProfile.firstName,
      emailId:transactionparams.username,
      action:action,
      createdAt:new Date(),
      transactionDetails:`User ${transactionparams.profile.InternalUprofile.moolyaProfile.firstName} performed ${action} action at ${new Date()}`

    }
    }
  })
  const id = result.data.createTransactionLog;
  return id
}
