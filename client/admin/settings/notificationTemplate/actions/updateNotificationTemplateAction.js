/**
 * Created by mohammed.mohasin on 22/07/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateNotificationTemplateActionHandler(notificationTemplateId, notificationTemplate) {
  const result = await client.mutate({
    mutation: gql`
      mutation($notificationTemplateId:String!, $notificationTemplate:notificationTemplateInput){
        updateNotificationTemplate(notificationTemplateId:$notificationTemplateId, notificationTemplate:$notificationTemplate){
          success,
          result,
          code
        }
      }
    `,
    variables: {
      notificationTemplateId,
      notificationTemplate
    }
  })
  const id = result.data.updateNotificationTemplate;
  return id
}
