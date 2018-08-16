import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';
export async function fetchMyConnectionsActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      fetchConnections {
              id
              userId
              userName
              firstName
              lastName
              displayName
              profileImage
              profileId
              countryName
              communityName
              communityCode
      }
    }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchConnections?result.data.fetchConnections:[];
  return data;
}

export async function fetchMyFavouritesActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      fetchFavourites {
              id
              userId
              userName
              firstName
              lastName
              displayName
              profileImage
              profileId
              countryName
              communityName
              communityCode
      }
    }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchFavourites?result.data.fetchFavourites:[];
  return data;
}

export async function fetchMyFollowersActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      followersList {
              id
              userId
              userName
              firstName
              lastName
              displayName
              profileImage
              profileId
              countryName
              communityName
              communityCode
      }
    }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.followersList?result.data.followersList:[];
  return data;
}

export async function fetchMyFollowingsActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      followingsList {
              id
              userId
              userName
              firstName
              lastName
              displayName
              profileImage
              profileId
              countryName
              communityName
              communityCode
      }
    }
    `,
    fetchPolicy: 'network-only'
  });
  const data = result.data.followingsList?result.data.followingsList:[];
  return data;
}
