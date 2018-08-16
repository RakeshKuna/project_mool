import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function setOfficeMemberIndependent(memberId, communityCode) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($memberId: String, $communityCode: String){
              officeMemberGoIndependent(memberId: $memberId, communityCode: $communityCode){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      memberId,
      communityCode
    }
  });
  const id = result.data.officeMemberGoIndependent;
  return id
}
