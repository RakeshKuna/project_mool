import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppRequestedMyAppointment from "../components/MlAppRequestedMyAppointment";
import React from "react";
import gql from "graphql-tag";

export const mlAppMyRequestedBespokeServiceConfig = new MlAppViewer({
  name: "My Appointment List",
  moduleName: "myRequestedBespokeService",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppRequestedMyAppointment/>,
  header: true,
  headerComponents:{
    filter: true,
    search: true,
    searchFields: ["displayName"]
  },
  graphQlQuery: gql`query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                  data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                    count
                      data{
                        ...on Service {
                          _id
                          displayName
                          isBeSpoke
                          mode
                          beSpokeCreatorProfileImage
                          noOfSession
                          duration {
                            hours
                            minutes
                          }
                        }
                      }
                  }
                }
            `,

});
