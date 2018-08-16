/** ************************************************************
 * Date: 12 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll data composer
 * JavaScript file MlInfiniteScrollComposer.js
 * *************************************************************** */

/**
 * Import libs
 */
import React, { Component } from 'react'
import { graphql } from 'react-apollo';
import MlInfiniteScrollContainer from '../components/MlInfiniteScrollContainer';
import _ from 'lodash';
const DataComposerType='graphQl';
import gql from 'graphql-tag'


export default class MlInfiniteScrollComposer extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */
  render(){

    if(DataComposerType==='graphQl') {
      let config=this.props;
      config.perPageLimit = config.perPageLimit || 10;
      //note: params are mandatory,if not data will not be fetched
      let queryOptions={
        fetchPolicy: 'network-only',
        variables: {
          module:config.moduleName,
          queryProperty: {
            limit : config.perPageLimit,
            sortBy : '_id',
            skip : 0,
            query : JSON.stringify({})
          }
        }
      };
      if(config.sort) {
        options.variables.queryProperty['sortBy'] = props.defaultSortBy;
      }
      let hasQueryOptions=config.queryOptions?true:false;
      if(hasQueryOptions){
        let dynamicQueryOptions=config.buildQueryOptions?config.buildQueryOptions(config):{};

        let extendedQueryVar=_.extend(queryOptions.variables,dynamicQueryOptions);
        queryOptions["variables"]=extendedQueryVar;
      }
      const Composer = graphql(config.graphQlQuery, {
        options: props => (queryOptions),
        props: ({data: {loading, data, fetchMore}}) => ({
          loading,
          data,
          fetchMore: (variables, pagination) => fetchMore({
            variables: variables?variables:{
              module: "activity"
            },
            updateQuery: (prev, {fetchMoreResult}) => {
              
              if (!fetchMoreResult.data) {
                return prev;
              }

              let response={};

              if(pagination){
               /* response = {
                  count: fetchMoreResult.data.data.count,
                  data : pagination ? fetchMoreResult.data.data.data : prev.data.data.concat(fetchMoreResult.data.data.data)

                };*/
                response = Object.assign({},{count:fetchMoreResult.data.count,data:[...fetchMoreResult.data.data]});
              }else{
                response = Object.assign({},{count:fetchMoreResult.data.count,data:[...fetchMoreResult.data.data]});
              }


              // let response = {
              //   count: fetchMoreResult.data.count,
              //   data : pagination ? fetchMoreResult.data.data :
              //     Object.assign({},{data:[...fetchMoreResult.data.data]})
              //   // prev.data.data.concat(fetchMoreResult.data.data.data)
              //     // Object.assign({},{data:{count:fetchMoreResult.data.count,data:[...prev.data.data, ...fetchMoreResult.data.data]}})
              // };

              return {
                data: response
              }
            },
          }),
        })
      })(MlInfiniteScrollContainer);

      return <Composer {...config} />;

    } else {
      return null;
    }
  }
}
