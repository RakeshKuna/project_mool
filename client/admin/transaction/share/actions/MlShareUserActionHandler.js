import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function fetchSharedCalendarDetails (sharedId) {
  const result = await client.query({
    query: gql`
query ($sharedId: String) {
  fetchSharedCalendarDetails(sharedId: $sharedId) {
     _id
     users{
      userId
      profileId
      displayName
      profilePic
     }  
      files{
        url
        fileName
        fileType
        libraryDocumentId
     }
      isActive
      sharedEndDate
      sharedStartDate
      isDownloadable
      createdAt
      ownerInfo {
        userId
        profileId
        email
        mobileNumber
        cluster
        chapter
        subChapter
        community
        name
      }
  }
}
    `,
    variables: {
      sharedId
    },
    fetchPolicy: 'network-only'
  });
  const shareDetails = result.data.fetchSharedCalendarDetails;
  return shareDetails
}

export async function deactivateSharedDetailsHandler(sharedId) {
  const result = await client.mutate({
    mutation: gql`
      mutation($sharedId:String){
        deactivateSharedCalendar(sharedId:$sharedId) {
          success
          code
          result
        }
      }
    `,
    variables: {
      sharedId
    }
  });
  const id = result.data.deactivateSharedCalendar;
  return id;
}

