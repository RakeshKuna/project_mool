/**
 * Created by vishwadeep on 13/9/17.
 */
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findAnchorUserActionHandler(paramContext) {
  const {clusterId, chapterId, subChapterId} = paramContext
  const result = await client.query({
    query: gql`
    query($clusterId: String,$chapterId: String,$subChapterId: String){
    fetchAnchorUsers(clusterId: $clusterId, chapterId: $chapterId, subChapterId: $subChapterId){
       userDetails{
          userId: _id
          displayName
          userName
          profileImage
       }
      portfolioCounter {
          communityCode : _id
          communityType
          communityImageLink
          count
        }
      } 
    }`,
    fetchPolicy: 'network-only',
    variables:{
      clusterId,
      chapterId,
      subChapterId
    }
  })
  const response = result.data.fetchAnchorUsers
  return response
}
