import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findStageOfCompanyTypeActionHandler(StageOfCompanyTypeId) {
  let did=StageOfCompanyTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindStageOfCompany(_id:$id){
         id:_id
        stageOfCompanyName
        stageOfCompanyDisplayName
        isActive
        about
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.FindStageOfCompany;
  return id
}
