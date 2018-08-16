import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function   updateSelectedSubDomainActionHandler(SubDomainId, SubDomainDetails) {
  let SubDomainMasterData =  SubDomainDetails;
  const result = await client.mutate({
    mutation: gql`
      mutation($SubDomainId:String, $SubDomainMasterData:SubDomainMasterData){
        updateSelectedSubDomain(SubDomainId:$SubDomainId, SubDomainMasterData:$SubDomainMasterData){
          success,
          result,
          code
        }
      }
    `,
    variables: {
      SubDomainId,
      SubDomainMasterData
    }
  })
  const id = result.data.updateSelectedSubDomain;
  return id
}
