import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import gql from "graphql-tag";
//import Moolyaselect from "../../../admin/commons/components/MlAdminSelectWrapper";
var Select = require('react-select');
import ScrollArea from "react-scrollbar";
import {initalizeFloatLabel} from '../../../../../../../utils/formElemUtil';

export default class MlProfitRevenue extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyRevenue: [],
      selectedVal:null,
      selectedObject:"default",
      revenuList : []
    }
    this.fetchDetails.bind(this);
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
      if(clients[index]) {
        clients[index] = _.extend(clients[index], data);
      }
      let arr = [];
      clients = _.map(clients, function (row) {
        return _.omit(row, ['__typename'])
      });
      this.setState({startupCompanyRevenue:clients})
      this.props.getStartupProfitRevenue(clients);
    }

  }

  onSaveAction(index,e){
    let data = this.state.data;
    data["prlFromMonth"] =  this.refs["prlFromMonth"+index].state.inputValue;
    data["prlFromYear"] =  this.refs["prlFromYear"+index].state.inputValue;
    data["prlToMonth"] =  this.refs["prlToMonth"+index].state.inputValue;
    data["prlToYear"] =  this.refs["prlToYear"+index].state.inputValue;
    data["prlValue"] =  this.refs["prlValue"+index].value;
    data["prlabout"] =  this.refs["prlabout"+index].value;
    data["pelValueType"] = this.state.selectedValType;
    data["prlValue"] =  this.refs["prlValue"+index].value;
    data["index"] =  this.state.startupCompanyRevenue&&this.state.startupCompanyRevenue.length?this.state.startupCompanyRevenue.length:0
    let clients = this.state.startupCompanyRevenue;
    clients[index] = data
    this.setState({startupCompanyRevenue:clients})
    this.props.getStartupProfitRevenue(clients);
    this.setState({revenuList:this.state.startupCompanyRevenue})
    this.refs["prlFromMonth"+index].state.inputValue = ""
    this.refs["prlFromYear"+index].state.inputValue = ""
    this.refs["prlToMonth"+index].state.inputValue = ""
    this.refs["prlToYear"+index].state.inputValue = ""
    this.refs["prlValue"+index].value = ""
    this.refs["prlabout"+index].value = ""
    this.setState({"selectedValType" : ""})
    this.refs["prlValue"+index].value = ""
    this.setState({data : {}})

  }


  componentWillMount(){
    this.fetchDetails()
    /* let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.profitRevenueLiabilityChart)
     if(!empty){
       this.setState({loading: false, startupCompanyRevenue: this.context.startupPortfolio.profitRevenueLiabilityChart, revenuList:this.context.startupPortfolio.profitRevenueLiabilityChart});
     }*/
  }

  componentDidUpdate(){
    initalizeFloatLabel();
  }
  fetchDetails(){
    let that = this;
    //let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.companyPortfolio && that.context.companyPortfolio.profitRevenueLiabilityChart)
    if(empty){
      this.setState({loading: false, startupCompanyRevenue: that.props.revenueDetails, revenuList: that.props.revenueDetails});
    }else{
      this.setState({loading: false, startupCompanyRevenue: that.context.companyPortfolio.profitRevenueLiabilityChart, revenuList:that.context.companyPortfolio.profitRevenueLiabilityChart});
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
    let revenueArray = this.state.revenuList;
    this.setState({data:details}, function () {
      if(revenueArray && index==revenueArray.length){
        this.setState({"selectedVal" :  val.value})
      }else{
        revenueArray[index].prlEntityType=val.value;
        this.setState({"revenuList" :  revenueArray})
      }
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
    let selectedEntityTypesActive='';
    if(this.state.selectedVal){
      selectedEntityTypesActive='active';
    }
    let valueTypes = [
      {value: 'Percentage', label: 'Percentage'},
      {value: 'Amount', label: 'Amount'}
    ];
    let selectedvalueTypesActive='';
    if(this.state.selectedValType){
      selectedvalueTypesActive='active';
    }
    return(<div>
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >
          <div className="panel panel-default">
            <div className="panel-heading">Profit, Revenue & Liability{
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
                        <span className={`placeHolder ${selectedEntityTypesActive}`}>Select Entity Type</span>
                        <Select name="form-field-name" placeholder="Select Value Type" options={entityTypes}
                                value={this.state.selectedVal}
                                onChange={this.optionsBySelectTypeOfEntity.bind(this,defaultIndex)}  className="float-label"/>
                      </div>
                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select From Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"prlFromYear"+defaultIndex} onChange={this.handleFromYearChange.bind(this,defaultIndex)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select From Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"prlFromMonth"+defaultIndex} onChange={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                        </div>

                      </div>

                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select To Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"prlToYear"+defaultIndex} onChange={this.handleToYearChange.bind(this,defaultIndex)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select To Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"prlToMonth"+defaultIndex} onChange={this.handleToMonthChange.bind(this,defaultIndex)}/>
                        </div>
                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <span className={`placeHolder ${selectedvalueTypesActive}`}>Select Value Type</span>
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
                                      inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.prlFromYear}
                                      closeOnSelect={true} ref={"eofFromYear"+idx} onChange={that.handleFromYearChange.bind(that, idx)}/>
                          </div>
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                      inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.prlFromMonth}
                                      closeOnSelect={true} ref={"eofFromMonth"+idx} onChange={that.handleFromMonthChange.bind(that, idx)}/>
                          </div>

                        </div>


                        <div className="form-group col-lg-6">
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                      inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.prlToYear}
                                      closeOnSelect={true} ref={"prlToYear"+idx} onChange={that.handleToYearChange.bind(that, idx)}/>
                          </div>
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                      inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.prlToMonth}
                                      closeOnSelect={true} ref={"prlToMonth"+idx} onChange={that.handleToMonthChange.bind(that, idx)}/>
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
  companyPortfolio: PropTypes.object,
};

