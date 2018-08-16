/**
 * Created by venkatasrinag on 20/2/17.
 */
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';


export async function findUserDepartmentypeActionHandler(userId, clusterId) {
  let did=userId;
  let clusterid = clusterId;
  const result = await client.query({
    query: gql`
      query ($id: String, $clusterId:String) {
        data: fetchUserDepSubDep(userId: $id, clusterId:$clusterId) 
        {
            department,
            departmentName,
            subDepartment,
            subDepartmentName,
            isAvailiable
        }
      }
    `,
    variables: {
      id:did,
      clusterId:clusterid
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data;
  return id
}


export async function checkDefaultRole(userId) {
  const result = await client.query({
    query: gql`
      query ($userId: String) {
        checkDefaultRole(userId: $userId) {
            isDefault
            clusterId
            clusterName
            clusterFlag
            userRoles{
              isActive
              clusterId
            }
        }
      }
    `,
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.checkDefaultRole;
  return id
}

