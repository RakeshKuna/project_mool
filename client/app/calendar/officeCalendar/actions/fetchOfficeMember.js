/**
 * Created by pankaj on 20/8/17.
 */

import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';

export async function fetchOfficeMemberActionHandler () {
  const result = await appClient.query({
    query: gql`
    query { 
      fetchAllOfficeMembersWithUserId {
        _id
        name
        profileId
        userId
        profileImage
      }
    }
    `,
    fetchPolicy: 'network-only'
  });
  const officeMember = result.data.fetchAllOfficeMembersWithUserId;
  return officeMember;
}
