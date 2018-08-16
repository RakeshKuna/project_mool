import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function fetchDefaultCenterOfUser(ModuleTypeDetails) {
  let did=ModuleTypeDetails
  let result = await appClient.query({
    query: gql`
        query($module: String, $id: String){
         data:fetchMapCenterCordsForExternalUser(module: $module, id: $id){
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

export async function findMapDetailsTypeActionHandler(ModuleTypeDetails) {
  let did=ModuleTypeDetails
  const result = await appClient.query({
    query: gql`
        query ($moduleName: String, $id: String) {
         data: fetchAppMapData(moduleName: $moduleName, id: $id){
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
