/**
 * Created by pankaj on 8/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function createOfficeMembers(officeId,OfficeMemberInfo) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($myOfficeId:String, $officeMember:officeMembers){
              data:createOfficeMembers(myOfficeId:$myOfficeId, officeMember:$officeMember){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      myOfficeId:officeId,
      officeMember:OfficeMemberInfo
    }
  })
  const id = result.data.data;
  console.log(id)
  return id
}
