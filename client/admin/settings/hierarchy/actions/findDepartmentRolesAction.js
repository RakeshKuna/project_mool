import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDeptRolesActionHandler(department,subDepartmentId,cluster, subChapterId, isDefaultSubChapter) {
  const result = await client.query({
    query: gql`
       query  ($departmentId: String,$subDepartmentId: String,$clusterId:String, $subChapterId:String, $isDefaultSubChapter: Boolean){
         fetchRolesForDepartment(departmentId:$departmentId,subDepartmentId:$subDepartmentId,clusterId:$clusterId, subChapterId:$subChapterId, isDefaultSubChapter: $isDefaultSubChapter) {
           _id
           roleName
           displayName
           roleType           
           isActive     
           isHierarchyAssigned
           assignRoles{
              cluster
              chapter
              subChapter
              community
              department 
              subDepartment 
              isActive
           }
         } 
        }
    `,
    variables: {
      departmentId:department,
      subDepartmentId:subDepartmentId,
      clusterId:cluster,
      subChapterId:subChapterId,
      isDefaultSubChapter:isDefaultSubChapter
    },
    fetchPolicy: 'network-only'
  })
  const id = result && result.data && result.data.fetchRolesForDepartment;
  return id
}
