import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateAddressTypeActionHandler(Details)
{
  let _id=Details.id;
  let addressName = Details.addressName||null;
  let aboutAddress = Details.aboutAddress||null;
  let addressDisplayName = Details.addressDisplayName||null;
  let isActive = Details.isActive;
  let addressTypeInfo={addressName,aboutAddress,addressDisplayName};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:ADDRESSTYPE, masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"addressTypeInfo":addressTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
