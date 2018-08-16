import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateTaxTypeActionHandler(TaxType) {
  let _id=TaxType.id;
  let taxName = TaxType.taxName;
  let taxDisplayName = TaxType.taxDisplayName;
  let aboutTax = TaxType.aboutTax;
  let isActive = TaxType.isActive
  let taxTypeInfo={taxName,taxDisplayName,aboutTax};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:TAXTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"taxTypeInfo":taxTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
