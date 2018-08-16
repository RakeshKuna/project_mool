import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Moolyaselect from '../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
export default class MlAdminSearch extends Component {
  constructor(props){
    super(props);
    this.state={selectedValue:null};
    return this;
  }

  optionsBySelect(selectOptions,callBackHandler){
    alert(selectOptions);
    //  var items=[{value:"1",label:"moolya"},{value:"2",label:"zoylo"},{value:"3",label:"raksan"},{value:"4",label:"smart"}
    // setTimeout( callBackHandler(items),500);
    this.setState({selectedValue:selectOptions});

  }

  render(){
    refferedByOption = [
      { value: '0', label: 'friends/collegues reference' },
      { value: '1', label: 'google/searching' },
      { value: '2', label: 'newspaper' },
      { value: '3', label: 'hoarding' },
      { value: '4', label: 'event' },
      { value: '5', label: 'radio' },
      { value: '6', label: 'i over heard it' },
    ];

   /* filterBySearch =function(state, value){
      return (
        state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
    }

    onSearch=function(searchValue,callBackHandler){
     // alert(searchValue);
      var items=[{value:"1",  label:"moolya"},{value:"2",label:"zoylo"},{value:"3",label:"raksan"},{value:"4",label:"smart"}];
       items = items.filter((i) => {
        return filterBySearch(i, searchValue);
      })
      setTimeout( callBackHandler(items),500);

    }*/

    let queryOptions={options: { variables: { name:'mlAdminRole',searchQuery:null}}};
    let query=gql`query RoleQuery($name: String!,$searchQuery:String) {data:FetchRoles(name: $name,searchQuery:$searchQuery){label:roleName,value:roleValue}}`;
    return (
      <div className="form-control pull-right" >
      {/*  <input type="text" className="form-control pull-right"   />*/}
      {/*<Moolyaselect multiSelect={true} valueKey={'value'} labelKey={'label'} selectedValue={this.state.selectedValue} queryType={"graphql"} query={query} queryOptions={queryOptions} isDynamic={true} onSelect={this.optionsBySelect.bind(this)} />*/}

    </div>
    )
  }
}
