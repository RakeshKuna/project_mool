import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDeptAndsubDeptActionHandler(clusterId) {
  let cid=clusterId
  const result = await client.query({
    query: gql`
       query  ($clusterId: String){
         fetchMoolyaBasedDepartmentAndSubDepartment(clusterId:$clusterId) {
            departmentId
            departmentName
            subDepartmentId
      			subDepartmentName
      			isMoolya
      			isActive
         }  
        }
    `,
    variables: {
      clusterId:cid
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchMoolyaBasedDepartmentAndSubDepartment;
  return id
}

export async function findNonMoolyaDeptAndsubDeptActionHandler(clusterId,subChapterId) {
  let cid=clusterId
  const result = await client.query({
    query: gql`
       query  ($clusterId: String,$subChapterId:String){
         fetchNonMoolyaBasedDepartmentAndSubDepartments(clusterId:$clusterId,subChapterId:$subChapterId) {
            departmentId
            departmentName
            subDepartmentId
      			subDepartmentName
      			isMoolya
      			isActive
         }  
        }
    `,
    variables: {
      clusterId:cid,
      subChapterId:subChapterId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchNonMoolyaBasedDepartmentAndSubDepartments;
  return id
}
