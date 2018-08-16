/**
 * Created by Mukhil on 21/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function fetchTaskDetailsActionHandler (name) {
  const result = await appClient.query({
    query: gql` query ($name: String) {
      fetchTaskDetails(name: $name) {
        displayName
        noOfSession
        sessionFrequency
        duration {
          hours
          minutes
        }
        session {
          sessionId
          duration {
            hours
            minutes
          }
          activities
        }
      }
    }
    `,
    variables: {
      name
    },
  });
  var taskDetails = result.data.fetchTaskDetails;
  let task = _.omit(taskDetails, '__typename')
  task.duration = _.omit(task.duration, '__typename')
  task.payment = _.omit(task.payment, '__typename')
  let sessionArray = [];
  _.each(task.session, (item, say) => {
    let value = _.omit(item, '__typename')
    sessionArray.push(value);
  });
  task.session = sessionArray;
  let attachmentsArray = [];
  _.each(task.attachments, (item, say) => {
    let value = _.omit(item, '__typename')
    attachmentsArray.push(value)
  });
  task.attachments = attachmentsArray;
  return task;
}

export async function fetchTasksInBookingActionHandler (id) {
  const result = await appClient.query({
    query: gql` query ($id: [String]) {
      fetchTasksInBooking(id: $id) {
        _id
        displayName
        noOfSession
        sessionFrequency
        duration {
          hours
          minutes
        }
        session {
          sessionId
          duration {
            hours
            minutes
          }
          activities
        }
      }
    }
    `,
    variables: {
      id
    },
  });
  var tasks = result.data.fetchTasksInBooking;
  return tasks;
}
