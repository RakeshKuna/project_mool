/**
 * Created by pankaj on 8/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";

export async function fetchOfficeMembers(officeId,isPrincipal) {
  const result = await appClient.query({
    query: gql`
          query($officeId:String, $isPrincipal:Boolean){
              fetchOfficeMembers(officeId:$officeId, isPrincipal: $isPrincipal){
                name
                _id
                isActive
                isFreeze
                isRetire
                profileImage
              }
          }
      `,
    variables: {
      isPrincipal: isPrincipal,
      officeId: officeId
    },
    fetchPolicy: 'network-only'
  })
  return result.data.fetchOfficeMembers
}
