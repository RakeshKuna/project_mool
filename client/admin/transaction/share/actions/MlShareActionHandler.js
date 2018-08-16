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
import {client} from '../../../core/apolloConnection';

export async function fetchShareDetails (sharedId) {
  const result = await client.query({
    query: gql`
query ($sharedId: String) {
  fetchSharedLibraryDetails(sharedId: $sharedId) {
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
  const shareDetails = result.data.fetchSharedLibraryDetails;
  return shareDetails
}

