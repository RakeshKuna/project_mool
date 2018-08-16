import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import {getAdminUserContext} from "../../../../commons/getAdminUserContext";

export async function addTaxationActionHandler(TaxationDetails)
{
  let taxation=TaxationDetails
  let clusterId = getAdminUserContext().clusterId;
  const result = await client.mutate({
    mutation: gql`
        mutation ($clusterId:String, $taxation:taxationInput){
            createTaxation(
                clusterId:$clusterId,
                taxation: $taxation
            ) 
         }
        `,
    variables: {
      clusterId,
      taxation
    }
  })
  const id = result.data.createTaxation;
  return id
}
