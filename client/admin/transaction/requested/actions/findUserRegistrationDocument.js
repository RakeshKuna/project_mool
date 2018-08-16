
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';


export async function findUserRegistartionActionHandler(registrationId) {
  let did=registrationId;

  const result = await client.query({
    query: gql`
    query  ($id: String){
         findRegistration(registrationId:$id)  {
      
      socialLinksInfo{
        socialLinkTypeName 
        socialLinkType     
        socialLinkUrl      
      }
  }
}

    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findRegistration;
  return id
}
