import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
export default class MlSelectComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedValue:'',
      options:null,
      executeQuery:true,
      searchQuery:'',

    }
    this.fetchSelectOptions.bind(this);
    this.onChangeCallBackHandler=this.onChangeCallBackHandler.bind(this);
    this.onchangeOption=this.onchangeOption.bind(this);
    this.onInputSearch=this.onInputSearch.bind(this);
    this.compareQueryOptions=this.compareQueryOptions.bind(this);
    return this;
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentDidMount(){
    this._isMounted=true;
    this.fetchSelectOptions(this.props,this.onChangeCallBackHandler);
  }
  componentWillUnmount(){
    this._isMounted=false;
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.searchTerm!==nextState.searchTerm){
      const resp=this.fetchSelectOptions(nextProps,this.onChangeCallBackHandler,nextState.searchTerm);
    }else if(!this.compareQueryOptions(this.props.queryOptions,nextProps.queryOptions)){
      const resp=this.fetchSelectOptions(nextProps,this.onChangeCallBackHandler,this.state.searchTerm);
    }
  }

  fetchSelectOptions(props,queryCallbackHandler,searchTerm){
    let queryOptions=props.queryOptions&&props.queryOptions.options&&props.queryOptions.options.variables?props.queryOptions:{options:{variables:{}}};
    if(searchTerm&&searchTerm.trim()!==""){
      queryOptions.options.variables.searchQuery=searchTerm.trim();
    }
    if(props.queryOptions&&props.queryOptions.options&&props.queryOptions.options.variables){
    //  queryOptions.options.forceFetch=true;
    }
    //Dynamic query to retrieve data is configured through props
   /* const selectionOptionsPromise =  client.query({query: props.query,fetchPolicy: 'network-only',variables:queryOptions.options.variables});
      selectionOptionsPromise.then(data =>{if(queryCallbackHandler){ queryCallbackHandler(data.data.data); }})*/

   this.props.retrieveSelectOptions({queryOptions:queryOptions.options.variables},queryCallbackHandler);

  };

  onChangeCallBackHandler(items)
  {
    if(this._isMounted) {
      if (items && _.isArray(items)) {
        this.setState({options: items, executeQuery: false});
      } else {
        this.setState({options: [], executeQuery: false});
      }

      if(this.props.getUpdatedCallback){
          /*Specific To Communities for Platform Admin*/
          let updatedValues = [];
          let self = this
          _.each(items, function (item) {
                let isAvailiable = _.indexOf(self.props.selectedValue, item.value)
                if(isAvailiable >= 0)
                  updatedValues.push(self.props.selectedValue[isAvailiable])
          })
          this.props.getUpdatedCallback(updatedValues);
      }
    }
  };

  onchangeOption(val){
    if(this.props.multiSelect){
      let refSelected=[]
      for(let i=0;i<val.length;i++){
        refSelected.push(val[i].value)
        if(val[i].value === 'all')refSelected = ['all'];
      }
      refSelected.map(function(data){if(data === 'all'){refSelected.length = 1;refSelected = [data];}})
      this.props.onSelect(refSelected,this.onChangeCallBackHandler, val);
      // this.setState({ selectedValue: refSelected });
    }
    else{
      if(val!= null){
        let selectValue=val.value
        this.props.onSelect(selectValue,this.onChangeCallBackHandler, val);
      }
      else{
        this.props.onSelect('',this.onChangeCallBackHandler);
      }
      // this.setState({ selectedValue: selectValue});
    }
  }

  onInputSearch(value){
    this.setState({"searchTerm": value,executeQuery:true});
  }

  render(){

// You can also use `graphql` for GraphQL mutations
    const options=this.state.options?this.state.options:[];
    const placeholder=this.props.placeholder||"Select...";
    const labelKey=this.props.labelKey||'label';
    const valueKey=this.props.valueKey||'value';
    const mandatoryClass=this.props.mandatory?"mandatory":"";

    let activeClass='';
    let selectedValue=this.props.selectedValue
    if(this.props.multiSelect){
      if(selectedValue&&selectedValue.length>0){
        activeClass="active"
      }
    }else{
      if(selectedValue){
        activeClass="active"
      }
    }

    return(
      <div className={`form-group ${mandatoryClass}`}>
        <span className={`placeHolder ${activeClass}`}>{placeholder}</span>
        {<Select  multi={this.props.multiSelect} matchProp={labelKey} disabled={this.props.disabled} placeholder={placeholder} labelKey={labelKey} valueKey={valueKey} options={options} value={this.props.selectedValue}  onInputChange={this.onInputSearch} onChange={this.onchangeOption}/>}
      </div>
    )
  }
}
