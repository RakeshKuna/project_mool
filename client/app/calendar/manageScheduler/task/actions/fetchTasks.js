/**
 * Created by pankaj on 19/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function fetchTasksActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchTasks(profileId: $profileId) {
        taskId : _id
        displayName
        profileId
        noOfSession
        duration {
          hours
          minutes
        }
        payment{
          derivedAmount
          currencyType
        }
        isActive
        isServiceCardEligible
        isInternal
        isExternal
      }
    }
    `,
    variables: {
      profileId:profileId
    },
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchTasks;
  return activities
}
