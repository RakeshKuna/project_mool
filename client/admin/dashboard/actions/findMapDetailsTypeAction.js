import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findMapDetailsTypeActionHandler(ModuleTypeDetails) {
  let did=ModuleTypeDetails
  const result = await client.query({
    query: gql`
        query ($moduleName: String, $id: String) {
         data: FetchMapData(moduleName: $moduleName, id: $id){
          key
          count
          icon
          context
      }
    }
    `,
    variables: {
      id:did.id,
      moduleName:did.moduleName
    },
    fetchPolicy: 'network-only'
  })
  const totalResult = result.data.data;
  return totalResult
}

export async function fetchDefaultCenterOfUser(ModuleTypeDetails) {
  let did=ModuleTypeDetails
  let result = await client.query({
    query: gql`
        query($module: String, $id: String){
         data:fetchMapCenterCordsForUser(module: $module, id: $id){
          lat
          lng
      }
    }
    `,
    variables: {
      id:did.id,
      module:did.moduleName
    },
    fetchPolicy: 'network-only'
  });
  result=result&&result.data&&result.data.data?result.data.data:null;
  return result;
}

export async function fetchUsers(clusterId, chapterId, subChapterId, userType) {

  const result = await client.query({
    query: gql`
      query($clusterId:String, $chapterId:String, $subChapterId:String, $userType:String, $offset: Int, $limit: Int, $fieldsData:[GenericFilter]){
          data:fetchUsersForDashboard(clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId, userType:$userType, offset: $offset, limit: $limit, fieldsData:$fieldsData){
              totalRecords
              data{
                  ...on BackendUsers{
                      _id,
                      name
                      profile{
                          isInternaluser,
                          isExternaluser,
                          isActive,
                          email
                      }
                  }
              }      
          }
      }
    `,
    variables: {
      clusterId:clusterId,
      chapterId:chapterId,
      subChapterId:subChapterId,
      userType:userType
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data.data;
  return id
}
