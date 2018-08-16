/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import gql from 'graphql-tag'

import {appClient} from '../../core/appConnection';

export async function inquiryActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($resourceId: String!,$resourceType:String!,$subject:String!,$message:String!){
              createInquiry(resourceId:$resourceId,resourceType:$resourceType,subject:$subject,message:$message){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType,
      subject : details.subject,
      message:details.message
    }
  })
  var resp = result.data.createInquiry;
  if (resp.success) {
   return resp;
  }
  return null;
}



