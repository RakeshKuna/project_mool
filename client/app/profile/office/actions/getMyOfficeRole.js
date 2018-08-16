/**
 * Created by pankaj on 15/7/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function getMyOfficeRoleActionHandler(officeId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($officeId: String!) {
            getMyOfficeRole(officeId: $officeId){
              success
              code
              result
            }  
          }
      `,
    variables: {
      officeId: officeId
    }
  })
  const id = result.data.getMyOfficeRole;
  return id
}

