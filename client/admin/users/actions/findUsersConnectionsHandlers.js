/**
 * Created by vishwadeep on 27/7/17.
 */
/**
 * import of libs
 * */
import gql from "graphql-tag";
import {client} from "../../core/apolloConnection";

export async function fetchConnectionHandler(registrationId, communityCode) {
  const result = await client.query({
    query: gql `
            query($registrationId:String, $communityCode: String){
                fetchConnectionsByReg(registrationId:$registrationId, communityCode:$communityCode) {
                    userName
                    firstName
                    lastName
                    displayName
                    chapterName
                }
            }
        `,
    variables: {
      registrationId,
      communityCode
    },
    fetchPolicy: 'network-only'
  })
  const connection = result.data.fetchConnectionsByReg;
  return connection
}
