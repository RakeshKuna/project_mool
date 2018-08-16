import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findCountryActionHandler(CountryId) {
  let did = CountryId;

  const result = await client.query({
    query: gql`
    query ($id: String){
      fetchCountry(countryId:$id) {
        _id
        country
        countryCode
        displayName
        about
        capital
        url: flag_128
        isActive
      }
    }  
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchCountry;
  return id
}

/**
 * server flag_32 is been taken in url
 * @Note url : amzon old value
 */