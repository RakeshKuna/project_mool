import React, { Component } from 'react'
import { graphql,compose } from 'react-apollo';
import MlTableView from "../components/MlTableView";
import _ from 'lodash';

const DataComposerType='graphQl';
export default class  MlTableViewComposer extends Component {
  constructor(props) {
    super(props);
    this.state={
      priorityFilter:[]
    }
    this.addPriorityFilter = this.addPriorityFilter.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.priorityFilter){
      this.setState({priorityFilter:nextProps.priorityFilter});
    }
  }

  addPriorityFilter(fieldsData){
    if(fieldsData && fieldsData.length &&
      _.findIndex(fieldsData, function(o) { return o.fieldName == 'status'; })>=0){   //if user uses status filter
      return fieldsData;
    }

    if(this.state.priorityFilter){
      if(fieldsData && fieldsData.length){
        for(let i=0;i<fieldsData.length;i++){
          if(fieldsData[i].fieldName === "status"){
            fieldsData.splice(i,1);
            i--;
          }
        }
        fieldsData = [...fieldsData, ...this.state.priorityFilter];
      }else{
        fieldsData = this.state.priorityFilter;
      }
    }
    return fieldsData;
  }

  render () {
    let config=this.props;
    //note: params are mandatory,if not data will not be fetched
    let queryOptions={
      fetchPolicy: 'network-only',
      variables: {
        offset: 0,
        limit: 10,    //config.sizePerPage||
        context:null,
        fieldsData:this.addPriorityFilter(config.fieldsData)||null,
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
          fetchMore: (sizePerPage,pageNumber,searchFilter,sortData,context) => fetchMore({
            variables: {
              offset:sizePerPage*(pageNumber-1)||0,
              limit:sizePerPage||10,
              fieldsData:this.addPriorityFilter(searchFilter)||null,
              sortData:sortData||null,
              context:context||null
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
      })(MlTableView);
      return (<Composer {...config}/>);
    }
    return null;

  }
}

