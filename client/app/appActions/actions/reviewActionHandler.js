/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import gql from 'graphql-tag'

import {appClient} from '../../core/appConnection';

export async function reviewActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($resourceId: String!,$resourceType:String!,$message:String!,$rating:Float){
              createReview(resourceId:$resourceId,resourceType:$resourceType,message:$message,rating:$rating){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType,
      message:details.message,
      rating:details.rating
    }
  })
  var resp = result.data.createReview;
  /*if (resp.success) {
   return resp;
  }*/
  return resp;
}



export async function fetchReviewsActionHandler(details) {
  const result = await appClient.query({
    query: gql`
      query($resourceId: String!,$resourceType:String!,$cursor:String){
          fetchReviews(resourceId:$resourceId,resourceType:$resourceType,cursor:$cursor){
                 reviewId
                 resourceId
                 resourceType
                 rating
                 message
                 userId
                 userEmail
                 createdOn
                 userName
                 userProfileImage
      }
      }`,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType,
      cursor:details.cursor
    },
    fetchPolicy: 'network-only'
  })
  var resp = result.data.fetchReviews||[];
  if (resp) {
    return resp;
  }
  return [];
}
