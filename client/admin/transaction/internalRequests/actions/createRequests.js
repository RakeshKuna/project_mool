import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function createRequestsActionHandler(requestDetails) {
  let transaction = {}
  requests = requestDetails;
  const result = await client.mutate({
    mutation: gql`
    mutation ($requests: requestsInput,$clusterId:String,$chapterId:String,$subChapterId:String,$communityId:String) {
     createRequestss(requests: $requests,clusterId:$clusterId,chapterId:$chapterId,subChapterId:$subChapterId,communityId:$communityId) {
    success
    code
    result
  }
}

    `,
    variables: {
      requests,
      clusterId:requests.cluster,
      chapterId:requests.chapter,
      subChapterId:requests.subChapter,
      communityId:requests.community
    }
  })
  const id = result.data.createRequestss;
  return id;
}
