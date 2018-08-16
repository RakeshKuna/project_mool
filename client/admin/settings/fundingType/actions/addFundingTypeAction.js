import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addFundingType(fundingTypeObj)
{
  const result = await client.mutate({
    mutation: gql`
            mutation($fundingType:fundingTypeInput){
                createFundingType(fundingType:$fundingType){
                    result,
                    success,
                    code
                }    
            }
        `,
    variables: {
      fundingType:fundingTypeObj,
      moduleName: "FUNDINGTYPE",
      actionName: "CREATE"
    }
  })
  const id = result.data.createFundingType;
  return id
}
