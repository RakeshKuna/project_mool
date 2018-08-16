/**
 * Created by vishwadeep on 6/7/17.
 */
/**
 * import of all the routes and libs
 * */
import {MlViewer, MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlUsersCluster from "../components/MlUsersCluster";
import React from "react";
import gql from "graphql-tag";
import MlCustomFilter from '../../../commons/customFilters/customFilter';
import {client} from '../../core/apolloConnection';

/**
 * export of config file
 * */
const mlUsersClusterListConfig = new MlViewer.View({
  name: "usersList",
  viewType: MlViewerTypes.LIST,
  extraFields: [],
  fields: ["registrationInfo.firstName","registrationInfo.lastName", "registrationInfo.chapterName", "registrationInfo.userName"],
  searchFields:["registrationInfo.firstName","registrationInfo.lastName", "registrationInfo.chapterName", "registrationInfo.userName"],
  throttleRefresh: true,
  pagination: true,
  sort: true,
  showActionComponent: false,
  actionConfiguration: [
    {
      showAction: true,
      actionName: 'logout',
      handler: (data)=> {
        console.log(data);
      }
    }
  ],
  filter:true,
  filterComponent: <MlCustomFilter module="users" moduleName="users" client={client}/>,
  viewComponent: <MlUsersCluster />,
  graphQlQuery: gql`
              query ContextSpecSearch($offset: Int, $limit: Int, $searchSpec: SearchSpec, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
                data: ContextSpecSearch(module: "users", offset: $offset, limit: $limit, searchSpec: $searchSpec, fieldsData: $fieldsData, sortData: $sortData) {
                  totalRecords
                  data {
                    ...on RegistrationInfo{
                        firstName
                        lastName
                        registrationId 
                        clusterName 
                        chapterName
                        registrationType  
                        subChapterName
                        accountType
                        userName : _id
                       }
                    }
                  }
                }
              `
});


export {mlUsersClusterListConfig};
