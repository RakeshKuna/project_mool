import React, { Component } from 'react'
import { graphql,compose } from 'react-apollo';
import MlListView from "../components/MlListView"
import _ from 'lodash';
const DataComposerType='graphQl';
export default class  MlListViewComposer extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    let config=this.props;
    //note: params are mandatory,if not data will not be fetched
    let queryOptions={
      fetchPolicy: 'network-only',
      variables: {
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
      })(MlListView);
      return (<Composer {...config}/>);
    }
    return null;

  }
}

