import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addAssets(assetsMasterData)
{
    const result = await client.mutate({
        mutation: gql`
            mutation($assetsMasterData:assetsMasterData){
                createAssets(assetsMasterData:$assetsMasterData){
                    result,
                    success,
                    code
                }    
            }
        `,
        variables: {
          assetsMasterData,
          moduleName: "ASSETS",
          actionName: "CREATE"
        }
  })
  const id = result.data.createAssets;
  return id
}
