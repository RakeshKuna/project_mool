import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function getOfficeTransactionPaymentLinkActionHandler(transactionId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($transactionId: String!) {
              getOfficeTransactionPaymentLink(transactionId: $transactionId) {
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      transactionId: transactionId
    }
  })
  const id = result.data.getOfficeTransactionPaymentLink;
  return id
}
