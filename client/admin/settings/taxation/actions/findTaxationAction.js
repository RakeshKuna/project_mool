import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import {getAdminUserContext} from "../../../../commons/getAdminUserContext";

export async function findTaxationActionHandler(TaxationId) {
  let did=TaxationId
  let clusterId = getAdminUserContext().clusterId;
  const result = await client.query({
    query: gql`
    query  ($id: String, $clusterId:String){
        fetchTaxation(clusterId:$clusterId, id:$id) {
          _id
          taxationName
          taxationValidityFrom
          taxationValidityTo
          aboutTaxation
          isActive
    			taxInformation{
            taxId,
            taxName,
            taxPercentage,
            aboutTax,
            applicableStates
            statesInfo{
              taxId,
              stateName,
              taxPercentage,
              isChecked
            }
          }
        }
      }
    `,
    variables: {
      clusterId:clusterId,
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchTaxation;
  return id
}
