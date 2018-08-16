/**
 * Created by vishwadeep on 18/5/17.
 */
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findChapterActionHandler(clusterid, chapterId) {
  let clusterId = clusterid
  let findChapterId = chapterId
  const result = await client.query({
    query: gql`
    query  ($clusterId : String, $chapterId : String){
        fetchChapter(clusterId:$clusterId, chapterId: $chapterId){
          chapterId: _id
          clusterId
          clusterName
          chapterName
          stateName
          stateId
        }
      }
    `,
    variables: {
      clusterId:clusterId,
      chapterId: findChapterId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchChapter;
  return id
}
