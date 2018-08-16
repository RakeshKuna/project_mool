/**
 * Created by vishwadeep on 13/5/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../app/core/appConnection';

export async function createOfficeActionHandler(myOffice) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($myOffice:myOffice){
              createOffice(myOffice:$myOffice){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      myOffice
    }
  })
  const id = result.data.createOffice;
  return id
}

