import React, { Component } from 'react'
import { graphql,compose } from 'react-apollo';
import MoolyaMapView from "../../../commons/components/map/MoolyaMapView"
import _ from 'lodash';
const DataComposerType='graphQl';
export default class MlAppMapViewComposer extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    let config=this.props;
    if(this.props && this.props.config){
      config=this.props.config;
    }
    //note: params are mandatory,if not data will not be fetched
    let queryOptions={
      fetchPolicy: 'network-only',
      variables: {
        module:config.module,
        offset: 0,
        limit: config.sizePerPage||50,   //config.sizePerPage|| 10
        context:null,
        searchSpec:null,
        fieldsData:config.fieldsData||null,
        sortData:config.sort||null
      }
    };
    if(DataComposerType==='graphQl'){
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
          fetchMore: (variables) => fetchMore({
            variables: variables?variables:{
              offset: data
            },
            updateQuery: (prev, {fetchMoreResult}) => {
              if (!fetchMoreResult.data) {
                return prev;
              }
              return {
                data: fetchMoreResult.data
              };
            },
          }),
        })
      })(MoolyaMapView);
      return (<Composer {...config}/>);
    }
    return null;

  }
}

