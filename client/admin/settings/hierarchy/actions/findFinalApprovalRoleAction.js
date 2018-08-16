import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import  _ from 'lodash'

export async function findFinalApprovalRoleActionHandler(department,subDepartment,cluster, subChapterId, isDefaultSubChapter) {
  const result = await client.query({
    query: gql`
      query  ($departmentId: String,$subDepartmentId:String,$clusterId:String, $subChapterId:String, $isDefaultSubChapter: Boolean){
         fetchFinalApprovalRole(departmentId:$departmentId,subDepartmentId:$subDepartmentId,clusterId:$clusterId, subChapterId:$subChapterId, isDefaultSubChapter: $isDefaultSubChapter) {
          _id
          finalApproval{
            department
            subDepartment
            role
            isChecked
          }
         } 
        }
    `,
    variables: {
      departmentId:department,
      subDepartmentId:subDepartment,
      clusterId:cluster,
      subChapterId:subChapterId,
      isDefaultSubChapter:isDefaultSubChapter
    },
    fetchPolicy: 'network-only'
  })
  var id = result.data.fetchFinalApprovalRole;
  var data = _.omit(id, '__typename')
  data.finalApproval = _.omit(data.finalApproval, '__typename')
  return data
}
