import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';


export async function fetchAllProfileAppointmentCountsHandler (month, year) {
  const result = await appClient.query({
    query: gql`
    query($month:Int, $year: Int){ 
      fetchAllProfileAppointmentCounts(month:$month, year: $year) {
        events{
          date
          userId
          profileId
          count
        }
        days{
          isActive
          start
          end
          type
        }
      }
    }
    `,
    fetchPolicy: 'network-only',
    variables:{
      month:month,
      year: year
    },
  });
  const appointmentCounts = result.data.fetchAllProfileAppointmentCounts;
  return appointmentCounts;
}


export async function fetchProfileAppointmentCountsHandler (profileId, month, year) {
  const result = await appClient.query({
    query: gql`
    query($profileId: String, $month:Int, $year: Int){ 
      fetchProfileAppointmentCounts(profileId: $profileId, month:$month, year: $year){
        events{
          date
          userId
          profileId
          count
        }
        days{
          isActive
          start
          end
          type
        }
      }
    }
    `,
    variables:{
      profileId: profileId,
      month:month,
      year: year
    },
    fetchPolicy: 'network-only'
  });
  const profileAppointmentCounts = result.data.fetchProfileAppointmentCounts;
  return profileAppointmentCounts;
}

export async function fetchMyAppointmentBetweenTwoDates (profileId,userId,startDay,startMonth,startYear,endDay,endMonth,endYear) {
  const result = await appClient.query({
    query: gql`
    query fetchMyAppointmentBetweenTwoDates($profileId: String,$userId : String, $startDay: Int, $startMonth: Int, $startYear: Int , $endDay: Int, $endMonth: Int, $endYear: Int){ 
      fetchMyAppointmentBetweenTwoDates(profileId: $profileId,userId: $userId,startDay:$startDay, startMonth:$startMonth,
       startYear: $startYear ,endDay:$endDay, endMonth:$endMonth,endYear: $endYear){
         title:name
         start:startDate 
         end:endDate 
      }
    }
    `,
    variables:{
      profileId: profileId,
      userId: userId,
      startDay:startDay,
      startMonth:startMonth,
      startYear:startYear,
      endDay:endDay,
      endMonth:endMonth,
      endYear:endYear,
    },
    fetchPolicy: 'network-only'
  });
  const fetchMyAppointmentBetweenTwoDates = result.data.fetchMyAppointmentBetweenTwoDates;
  return fetchMyAppointmentBetweenTwoDates;
}

export async function fetchServiceSeekerHandler (profileId, day, month) {
  const result = await appClient.query({
    query: gql`
    query($profileId: String!, $serviceId: String){ 
      fetchServiceSeekerList(profileId: $profileId, serviceId: $serviceId){
        name
        userId
        profileId
        transId
        orderId
        serviceId
      }
    }
    `,
    variables:{
      profileId,
      day,
      month
    },
    fetchPolicy: 'network-only'
  });
  const serviceSeekers = result.data.fetchServiceSeekerList;
  return serviceSeekers;
}

export async function fetchSlotDetailsHandler (appointmentId) {
  const result = await appClient.query({
    query: gql`
    query($appointmentId: [String]){ 
      fetchSlotDetails(appointmentId: $appointmentId){
         _id
          appointmentType
          appointmentId
          startDate
          endDate
          status
          attendeeDetails{
            firstName
            lastName
            profileImage
            userId
          }
          taskName
          userMobileNumber
          userEmail
          userImage
      }
    }
    `,
    variables:{
      appointmentId
    },
    fetchPolicy: 'network-only'
  });
  const slotDetails = result.data.fetchSlotDetails;
  return slotDetails;
}









