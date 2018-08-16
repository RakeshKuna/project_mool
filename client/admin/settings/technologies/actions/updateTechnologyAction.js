import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateSelectedTechnologyActionHandler(technologyId, techDetails) {
  let technologyMasterData =  techDetails;
  const result = await client.mutate({
    mutation: gql`
      mutation($technologyId:String, $technologyMasterData:technologyMasterData){
        updateSelectedTechnology(technologyId:$technologyId, technologyMasterData:$technologyMasterData){
          success,
          result,
          code
        }
      }
    `,
    variables: {
        technologyId,
        technologyMasterData
    }
  })
  const id = result.data.updateSelectedTechnology;
  return id
}
