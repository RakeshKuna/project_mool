/**
 * Created by Mukhil on 19/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function createBeSpokeServiceActionHandler (Services, portfolioId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($Services: service, $portfolioId: String){
        createBeSpokeService(Services:$Services, portfolioId: $portfolioId){
        success
        code
        result
      }
      }
    `,
    variables: {
      Services,
      portfolioId
    }
  });
  const services = result.data.createBeSpokeService;
  return services
}

export async function updateBeSpokeServiceActionHandler (Services, portfolioId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($Services: service, $portfolioId: String){
        updateBeSpokeService(Services:$Services, portfolioId: $portfolioId){
        success
        code
        result
      }
      }
    `,
    variables: {
      Services,
      portfolioId
    }
  });
  const services = result.data.updateBeSpokeService;
  return services
}


export async function createServiceActionHandler (Services) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($Services: service){
        createService(Services:$Services){
        success
        code
        result
      }
      }
    `,
    variables: {
      Services
    }
  });
  const services = result.data.createService;
  return services
}




export async function fetchServiceActionHandler (serviceId) {
  const result = await appClient.query({
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
        isBeSpoke
        status
        isApproved
        isLive
        isActive
        isReview
        serviceExpiry
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
          isApprovalRequiredFromSeeker
          currencyType
        }
        tasks {
          id
          sequence
          sessions{
            id
            sequence
            isOffline
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
    let value = _.omit(item, '__typename')
    taskArray.push(value)
  });
  service.tasks = taskArray;
  return service
}


export async function updateServiceActionHandler(serviceId,Services) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId:String, $Services:service){
        updateService(serviceId:$serviceId,Services:$Services){
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
  const teamMembers = result.data.updateService;
  return teamMembers
}

export async function cloneServiceCardActionHandler(serviceId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId:String!){
        cloneServiceCard(serviceId:$serviceId){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId
    }
  });
  const teamMembers = result.data.cloneServiceCard;
  return teamMembers
}


export async function fetchServicesActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchUserServices(profileId: $profileId) {
        displayName
        profileId
        _id
        duration {
          hours
          minutes
        }
        tasks {
          id
          sequence
          sessions {
            id
            sequence 
            isOffline
          }
        }
        finalAmount
        termsAndCondition{
          isCancelable
        }
        noOfSession
        status
        isLive
      }
    }
    `,
    fetchPolicy: 'network-only',
    variables: {
      profileId:profileId
    }
  });
  const services = result.data.fetchUserServices;
  return services;
}

export async function fetchBeSpokeServicesActionHandler (portfolioId) {
  const result = await appClient.query({
    query: gql`
    query($portfolioId:String) {
      fetchBeSpokeServices(portfolioId: $portfolioId) {
        profileId
        beSpokeCreatorProfileImage
        _id
        about
        profileId
        noOfSession
        expectedInput
        expectedOutput
        conversation
        industryId
        displayName
        mode
        isBeSpoke
        sessionFrequency
        duration {
          hours
          minutes
        }
        beSpokeAttachments{
          fileName
          fileSize
          fileUrl
        }
      }
    }
    `,
    fetchPolicy: 'network-only',
    variables: {
      portfolioId:portfolioId
    }
  });
  const response = result.data.fetchBeSpokeServices;
  // let service = _.omit(response, '__typename');
  // service.duration = _.omit(service.duration, '__typename');
  // // let attachments = [];
  // // _.each(service.attachments, (item, say) => {
  // //   let value = _.omit(item, '__typename')
  // //   attachments.push(value)
  // // });
  // // service.attachments = attachments;
  return response;
}


export async function fetchProfileActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query ($profileId: String) {
      getUserProfileForService(profileId: $profileId) {
        clusterName
        clusterId
        countryId
  }
}
    `,
    fetchPolicy: 'network-only',
    variables: {
      profileId
    }
  });
  const profile = result.data.getUserProfileForService;
  return profile;
}

export async function fetchTasksAmountActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
query ($profileId: String) {
  fetchTasksAmount(profileId: $profileId) {
    totalAmount
  }
}
    `,
    fetchPolicy: 'network-only',
    variables: {
      profileId:profileId
    }
  });
  const services = result.data.fetchTasksAmount;
  return services;
}

export async function getProfileBasedOnPortfolio (portfolioId) {
  const result = await appClient.query({
    query: gql`
query ($portfolioId: String) {
  getProfileBasedOnPortfolio(portfolioId: $portfolioId) {
    profileId
  }
}
    `,
    fetchPolicy: 'network-only',
    variables: {
      portfolioId
    }
  });
  const services = result.data.getProfileBasedOnPortfolio;
  return services;
}


export async function fetchTaskDetailsForServiceCard (profileId, serviceId, orderId) {
  console.log('orderId', orderId)
  const result = await appClient.query({
    query: gql`
      query($profileId: String, $serviceId: String, $orderId: String) {
        fetchTaskDetailsForServiceCard(profileId: $profileId, serviceId: $serviceId, orderId: $orderId) {
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
            startDate
            status
            isOffline
            isRescheduled
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
              imageLink
              payment{
                derivedAmount
              }
              duration {
                hours
                minutes
              }
              deliverable
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
      orderId
    },
    fetchPolicy: 'network-only'
  });
  var taskDetails = result.data.fetchTaskDetailsForServiceCard;
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

export async function bookUserServiceCardActionHandler(serviceId, taskDetails) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId:String!,$taskDetails: [tasks]){
        createServiceCardOrder(serviceId:$serviceId,taskDetails:$taskDetails){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId,
      taskDetails
    }
  });
  const teamMembers = result.data.createServiceCardOrder
  return teamMembers;
}

export async function userServiceCardPaymentActionHandler(userServiceCardPaymentInfo) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($userServiceCardPaymentInfo:userServiceCardPaymentInfo){
        updateServiceCardOrder(userServiceCardPaymentInfo:$userServiceCardPaymentInfo){
        success
        code
        result
      }
      }
    `,
    variables: {
      userServiceCardPaymentInfo
    }
  });
  const teamMembers = result.data.updateServiceCardOrder;
  return teamMembers;
}

export async function updateGoLiveServiceActionHandler (serviceId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId: String!){
        updateServiceGoLive(serviceId:$serviceId){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId
    }
  });
  const services = result.data.updateServiceGoLive;
  return services
}

export async function updateReviewServiceActionHandler (serviceId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId: String!){
        updateServiceSendReview(serviceId:$serviceId){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId
    }
  });
  const services = result.data.updateServiceSendReview;
  return services
}

export async function checkServiceSubChapterAccessControl(serviceId) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($serviceId:String!){
        checkServiceSubChapterAccessControl(serviceId:$serviceId){
        success
        code
        result
      }
      }
    `,
    variables: {
      serviceId:serviceId
    }
  });
  const data = result.data.checkServiceSubChapterAccessControl;
  return data;
}
