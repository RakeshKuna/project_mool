/** ************************************************************
 * Date: 5 Jul, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This will manage the actions of service cards
 * JavaScript XML file mlFindService.jsx
 * *************************************************************** */


/**
 * Imports libs and components
 */
import gql from 'graphql-tag'
import { appClient } from '../../../../core/appConnection';

export async function getServiceBasedOnServiceId (serviceId, loggedUserDetails) {
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;
  const result = await appClient.query({
    query: gql`
query ($serviceId: String, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String) {
  getServiceBasedOnServiceId(serviceId: $serviceId,
          clusterId: $clusterId,
          chapterId: $chapterId,
          subChapterId: $subChapterId,
          communityId: $communityId) {
        userId
        profileId
        name
        displayName
        noOfSession
        validTill
        sessionFrequency
        finalAmount
        transactionId
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
      serviceId,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    },
    fetchPolicy: 'network-only'
  });
  var response = result.data.getServiceBasedOnServiceId;
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
    let value = _.omit(item, '__typename')
    taskArray.push(value)
  });
  service.tasks = taskArray;
  return service
}


/**
 * Method :: fetchTaskDetails
 * Description :: This function is called to get the details of a task based on the selected tasks
 * @params :: name : type :: String
 * returns ::  taskDetails : type :: Array
 **/


  export async function fetchTaskDetails (name) {
  const result = await appClient.query({
    query: gql`
query ($name: String) {
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
    fetchPolicy: 'network-only'
  });
  console.log(result)
  const taskDetails = result.data.fetchTaskDetails;
  return taskDetails
}


/**
 * Method :: getTaskFromService
 * Description :: This function is called on multiple instances to get Service details based in serviceId
 * @params :: serviceId : type :: String
 * returns ::  taskDetails : type :: Array
 **/

export async function getTaskFromService (serviceId) {
  console.log(serviceId)
  const result = await appClient.query({
    query: gql`
    query($serviceId:String){
        getTaskFromService(serviceId:$serviceId){
         userId
        profileId
        name
        displayName
        noOfSession
        finalAmount
        sessionFrequency
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
  console.log(result)
  const taskDetails = result.data.getTaskFromService;
  return taskDetails
}

/**
 * Method :: updateServiceActionHandler
 * Description :: This function used to update the service collection
 * @params :: serviceId : type :: String
 * @params :: Services  : type :: Object
 * returns ::  response : type :: Object
 **/

export async function updateServiceActionHandler(serviceId,Services) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId:String, $Services:service){
        updateServiceAdmin(serviceId:$serviceId,Services:$Services){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId,
      Services
    }
  });
  const response = result.data.updateServiceAdmin;
  return response
}

/**
 * Method :: fetchTaskDetailsForAdminServiceCard
 * Description :: This function used to update the service collection
 * @params :: serviceId : type :: String
 * @params :: profileId  : type :: String
 * returns ::  response : type :: Object
 **/

export async function fetchTaskDetailsForAdminServiceCard (profileId, serviceId, loggedUserDetails) {
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;
  const result = await appClient.query({
    query: gql`
      query($profileId: String, $serviceId: String, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String) {
        fetchTaskDetailsForAdminServiceCard(profileId: $profileId, serviceId: $serviceId,
         clusterId: $clusterId,
          chapterId: $chapterId,
          subChapterId: $subChapterId,
          communityId: $communityId) {
          id: _id
          name
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
            activities {
              id: _id
              mode
              name
              displayName
              isInternal
              isExternal
              isActive
              isServiceCardEligible
              duration {
                hours
                minutes
              }
              payment{
                derivedAmount
              }
            }
          }
          attachments {
             name
             info
             isMandatory
          }
        }
      }
    `,
    variables: {
      profileId,
      serviceId,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    },
    fetchPolicy: 'network-only'
  });
  var taskDetails = result.data.fetchTaskDetailsForAdminServiceCard;
  let tasks = [];
  let taskArray = [];
  _.each(taskDetails, (task, say) => {
    let sessionArray = [];
    let taskInfo =  _.omit(task, '__typename');
    _.each(taskInfo.session, (item, say) => {
      let value = _.omit(item, '__typename');
      sessionArray.push(value)
    });
    taskInfo.session = sessionArray;
    taskArray.push(taskInfo);
  });
  tasks = taskArray;
  return tasks;
}

