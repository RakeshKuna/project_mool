import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addTaxActionHandler(TaxTypeDetails) {
  let taxName = TaxTypeDetails.taxName;
  let taxDisplayName = TaxTypeDetails.taxDisplayName;
  let aboutTax = TaxTypeDetails.aboutTax;
  let isActive = TaxTypeDetails.isActive;
  let taxTypeInfo={taxName,taxDisplayName,aboutTax};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        createMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"CREATE",type:TAXTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"taxTypeInfo":taxTypeInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
