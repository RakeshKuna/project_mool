import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import ProfileTileComponent from './../components/myList/ProfileTileComponent';
import React from "react";
import gql from "graphql-tag";

export const mlAppMyFollowersConfig = new MlAppViewer({
  name: "My Followers List",
  throttleRefresh: true,
  pagination: true,
  moduleName: "myFollowers",
  sort: true,
  perPageLimit: 20,
  viewComponent: <ProfileTileComponent />,
  showActionComponent: true,
  header: true,
  headerComponents:{
    filter: false,
    search: true,
    searchFields: ["userName","firstName","lastName","displayName","profileId","countryName","communityCode", "communityName"]
  },
  /**need to bring with the repo service and passing the context of the community type from the client*/
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data:AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                   ...on FollowUser{
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
                }
              }
    `
});
