/**
 * Created by venkatasrinag on 25/2/17.
 */
import gql from 'graphql-tag'

export async function fetchAssignUsersActionHandler(clusterId, chapterId, subChapterId, communityId, subChapterName,connection) {
  let clusterid = clusterId,
  chapterid = chapterId,
  subChapterid = subChapterId,
  communityid = communityId,
  scName = subChapterName;
  var connection=connection||{};
  const result = await connection.query({
    query: gql`
       query ($clusterId:String, $chapterId:String, $subChapterId:String, $communityId:String, $subChapterName:String) {
        data: fetchAssignedUsers(clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId, communityId:$communityId,subChapterName:$subChapterName ) 
        {
            _id,
            username,
            profile{
              isActive
              profileImage
            }
        }
      }
    `,
    variables: {
      clusterId:clusterid,
      chapterId:chapterid,
      subChapterId:subChapterid,
      communityId:communityid,
      subChapterName:scName
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data;
  return id
}
