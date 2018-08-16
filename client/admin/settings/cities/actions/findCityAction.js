import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findCityActionHandler(Id) {
  let did = Id;

  const result = await client.query({
    query: gql`
    query ($id: String){
      fetchCity(cityId:$id) {
        _id
        name
        countryCode
        stateId
        displayName
        about
        isActive
      }
    }  
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchCity;
  return id
}
