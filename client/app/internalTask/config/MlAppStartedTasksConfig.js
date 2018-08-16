import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import MlAppInternalTaskList from "../components/MlAppInternalTaskList";
import React from "react";
import gql from "graphql-tag";

export const mlMyAppStartedInternalTaskConfig = new MlAppViewer({
  name: "My Internal Task List",
  moduleName: "myStartedInternalTask",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppInternalTaskList/>,
  header: true,
  headerComponents:{
    filter: true,
    search: true,
    searchFields: ["community.name", "name", "type", "status", "attendeeName", "communityName", "clusterName", "ownerName", "portfolioTitle"]
  },
  graphQlQuery: gql`query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                  data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                    count
                      data{
                        ...on InternalTask {
                          _id
                          name
                          type
                          status
                          attendeeName
                          communityName
                          clusterName
                          ownerName
                          portfolioTitle
                          community{
                           name 
                          }
                          profileImage
                        }
                      }
                  }
                }
            `,

});
