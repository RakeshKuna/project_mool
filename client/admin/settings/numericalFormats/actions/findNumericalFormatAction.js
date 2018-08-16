import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findNumericalFormatActionHandler()
{
  const result = await client.query({
      query: gql`
       query{
              fetchGlobalSettings(type:NUMERICAL){
                numericalInfo{
                  numberOfDigitsAfterDecimal,
                  measurementSystem,
                  valueSeparator,
                  currencySymbol,
                  currencyFormat
                }
              }
                
              
            }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchGlobalSettings;
  return id
}
