
import gql from 'graphql-tag'

import {client} from '../../../client/admin/core/apolloConnection'
import _ from 'lodash'

export async function findAnnotations(portfoliodetailsId, docId) {
  var connection=client||{};
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!, $docId:String!) {
              fetchAnnotations(portfoliodetailsId: $portfoliodetailsId, docId:$docId) {
                result
              }
          }
  
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId,
      docId:docId
    },
    fetchPolicy: 'network-only'
  })
  const data = result.data.fetchAnnotations;
  return data
}





