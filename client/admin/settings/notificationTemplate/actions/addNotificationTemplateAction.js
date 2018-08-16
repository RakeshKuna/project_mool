/**
 * Created by mohammed.mohasin on 22/07/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addNotificationTemplate(notificationTemplate)
{
  const result = await client.mutate({
    mutation: gql`
            mutation($notificationTemplate:notificationTemplateInput){
                createNotificationTemplate(notificationTemplate:$notificationTemplate){
                    result,
                    success,
                    code
                }    
            }
        `,
    variables: {
      notificationTemplate:notificationTemplate,
      moduleName: "NOTIFICATIONTEMPLATE",
      actionName: "CREATE"
    }
  })
  const id = result.data.createNotificationTemplate;
  return id
}
