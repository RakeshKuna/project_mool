/**
 * Created by pankaj on 24/7/17.
 */
import gql from "graphql-tag";
import { client } from "../../../../../core/apolloConnection";

export async function ongoingAppointmentActionHandler(status) {
  const result = await client.query({
    query: gql`
      query($status: String) {
        fetchMyAppointmentByStatus(status: $status){
          _id
          appointmentType
          appointmentId
          appointmentInfo {
            resourceType
            resourceId
            serviceCardId
            serviceName
            taskName
            sessionId
            serviceOrderId
          }
          startDate
          endDate
        }
      }
    `,
    variables: {
      status
    },
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchMyAppointmentByStatus;
  return data;
}

export async function fetchServiceByServiceId(serviceId, sessionId) {
  const result = await client.query({
    query: gql`
    query($serviceId:String){       
        findService(serviceId:$serviceId){
        _id
        userId
        profileId
        name
        displayName
        noOfSession
        validTill
        sessionFrequency
        finalAmount
        duration{
         hours
         minutes
        }
        status
        termsAndCondition{
          isCancelable
          noOfDaysBeforeCancelation
          isReschedulable
          noOfReschedulable
        }
        attachments{
          name
          info
          isMandatory
        }
        payment {
          isDiscount
          discountType
          discountValue
          isTaxInclusive
          isPromoCodeApplicable
          tasksAmount
          tasksDiscount
          tasksDerived
        }
        tasks {
          id
          sequence
          sessions{
            id
            sequence
          }
        }
        facilitationCharge{
          type
          amount
        }
        state{
          id
          name
        }
        city{
          id
          name
        }
        community{
          id
          name
        }
        createdAt
        updatedAt
      }
      }
    `,
    variables: {
      serviceId
    },
    fetchPolicy: 'network-only'
  });
  var response = result.data.findService;
  let service = _.omit(response, '__typename');
  service.duration = _.omit(service.duration, '__typename');
  service.payment = _.omit(service.payment, '__typename');
  service.facilitationCharge = _.omit(service.facilitationCharge, '__typename');
  let stateArray = [];
  _.each(service.state, (item, say) => {
    let value = _.omit(item, '__typename')
    stateArray.push(value);
  });
  service.state = stateArray;
  let cityArray = [];
  _.each(service.city, (item, say) => {
    let value = _.omit(item, '__typename')
    cityArray.push(value)
  });
  service.city = cityArray;
  let communityArray = [];
  _.each(service.community, (item, say) => {
    let value = _.omit(item, '__typename')
    communityArray.push(value)
  });
  service.community = communityArray;
  let taskArray = [];
  _.each(service.tasks, (item, say) => {
    let value = _.omit(item, '__typename');
    taskArray.push(value)
  });
  service.tasks = taskArray;
  if (service.tasks && service.tasks.length > 0) {
    let filterTask = service.tasks.find(function (data) {
      data.sessions = data.sessions ? data.sessions : [];
      return data.sessions.some(function (session) {
        return session.id == sessionId;
      });
    });
    service.tasks = filterTask;
  }
  return service
}

export async function findTaskActionHandler(taskId) {
  const result = await client.query({
    query: gql`
          query  ($taskId: String){
            fetchTaskForApointment(taskId: $taskId) {
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
                activities {
                  id: _id
                  mode
                  name
                  displayName
                  duration {
                    hours
                    minutes
                  }
                }
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
  var resp = result.data.fetchTaskForApointment;
  let data = _.omit(resp, '__typename')
  data.duration = _.omit(data.duration, '__typename')
  data.payment = _.omit(data.payment, '__typename')
  let sessionArray = []
  _.each(data.session, function (item, say) {
    let value = _.omit(item, '__typename')
    value.duration = _.omit(value.duration, '__typename')
    sessionArray.push(value)
  })
  data.session = sessionArray
  let attachmentArray = []
  _.each(data.attachments, function (item, say) {
    let value = _.omit(item, '__typename')
    attachmentArray.push(value)
  })
  data.attachments = attachmentArray
  return data;
}

export async function fetchSelfTaskById(selfTaskId) {
  const result = await client.query({
    query: gql`
    query($selfTaskId: String) {       
      fetchSelfTask(selfTaskId: $selfTaskId) {
        _id
        profileId
        name
        mode
        about
        industries
        conversation
        duration {
          hours
          minutes
        }
        frequency
        expectedInput
        expectedOutput
      }
    }
    `,
    variables: {
      selfTaskId
    },
    fetchPolicy: 'network-only'
  });
  var response = result.data.fetchSelfTask;
  return response;
}
