import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import MlAppInternalMyTaskList from "../components/myTask/MlAppInternalMyTaskList";
import React from "react";
import gql from "graphql-tag";

export const mlMyAppSelfInternalTaskConfig = new MlAppViewer({
  name: "My Internal Task List",
  moduleName: "mySelfInternalTask",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppInternalMyTaskList/>,
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
