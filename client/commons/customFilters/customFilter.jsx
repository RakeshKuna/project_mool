import React from 'react';
import MlCustomFilterComponent from './CustomFilterComponent';
import {findModuleCustomFilterActionHandler} from './findCustomFilterAction';
export default class MlCustomFilter extends React.Component {

  constructor(props){
    super(props);
    this.state = {filterDefinition :{}}
    this.fetchFilters=this.fetchFilters.bind(this);
  }

  componentDidMount(){
    this.fetchFilters();
  }

  async fetchFilters(){
    var connection=this.props.client||{};
    const response = await findModuleCustomFilterActionHandler(this.props.moduleName,connection);
    this.setState({filterDefinition : response||{}});
  }

  render() {
    var filterType=this.props.type?this.props.type:'admin';
    if(filterType==='admin'){
      return (
        <MlCustomFilterComponent connection={this.props.client} filterDefinition={this.state.filterDefinition} {...this.props}/>
      );
    }
  }
};
