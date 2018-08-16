import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateFundingTypeActionHandler(fundingTypeId, fundingType) {
  const result = await client.mutate({
    mutation: gql`
      mutation($fundingTypeId:String, $fundingType:fundingTypeInput){
        updateFundingType(fundingTypeId:$fundingTypeId, fundingType:$fundingType){
          success,
          result,
          code
        }
      }
    `,
    variables: {
      fundingTypeId,
      fundingType
    }
  })
  const id = result.data.updateFundingType;
  return id
}
