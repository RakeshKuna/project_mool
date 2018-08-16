import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addCompanyTypeActionHandler(CompanyTypeDetails) {
  let companyName = CompanyTypeDetails.companyName;
  let companyDisplayName = CompanyTypeDetails.companyDisplayName;
  let aboutCompany = CompanyTypeDetails.aboutCompany;
  let isActive = CompanyTypeDetails.isActive;
  let companyTypeInfo={companyName,companyDisplayName,aboutCompany};
  const result = await client.mutate({
    mutation: gql`
    mutation  ($masterData:MasterSettingsRequest){
       createMasterSetting(
          moduleName:"MASTERSETTINGS",
          actionName:"CREATE",
          type:COMPANYTYPE,
          masterData:$masterData
        ) 
      }
    `,
    variables: {
      masterData:{"companyTypeInfo":companyTypeInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
