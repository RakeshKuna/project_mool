
import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppMyAppointmentItems from "../components/MlAppMyAppointmentItems";
import React from "react";
import gql from "graphql-tag";

export const mlAppPendingAppointmentConfig = new MlAppViewer({
  name: "My Appointment List",
  moduleName: "myPendingAppointment",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppMyAppointmentItems/>,
  header: true,
  headerComponents:{
    filter: true,
    search: true,
    searchFields: ["about.aboutTitle","chapterName","accountType","communityType","firstName","lastName"]
  },
  graphQlQuery: gql`query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                  data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                    count
                      data{
                        ...on Appointment {
                          _id
                          appointmentType
                          appointmentId
                          appointmentInfo {
                            resourceType
                            resourceId
                            serviceCardId
                            serviceName
                            taskName
                            sessionId
                            serviceOrderId
                          }
                          appointmentWith {
                            userId
                            profileId
                            displayName
                            status
                            userProfilePic
                          }
                          startDate
                          endDate
                        }
                      }
                  }
                }
            `,

});
