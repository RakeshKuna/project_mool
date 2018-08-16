/** ************************************************************
 * Date: 17 Aug, 2017
 * Programmer: Pankaj <pankaj.jatav@raksan.in>
 * Description : This will fetch office data from server
 * JavaScript XML file fetchOffices.jsx
 * *************************************************************** */

/**
 * Import libs and components
 */
import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function fetchOfficeActionHandler (Details) {
  const result = await appClient.query({
    query: gql`
    query{
      fetchOffice {
        _id
        officeName
        branchType
      }
    }`,
    variables: {
      Details
    },
    fetchPolicy: 'network-only'
  });
  const offices = result.data.fetchOffice;
  return offices
}


export async function getTeamUsersActionHandler(officeId) {
  const result = await appClient.query({
    query: gql`
      query ($officeId: String) {
        getTeamUsers(officeId: $officeId) {
          _id
          name
          userId
          profileId
          profileImage
        }
      }
    `,
    fetchPolicy: 'network-only',
    variables: {
      officeId:officeId
    }
  });
  const teamMembers = result.data.getTeamUsers;
  return teamMembers
}
