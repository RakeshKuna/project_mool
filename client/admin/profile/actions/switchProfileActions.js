import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';


export async function findUserActionHandler() {
  const result = await client.query({
    query: gql`
    
          query{
            fetchInternalUserProfiles{
                    isDefault,
                    clusterId,
                    clusterName,
                    clusterFlag,
                    userRoles{
                      roleId,
                      roleName,
                      clusterId,
                      chapterId,
                      validFrom,
                      validTo,
                      subChapterId,
                      communityId,
                      isActive,
                      hierarchyLevel,
                      hierarchyCode,
                      departmentId,
                      departmentName,
                      subDepartmentId,
                      subDepartmentName,
                      chapterName,
                      subChapterName,
                      communityName
                    }
                 
            }
          }
    `,
    fetchPolicy: 'network-only'
  })

  const id = result.data.fetchInternalUserProfiles;
  return id
}

export async function setAdminDefaultProfileActionHandler(clusterId) {

  const result = await client.mutate({
    mutation: gql`
          mutation($clusterId:String!){
              setAdminDefaultProfile(clusterId:$clusterId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      clusterId:clusterId
    }
  })
  const id = result.data.setAdminDefaultProfile;
  return id;
}

export async function switchProfileActionHandler(clusterId) {

  const result = await client.mutate({
    mutation: gql`
          mutation($clusterId:String!){
              switchProfile(clusterId:$clusterId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      clusterId:clusterId
    }
  })
  const id = result.data.switchProfile;
  return id;
}

export async function deActivateAdminProfileActionHandler(clusterId) {

  const result = await client.mutate({
    mutation: gql`
          mutation($clusterId: String){
              deActivateAdminUserProfile(clusterId:$clusterId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      clusterId:clusterId
    }
  })
  const id = result.data.deActivateAdminUserProfile;
  return id;
}

export async function fetchClusterDetails(clusterId) {


  const result = await client.query({
    query: gql`
            query($clusterId: String){  
                fetchUserRoleDetails(clusterId:$clusterId){          
                    roleId
                    roleName
                    clusterId
                    chapterId
                    validFrom
                    validTo
                    subChapterId
                    communityId
                    isActive
                    hierarchyLevel
                    hierarchyCode
                     clusterName
                    departmentId
                    departmentName
                    subDepartmentId
                    subDepartmentName
                    chapterName
                    subChapterName
                    communityName
                    roleName
                }
            }`,
    variables: {
      clusterId: clusterId
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.fetchUserRoleDetails;
  return id;

}

export function reloadPage(){
  location.reload();
}


