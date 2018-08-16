/**
 * Created by pankaj on 8/6/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function updateOfficeMemberActionHandler(officeId, memberId,officeMembers) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($officeId:String, $memberId:String, $officeMembers:officeMembers){
              updateOfficeMember(officeId:$officeId, memberId:$memberId, officeMember:$officeMembers){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      officeId: officeId,
      memberId: memberId,
      officeMembers:officeMembers
    }
  })
  const id = result.data.updateOfficeMember;
  return id
}

export async function deActivateOfficeActionHandler(officeId){
  const result = await appClient.mutate({
    mutation:gql`
      mutation($officeId:String){
        deActivateOffice(officeId:$officeId){
          success
          code
          result
        }
      }
    `,
    variables:{
      officeId
    }
  });
  const resp = result.data.deActivateOffice;
  return resp

}
