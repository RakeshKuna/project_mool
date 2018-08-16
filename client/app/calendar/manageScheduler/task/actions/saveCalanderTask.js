/**
 * Created by vishwadeep on 19/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../core/appConnection";
import _ from "lodash";

export async function createTaskActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($taskDetails:task){
              createTask(taskDetails:$taskDetails){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      taskDetails: details
    }
  })
  const resp = result.data.createTask;
  return resp;
}

export async function updateTaskActionHandler(taskId, details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($taskDetails:task, $taskId: String){
              updateTask(taskDetails:$taskDetails, taskId:$taskId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      taskId: taskId,
      taskDetails: details
    }
  })
  const resp = result.data.updateTask;
  return resp;
}

export async function findTaskActionHandler(taskId) {
  const result = await appClient.query({
    query: gql`
          query  ($taskId: String){
            fetchTask(taskId: $taskId) {
              name
              displayName
              isInternal
              isExternal
              note
              noOfSession
              sessionFrequency
              duration {
                hours
                minutes
              }
              session{
                duration {
                  hours
                  minutes
                }
                sessionId
                activities
                isOffline
              }
              attachments{
                name
                info
                isMandatory
              }
              payment{
                amount
                isDiscount
                discountType
                discountValue
                activitiesDerived
                activitiesDiscount
                activitiesAmount
                derivedAmount
                currencyType
              }
              isServiceCardEligible
              sessionFrequency
              isActive
            }
          }
      `,
    variables: {
      taskId: taskId
    },
    fetchPolicy: 'network-only'
  })
  var resp = result.data.fetchTask;
  let data = _.omit(resp, '__typename')
  data.duration = _.omit(data.duration, '__typename')
  data.payment = _.omit(data.payment, '__typename')
  let sessionArray = []
  _.each(data.session,function (item,say) {
    let value = _.omit(item, '__typename')
    value.duration = _.omit(value.duration, '__typename')
    sessionArray.push(value)
  })
  data.session = sessionArray
  let attachmentArray = []
  _.each(data.attachments,function (item,say) {
    let value = _.omit(item, '__typename')
    attachmentArray.push(value)
  })
  data.attachments = attachmentArray
  return data;
}

// termsAndCondition{
//   isReschedulable
//   noOfReschedulable
// }
