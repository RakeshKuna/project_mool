import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import AlphaSearch from "../../../commons/components/alphaSearch/AlphaSearchWithAll";
import MlActionComponent from "../../../commons/components/actions/ActionComponent";
import Pagination from "../../../commons/components/pagination/Pagination";
import _ from "lodash";
import ScrollArea from 'react-scrollbar'
export default class MlListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 50,
      pageNumber: 1,
      sort: null,
      alphaValue:null,
      pubSelector: null,
      filterValue:[],
    }
    this.onPageChange.bind(this);
    this.onSizePerPageList.bind(this);
    this.onAlphaSearchChange.bind(this);
    this.onKeyUp.bind(this);
    this.constructSearchCriteria.bind(this);
    this.actionHandlerProxy=this.actionHandlerProxy.bind(this);
  }
  componentDidUpdate(){
    var WinHeight = $(window).height();
    $('.list_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }


  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.sizePerPage !== nextState.sizePerPage) || (this.state.pageNumber !== nextState.pageNumber)) {

      let hasQueryOptions = this.props.queryOptions ? true : false;
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        limit: nextState.sizePerPage || 20  //5
      }
      if (hasQueryOptions) {
        let dynamicQueryOptions = this.props.buildQueryOptions ? this.props.buildQueryOptions(this.props) : {};
        // let extendedVariables = _.extend(dynamicQueryOptions);
        let extendedVariables = _.merge(dynamicQueryOptions, variables);
        this.props.fetchMore(extendedVariables);
      }
      if(this.state.searchValue!==nextState.searchValue){
        let searchCriteria=this.constructSearchCriteria(nextState.searchValue);
        variables.fieldsData=searchCriteria||null
        this.props.fetchMore(variables);
      }
      this.props.fetchMore(variables);
    }
    else if(this.state.searchValue!==nextState.searchValue){
      let searchCriteria=this.constructSearchCriteria(nextState.searchValue);
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        fieldsData :searchCriteria||null
      }
      this.props.fetchMore(variables);
    }else if(!this.compareQueryOptions(this.state.alphaValue,nextState.alphaValue)){
      let searchCriteria=this.constructAlphaCriteria(nextState.alphaValue);
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        fieldsData :searchCriteria||null
      }
      this.props.fetchMore(variables);
    }else if(!this.compareQueryOptions(this.state.filterValue,nextState.filterValue)){
      //let filterCriteria=this.constructFilterCriteria(nextState.filterValue);
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        fieldsData:nextState.filterValue || null
      }
      this.props.fetchMore(variables);
    }
  }

  constructSearchCriteria(search){
    let fieldsAry = null;
    if (search && search.trim() !== "") {
      fieldsAry=[];
      _.find(this.props.options.searchFields, function (num) {
        fieldsAry.push({fieldName: num, value: search.trim()})
      });
    }

    if(this.props.filter){
      fieldsAry=this.state.filterValue||[];
    }

    return fieldsAry;
  }

  /*constructFilterCriteria(data){
    let fieldsAry = null;
    if(this.props.filter){
      fieldsAry=data||[];
    }
    return fieldsAry;
  }*/

  constructAlphaCriteria(alpha){
    let fieldsAry = null;
    if (alpha && alpha.trim() !== "") {
      fieldsAry=[];
      _.find(this.props.options.searchFields, function (num) {
        fieldsAry.push({fieldName: num, value: alpha.trim(),operator:'Starts_With'});
      });
    }
    return fieldsAry;
  }

  onKeyUp(e){
    this.setState({searchValue:e.target.value});
  }

  onPageChange(page,sizePerPage) {
    console.log("parent page")
    console.log(page)
    this.setState({
      pageNumber: page
    });
  }

  onAlphaSearchChange(alpha){
    //alert("selected alphabet is "+alpha);
    //this.setState({searchValue: alpha});
    this.setState({alphaValue:alpha});
  }

  onSizePerPageList(sizePerPage) {
    this.setState({
      sizePerPage: sizePerPage
    });
    this.props.fetchMore();
  }

  onSortChange(sortName,sortOrder){
    let sortObj=[];
    if(sortOrder==="asc"){
      sortObj.push(sortName,"asc");
    }else{
      sortObj.push(sortName,"desc");
    }
    this.setState({sort: sortObj});
  };
  actionHandlerProxy(actionConfig){
   // const selectedRow=this.state.selectedRow;
    const actions=this.props.actionConfiguration;
    const action=_.find(actions,{"actionName":actionConfig.actionName});
    action.handler();
  }
  onFilterChange(filterQuery){
    this.setState({filterValue:filterQuery});
  }


  render(){
    let data=this.props.data&&this.props.data.data?this.props.data.data:[];
    let search = typeof this.props.search == 'undefined' ? true : false ;
    let pConfig=_.extend(this.props,{sizePerPage:this.state.sizePerPage,pageNumber:this.state.pageNumber});
    let ListComponent =React.cloneElement(this.props.viewComponent,{data:data,config:pConfig});
    let totalRecords=this.props.data&&this.props.data.totalRecords;
    let loading=this.props.loading;
    let config=this.props;
    let actionsProxyList=[];
    if(config.actionConfiguration){
    let actionsConf=_.clone(config.actionConfiguration);
    let that = this;
    actionsConf.forEach(function (action) {
      let act={actionName:action.actionName,showAction:action.showAction};
        act.handler=that.actionHandlerProxy
      actionsProxyList.push(act);
    });
    }
    var FilterComponent ='';
    if(this.props.filter){
      // let pConfig=_.extend(this.props,{onFilterChange:this.onFilterChange.bind(this)});
      FilterComponent=React.cloneElement(this.props.filterComponent,{onFilterChange:this.onFilterChange.bind(this)});
    }
    return(


        <div className="admin_padding_wrap">

      { search ? <input type="text" className="form-control" id="btn-search" placeholder="Search..." onKeyUp={this.onKeyUp.bind(this)}/> : '' }
          {FilterComponent}
      {loading?(<div className="loader_wrap"></div>):(

        <div className="list_view_block">


          <AlphaSearch onAlphaSearchChange={this.onAlphaSearchChange.bind(this)} />

          <div className="col-md-12">
              {ListComponent}
          </div>
          <Pagination onPageChange={this.onPageChange.bind(this)} totalRecords={totalRecords}/>
        </div>

        )}
      {config.showActionComponent===true && <MlActionComponent ActionOptions={actionsProxyList} />}
        </div>)
  }

}
MlListView.propTypes={
}

