import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findFundingTypeActionHandler(fid) {
  let did = fid
  const result = await client.query({
    query: gql`
          query  ($fundingTypeId: String){
              fetchFundingType(fundingTypeId:$fundingTypeId){
                  fundingTypeName,
                  displayName,
                  about,
                  icon,
                  isActive
              }
          }
      `,
    variables: {
      fundingTypeId:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchFundingType;
  return id
}
