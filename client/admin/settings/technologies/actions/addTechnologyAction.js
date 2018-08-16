import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addTechnology(technologyMasterData)
{
    const result = await client.mutate({
        mutation: gql`
            mutation($technologyMasterData:technologyMasterData){
                createTechnology(technologyMasterData:$technologyMasterData){
                    result,
                    success,
                    code
                }    
            }
        `,
        variables: {
          technologyMasterData,
          moduleName: "TECHNOLOGIES",
          actionName: "CREATE"
        }
  })
  const id = result.data.createTechnology;
  return id
}
