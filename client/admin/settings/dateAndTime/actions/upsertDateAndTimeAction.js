import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function upsertDateAndTimeActionHandler(Details)
{

  let dateAndTimeInfo=Details

  const result = await client.mutate({
    mutation: gql`
     mutation($dateAndTimeInfo:DateAndTimeInfoRequest){
       updateGlobalSetting(type:DATEANDTIME,settingsData:{
          dateAndTimeInfo:$dateAndTimeInfo
       })
     }
     `,
    variables: {
      dateAndTimeInfo
    }
  })

  console.log(result)
  const id = result.data.updateGlobalSetting;
  return id
}
