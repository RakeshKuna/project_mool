import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findCommunityActionHandler(clusterId,chapterId,subChapterId,comId)
{
  const result = await client.query({
    query: gql`
    query  ($clusterId: String, $communityId:String, $chapterId:String, $subChapterId:String){
        data:fetchCommunityDef(clusterId: $clusterId, chapterId: $chapterId, subChapterId: $subChapterId, communityId:$communityId){
            name,
            displayName,
            communityImageLink,
            code,
            aboutCommunity,
            showOnMap,
            isActive,
            clusters,
            chapters,
            subchapters,
            clusterName,
            chapterName,
            subChapterName
        }
      }
    `,
    variables: {
      communityId : comId,
      chapterId : chapterId,
      subChapterId : subChapterId,
      clusterId : clusterId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data;
  return id
}
