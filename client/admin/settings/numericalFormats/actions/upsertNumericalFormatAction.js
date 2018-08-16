import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function upsertNumericalFormatActionHandler(regionalDetails)
{
  let numericalInfo=regionalDetails
  const result = await client.mutate({
    mutation: gql`
  mutation($numericalInfo:NumericalInfoRequest){
  updateGlobalSetting(type:NUMERICAL,settingsData:{numericalInfo:$numericalInfo})
    
   }
   `,
    variables: {
      numericalInfo
    }
  })
  console.log(result)

  const id = result.data.updateGlobalSetting;

  return id
}
