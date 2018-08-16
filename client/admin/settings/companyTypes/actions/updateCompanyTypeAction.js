import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateCompanyTypeActionHandler(CmpType) {
  let _id=CmpType.id;
  let companyName = CmpType.companyName;
  let companyDisplayName = CmpType.companyDisplayName;
  let aboutCompany = CmpType.aboutCompany;
  let isActive = CmpType.isActive;
  let companyTypeInfo={companyName,companyDisplayName,aboutCompany};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:COMPANYTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"companyTypeInfo":companyTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
