import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findAssignedRolesActionHandler(clusterId, departmentId,subDepartmentId,subChapterId,type) {
  let cluster = clusterId
  let did=departmentId
  let subdid = subDepartmentId
  let subChpId = subChapterId
  const result = await client.query({
    query: gql`
       query ($clusterId:String, $hierarchyId:String,$departmentId: String,$subDepartmentId:String,$subChapterId:String,$type:String){
         fetchAssignedRolesHierarchy(clusterId:$clusterId, hierarchyId:$hierarchyId,departmentId:$departmentId,subDepartmentId:$subDepartmentId,subChapterId:$subChapterId,type:$type) {
             _id
             teamStructureAssignment{
                 roleId
                 roleName
                 displayName
                 roleType             
                 isAssigned
                 assignedLevel
                 reportingRole
             }      
         } 
        }
    `,
    variables: {
      clusterId:cluster,
      hierarchyId:'',
      departmentId:did,
      subDepartmentId:subdid,
      subChapterId:subChpId,
      type : type
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchAssignedRolesHierarchy;
  return id
}
