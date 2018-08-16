import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import gql from "graphql-tag";
//import Moolyaselect from "../../../admin/commons/components/MlAdminSelectWrapper";
var Select = require('react-select');
import ScrollArea from "react-scrollbar";

export default class MlProfitRevenue extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyRevenue:this.props.revenueDetails || [],
      selectedIndex:0,
      selectedVal:null,
      selectedObject:"default",
      revenuList : this.props.revenueDetails || []
    }
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }


  handleFromYearChange(index,e){
    let details =this.state.data;
    let name  = 'prlFromYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["prlFromYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }


  handleFromMonthChange(index,e){
    let details =this.state.data;
    let name  = 'prlFromMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["prlFromMonth"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToYearChange(index,e){
    let details =this.state.data;
    let name  = 'prlToYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["prlToYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToMonthChange(index,e){
    let details =this.state.data;
    let name  = 'prlToMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["prlToMonth"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  valueHandleBlur(index,e){
    let details =this.state.data;
    let name  = e.target.name;
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:e.target.value});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }
  aboutHandleBlur(index,e){
    let details =this.state.data;
    let name  = e.target.name;
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:e.target.value});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyRevenue:this.state.startupCompanyRevenue})
      this.props.getStartupProfitRevenue(this.state.startupCompanyRevenue);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyRevenue;
      let startupCompanyRevenue = _.cloneDeep(clients);
      data.index = index;
      startupCompanyRevenue[index] = data;
      let arr = [];
      _.each(startupCompanyRevenue, function (item)
      {
        for (var propName in item) {
          if (item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        let newItem = _.omit(item, "__typename");
        arr.push(newItem)
      })
      startupCompanyRevenue = arr;
      this.setState({startupCompanyRevenue:startupCompanyRevenue})
      this.props.getStartupProfitRevenue(startupCompanyRevenue);
    }

  }

  onSaveAction(index,e){
    this.setState({revenuList:this.state.startupCompanyRevenue})
    if(this.state.startupCompanyRevenue){
      this.setState({selectedIndex:this.state.startupCompanyRevenue.length})
    }else{
      this.setState({selectedIndex:0})
    }
    this.refs["prlFromMonth"+index].state.inputValue = ""
    this.refs["prlFromYear"+index].state.inputValue = ""
    this.refs["prlToMonth"+index].state.inputValue = ""
    this.refs["prlToYear"+index].state.inputValue = ""
    this.refs["prlValue"+index].value = ""
    this.refs["prlabout"+index].value = ""
    this.refs["pelValueType"+index].value = ""
    this.refs["prlValue"+index].value = ""

  }
  onUpdateAction(){
    if(this.state.startupCompanyRevenue){
      this.setState({selectedIndex:this.state.startupCompanyRevenue.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  componentWillMount(){
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.profitRevenueLiabilityChart)
    if(!empty){
      this.setState({loading: false, startupCompanyRevenue: this.context.startupPortfolio.profitRevenueLiabilityChart, revenuList:this.context.startupPortfolio.profitRevenueLiabilityChart});
    }
  }

  /*onRemoveAction(index,e){
    let updatedData = this.state.startupCompanyRevenue || [];
    updatedData.splice(updatedData.indexOf(index), 1);
    this.setState({revenuList: updatedData}, function () {
      this.sendDataToParent()
    });
  }*/
  optionsBySelectTypeOfEntity(index,val){
    let details =this.state.data;
    details=_.omit(details,["prlEntityType"]);
    details=_.extend(details,{["prlEntityType"]: val.value});
    this.setState({data:details}, function () {
      this.setState({"selectedVal" :  val.value})
      this.sendDataToParent(index)
    })
  }
  optionsBySelectTypeOfValue(index,val){
    let details =this.state.data;
    details=_.omit(details,["pelValueType"]);
    details=_.extend(details,{["pelValueType"]: val.value});
    this.setState({data:details}, function () {
      this.setState({"selectedValType" :  val.value})
      this.sendDataToParent(index)
    })
  }


  render(){
    let that = this;
    let revenueArray = this.state.revenuList&&this.state.revenuList.length>0?this.state.revenuList:[]
    let defaultIndex = revenueArray&&revenueArray.length>0?revenueArray.length:0
   /* let entitiesquery = gql`query{
    data:fetchEntities {label:entityName,value:_id  }
    }
    `;*/
    let entityTypes = [
      {value: 'Profit', label: 'Profit'},
      {value: 'Revenue', label: 'Revenue'},
      {value: 'Liability', label: 'Liability'},
    ];
    let valueTypes = [
      {value: 'Percentage', label: 'Percentage'},
      {value: 'Amount', label: 'Amount'}
    ];
    return(<div>
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >
        <div className="panel panel-default">
          <div className="panel-heading">Profit Revenue{
            <div className="pull-right block_action" onClick={this.onSaveAction.bind(this,defaultIndex)}><img
              src="/images/add.png"/></div>}
          </div>
          <div className="panel-body">
            <div className="office-members-detail">

              <div className="form_inner_block">
                {/*<div className="add_form_block" onClick={this.onSaveAction.bind(this,defaultIndex)}><img src="/images/add.png"/></div>*/}

                <div className="col-lg-12 col-md-12 col-sm-10">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                  {/*    <Moolyaselect multiSelect={false} placeholder="Select Type Of Entity"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedVal} queryType={"graphql"}
                                    query={entitiesquery} onSelect={that.optionsBySelectTypeOfEntity.bind(this,defaultIndex)}
                                    isDynamic={true}/>*/}
                      <Select name="form-field-name" placeholder="Select Value Type" options={entityTypes}
                              value={this.state.selectedVal}
                              onChange={this.optionsBySelectTypeOfEntity.bind(this,defaultIndex)}  className="float-label"/>
                    </div>
                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                  inputProps={{placeholder: "Select From Year", className:"float-label form-control"}} defaultValue={this.state.data.year}
                                  closeOnSelect={true} ref={"prlFromYear"+defaultIndex} onBlur={this.handleFromYearChange.bind(this,defaultIndex)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                  inputProps={{placeholder: "Select From Month", className:"float-label form-control"}} defaultValue={this.state.data.year}
                                  closeOnSelect={true} ref={"prlFromMonth"+defaultIndex} onBlur={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                      </div>

                    </div>

                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                  inputProps={{placeholder: "Select To Year", className:"float-label form-control"}} defaultValue={this.state.data.year}
                                  closeOnSelect={true} ref={"prlToYear"+defaultIndex} onBlur={this.handleToYearChange.bind(this,defaultIndex)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                  inputProps={{placeholder: "Select To Month", className:"float-label form-control"}} defaultValue={this.state.data.year}
                                  closeOnSelect={true} ref={"prlToMonth"+defaultIndex} onBlur={this.handleToMonthChange.bind(this,defaultIndex)}/>
                      </div>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <Select name="form-field-name" placeholder="Select Value Type" options={valueTypes}
                              value={this.state.selectedValType}
                              onChange={this.optionsBySelectTypeOfValue.bind(this,defaultIndex)}  className="float-label"/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Value" ref={"prlValue"+defaultIndex} className="form-control float-label"
                             id="" name="prlValue" onBlur={this.valueHandleBlur.bind(this,defaultIndex)}/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                    <textarea rows="1" placeholder="About" ref={"prlabout"+defaultIndex} className="form-control float-label"
                              id="" name="prlabout" onBlur={this.aboutHandleBlur.bind(this,defaultIndex)}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              {that.state.revenuList.map(function (details, idx) {


                return(<div className="form_inner_block">

                  {/*<div className="add_form_block" onClick={that.onRemoveAction.bind(that,idx)}><img src="/images/remove.png"/></div>*/}
                  <div className="col-lg-12 col-md-12 col-sm-10">
                    <div className="row">
                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        {/*<Moolyaselect multiSelect={false} placeholder="Select Type Of Entity"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={details.prlEntityType} queryType={"graphql"}
                                      query={entitiesquery} onSelect={that.optionsBySelectTypeOfEntity.bind(this,idx)}
                                      isDynamic={true}/>*/}
                        <Select name="form-field-name" placeholder="Select Value Type" options={entityTypes}
                                value={details.prlEntityType}
                                onChange={that.optionsBySelectTypeOfEntity.bind(that,idx)}  className="float-label"/>
                      </div>
                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select Year", className: "float-label form-control"}}
                                    defaultValue={details.prlFromYear}
                                    closeOnSelect={true} ref={"eofFromYear"+idx} onBlur={that.handleFromYearChange.bind(that, idx)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select Year", className: "float-label form-control"}}
                                    defaultValue={details.prlFromMonth}
                                    closeOnSelect={true} ref={"eofFromMonth"+idx} onBlur={that.handleFromMonthChange.bind(that, idx)}/>
                        </div>

                      </div>


                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select Year", className: "float-label form-control"}}
                                    defaultValue={details.prlToYear}
                                    closeOnSelect={true} ref={"prlToYear"+idx} onBlur={that.handleToYearChange.bind(that, idx)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select Year", className: "float-label form-control"}}
                                    defaultValue={details.prlToMonth}
                                    closeOnSelect={true} ref={"prlToMonth"+idx} onBlur={that.handleToMonthChange.bind(that, idx)}/>
                        </div>
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <Select name="form-field-name" placeholder="Select Value Type" options={valueTypes}
                                value={details.pelValueType}
                                onChange={that.optionsBySelectTypeOfValue.bind(that,idx)}  className="float-label"/>
                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <input type="text" placeholder="Value" ref={"prlValue"+idx} className="form-control float-label"
                               id="" defaultValue={details.prlValue} name="prlValue" onBlur={that.valueHandleBlur.bind(that,idx)}/>
                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <textarea rows="1" placeholder="About" ref={"prlabout"+idx} className="form-control float-label"
                              id="" name="prlabout" defaultValue={details.prlabout} onBlur={that.aboutHandleBlur.bind(that,idx)}></textarea>
                      </div>
                    </div>
                  </div>

                </div>)

              })}
            </div>
          </div>
        </div>
        </ScrollArea>
      </div>

    </div>)
  }
}


MlProfitRevenue.contextTypes = {
  //institutionPortfolio: PropTypes.object,
  startupPortfolio: PropTypes.object,
};

