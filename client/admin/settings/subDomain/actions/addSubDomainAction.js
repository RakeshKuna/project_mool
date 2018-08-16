import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addSubDomain(SubDomainMasterData) {
  const result = await client.mutate({
    mutation: gql`
            mutation($SubDomainMasterData:SubDomainMasterData){
                createSubDomain(SubDomainMasterData:$SubDomainMasterData){
                    result,
                    success,
                    code
                }    
            }
        `,
    variables: {
      SubDomainMasterData,
      moduleName: "SUBDOMAIN",
      actionName: "CREATE"
    }
  });
  return result.data.createSubDomain
}
