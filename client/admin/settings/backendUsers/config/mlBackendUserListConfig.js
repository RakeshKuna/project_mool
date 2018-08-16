import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import MlBackendUserListView from '../component/MlBackendUserListView'

import React from 'react';
import gql from 'graphql-tag'
export const mlBackendUserListConfig=new MlViewer.View({
  name:"backendUserList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["username",'profile.InternalUprofile.moolyaProfile.firstName'],
  searchFields:["username", 'profile.InternalUprofile.moolyaProfile.firstName'],
  throttleRefresh:true,
  pagination:true,
  moduleName:"BackendUsers",
  sort:true,
  viewComponent:<MlBackendUserListView />,
  showActionComponent:true,
  actionConfiguration:[
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addBackendUser")
      }
    }
  ],
  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int,$fieldsData:[GenericFilter], $sortData:[SortFilter]) {
              data:SearchQuery(module:"Users",offset: $offset, limit: $limit,fieldsData:$fieldsData, sortData:$sortData){
                    totalRecords
                    data{
                     ...on BackendUsers{
                            roleNames,
                            username,
                            _id,
                            profile {
                                      isInternaluser
                                      isExternaluser
                                      isMoolya
                                      email,
                                      isActive,
                                      profileImage
                                      firstName
                                      genderType
                                      lastName
                                      InternalUprofile{
                                          moolyaProfile{
                                            firstName,
                                            lastName,
                                            displayName,
                                            userProfiles {
                                              isDefault
                                              userRoles{
                                                roleId
                                                hierarchyLevel
                                              }
                                          
                                        }
                                          
                                          
                                          }
                                       }
                                 }
                             }
                      }
              }
              }
              `
});
