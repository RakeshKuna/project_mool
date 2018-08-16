
import gql from 'graphql-tag'

import _ from 'lodash'


export async function findComments(annotationId,client) {
  var connection=client||{};
  const result = await connection.query({
    query: gql`
          query ($annotationId: String!) {
              fetchComments(annotationId: $annotationId) {
                  _id
                  comment
    							annotatorId
    							portfolioId
    							userId 
                  userName
                  firstName
                  lastName
                  profileImage
                  createdAt
              }
          }
  
      `,
    variables: {
      annotationId: annotationId
    },
    fetchPolicy: 'network-only'
  })
  const data = result.data.fetchComments;
  let commitsArray = []
  commitsArray  = _.map(data, function (row) {
    return _.omit(row, ['__typename']);
  });
  return commitsArray;
}




