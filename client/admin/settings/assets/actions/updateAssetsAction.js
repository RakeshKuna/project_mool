import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateSelectedAssetActionHandler(assetId, assetDetails) {
  let assetsMasterData =  assetDetails;
  const result = await client.mutate({
    mutation: gql`
      mutation($assetId:String, $assetsMasterData:assetsMasterData){
        updateSelectedAsset(assetId:$assetId, assetsMasterData:$assetsMasterData){
          success,
          result,
          code
        }
      }
    `,
    variables: {
        assetId,
        assetsMasterData
    }
  })
  const id = result.data.updateSelectedAsset;
  return id
}
