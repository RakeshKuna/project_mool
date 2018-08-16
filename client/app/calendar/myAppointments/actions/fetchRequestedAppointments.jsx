/**
 * Created by pankaj on 25/7/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../core/appConnection";

export async function requestedAppointmentActionHandler() {
  const result = await appClient.query({
    query: gql`
      query {
        fetchBeSpokeServices {
        _id,
        displayName        
      }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchBeSpokeServices;
  return data;
}

export async function getBeSpokeForAppointments (serviceId) {
  const result = await appClient.query({
    query: gql`
    query($serviceId:String){
        getBeSpokeForAppointments(serviceId:$serviceId){
    _id
    about
    displayName
    noOfSession
    sessionFrequency
    duration{
        hours
        minutes
    }
    attachments {
      fileUrl 
   }
    industryId
    mode
    expectedInput
    expectedOutput
    createdAt
    conversation
    beSpokeCreatorUserId
    beSpokeCreatorProfileId
    beSpokeCreatorProfileImage
    isBeSpoke
    isCurrentVersion
    clusterId
    clusterName
    chapterId
    chapterName
    subChapterId
    subChapterName
    communityId
    communityName
    transactionId
    userId
    profileId
    isApproved
    isLive
    isReview
    }
      }
    `,
    variables: {
      serviceId
    },
    fetchPolicy: 'network-only'
  });
  const taskDetails = result.data.getBeSpokeForAppointments;
  return taskDetails
}

export async function servicesForAppointmentsActionHandler() {
  const result = await appClient.query({
    query: gql`
      query {
        fetchServicesForAppointments {
        _id
        name        
      }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchServicesForAppointments;
  return data;
}


