import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";


export async function findUserRegistartionActionHandler(registrationId) {
  let did = registrationId;

  const result = await appClient.query({
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
      id: did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findRegistration;
  return id
}
