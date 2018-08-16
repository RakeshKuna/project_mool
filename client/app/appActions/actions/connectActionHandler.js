/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import gql from 'graphql-tag'

import {appClient} from '../../core/appConnection';

export async function connectActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($resourceId:String!,$resourceType:String!){
              connectionRequest(resourceId:$resourceId,resourceType:$resourceType){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType
    }
  })
  var resp = result.data.connectionRequest;
  if (resp.success) {
   return resp;
  }
  return null;
}

export async function acceptConnectionActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($connectionId:String!){
              acceptConnection(connectionId:$connectionId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      connectionId : details.connectionId
    }
  })
  var resp = result.data.acceptConnection;
  if (resp.success) {
    return resp;
  }
  return null;
}

export async function rejectConnectionActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($connectionId:String!){
              rejectConnection(connectionId:$connectionId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      connectionId : details.connectionId
    }
  })
  var resp = result.data.rejectConnection;
  if (resp.success) {
    return resp;
  }
  return null;
}

export async function fetchConnectionRequestHandler(transactionId) {
  const result = await appClient.query({
    query: gql`
    query($transactionId:String!){
      fetchConnectionByTransaction(transactionId:$transactionId) {
           _id
           requestedFrom
           createdBy
           updatedBy
           isAccepted
           isDenied
           isBlocked
           resendCount
           canAccept
           canReject
           canRequest
      }
    }
    `,
    variables: {
      transactionId:transactionId
    },
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchConnectionByTransaction?result.data.fetchConnectionByTransaction:null;
  return data;
}



