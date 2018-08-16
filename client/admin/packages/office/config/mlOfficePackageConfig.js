/**
 * Created by venkatsrinag on 28/7/17.
 */
import React from 'react';
import gql from 'graphql-tag'
import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import MlOfficePackageListView from '../component/MlOfficePackageListView'


export const mlOfficePackageListConfig=new MlViewer.View({
  name:"Office Cards",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["officeName"],
  searchFields:[],
  throttleRefresh:true,
  pagination:true,
  moduleName:"Packages",
  sort:true,
  viewComponent:<MlOfficePackageListView />,
  showActionComponent:true,
  actionConfiguration:[
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/packages/addOffice")
      }
    }
  ],
  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int,$fieldsData:[GenericFilter], $sortData:[SortFilter]) {
                  data:SearchQuery(module:"OFFICEPACKAGE",offset: $offset, limit: $limit,fieldsData:$fieldsData, sortData:$sortData){
                      totalRecords,
                      data{
                          ...on OfficePackage{
                              _id,
                              serviceCardName
                          }
                      }
                  }
              }
              `
})
