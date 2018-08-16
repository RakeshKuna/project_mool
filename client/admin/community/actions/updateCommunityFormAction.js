import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function updateCommunityActionHandler(communityId, communityDetails) {
  let did = communityId;
  const result = await client.mutate({
    mutation: gql`
    mutation ($_id:String $communityDef:communityDefInput){
            updateCommunityDef(
                _id:$_id,
                communityDef:$communityDef
            ) 
         }
    `,
    variables: {
      _id : did,
      communityDef : communityDetails
    }
  })
  const id = result.data.updateCommunityDef;
  return id
}
