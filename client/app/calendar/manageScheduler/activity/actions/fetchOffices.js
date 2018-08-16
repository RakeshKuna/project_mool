/** ************************************************************
 * Date: 3 Jul, 2017
 * Programmer: Pankaj <pankaj.jatav@raksan.in>
 * Description : This will fetch office data from server
 * JavaScript XML file fetchOffices.jsx
 * *************************************************************** */

/**
 * Import libs and components
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function fetchOfficeActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId: String ) {
      fetchOffice( profileId: $profileId ) {
        _id
        officeName
        branchType
      }
    }`,
    variables: {
      profileId: profileId
    },
    fetchPolicy: 'network-only'
  });
  const offices = result.data.fetchOffice;
  return offices
}

export async function fetchMyConnectionActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      fetchConnectionByUser {
        userId
        profileId
        name
        profileImage
      }
    }`,
    fetchPolicy: 'network-only'
  });
  const myConnections = result.data.fetchConnectionByUser;
  return myConnections;
}

export async function getMoolyaAdminsActionHandler(userId, profileId) {
  const result = await appClient.query({
    query: gql`
      query ($userId: String, $profileId: String) {
        fetchMoolyaAdmins(userId:$userId,profileId: $profileId) {
          _id
          displayName
          userName
          profileImage
        }
      }
    `,
    fetchPolicy: 'network-only',
    variables: {
      userId: userId,
      profileId: profileId
    }
  });
  const teamMembers = result.data.fetchMoolyaAdmins;
  return teamMembers
}
