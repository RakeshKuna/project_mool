/**
 * Created by pankaj on 8/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";

export async function fetchOfficeMember(memberId) {
  const result = await appClient.query({
    query: gql`
          query($memberId:String){
              fetchOfficeMember(memberId:$memberId){
                 _id
                 userId
                 mobileNumber
                 emailId
                 name
                 joiningDate
                 communityType
                 isActive
                 isPrincipal
                 isIndependent
                 isInternalUserInteraction
                 isExternalUserInteraction
                 isFreeze
                 isRetire
                 profileImage
              }
          }
      `,
    variables: {
      memberId: memberId
    },
    fetchPolicy: 'network-only'
  });
  return result.data.fetchOfficeMember;
}
