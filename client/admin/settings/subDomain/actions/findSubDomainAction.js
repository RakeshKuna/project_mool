import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findSubDomainActionHandler(SubDomainId) {
  let did = SubDomainId
  const result = await client.query({
    query: gql`
          query  ($SubDomainId: String){
              findSubDomain(SubDomainId:$SubDomainId){
                  name,
                  displayName,
                  about,
                  industryId,
                  isActive
              }
          }
      `,
    variables: {
      SubDomainId:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findSubDomain;
  return id
}
