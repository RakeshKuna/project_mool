import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findTechnologyActionHandler(technologyId) {
  let did = technologyId
  const result = await client.query({
      query: gql`
          query  ($technologyId: String){
              findTechnology(technologyId:$technologyId){
                  technologyName,
                  displayName,
                  about,
                  icon,
                  isActive
              }
          }
      `,
    variables: {
      technologyId:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findTechnology;
  return id
}
