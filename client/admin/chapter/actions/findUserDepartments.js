
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';


export async function findUserDepartmentypeActionHandler(userId, ClusterId, ChapterId, subChapterId) {
  let clusterId = ClusterId;
  let chapterId = ChapterId;
  let did=userId;
  let scid = subChapterId;
  const result = await client.query({
    query: gql`
      query ($id: String, $subChapterId:String, $clusterId:String, $chapterId:String) {
        data: fetchsubChapterUserDepSubDep(userId: $id, clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId) 
        {
            department
            departmentName
            subDepartment
            subDepartmentName
            isAvailiable
        }
      }
    `,
    variables: {
      clusterId:clusterId,
      chapterId:chapterId,
      id:did,
      subChapterId:scid
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data;
  return id
}
