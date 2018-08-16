import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function upsertRegionalActionHandler(regionalDetails)
{
let regionalInfo=regionalDetails
  const result = await client.mutate({
   mutation: gql`
   mutation($regionalInfo:RegionalInfoRequest){
     updateGlobalSetting(type:REGIONAL,settingsData:{regionalInfo:$regionalInfo})
   }
   `,
   variables: {
   regionalInfo
   }
   })
  const id = result.data.updateGlobalSetting;
  return id
}
