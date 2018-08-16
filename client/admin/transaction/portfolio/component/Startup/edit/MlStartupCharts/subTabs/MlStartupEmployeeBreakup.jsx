import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import gql from "graphql-tag";
import Moolyaselect from "../../../../../../../commons/components/MlAdminSelectWrapper";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";
import {initalizeFloatLabel} from '../../../../../../../utils/formElemUtil';

export default class MlStartupEmployeeBreakup extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyData:this.props.dataDetails || [],
      selectedVal:null,
      selectedObject:"default",
      dataList : this.props.dataDetails || []
    }
    this.fetchDetails.bind(this);
  }


  handleFromYearChange(index,e){
    let details =this.state.data;
    let name  = 'ebdFromYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["ebdFromYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }


  handleFromMonthChange(index,e){
    let details =this.state.data;
    let name  = 'ebdFromMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["ebdFromMonth"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToYearChange(index,e){
    let details =this.state.data;
    let name  = 'ebdToYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["ebdToYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToMonthChange(index,e){
    let details =this.state.data;
    let name  = 'ebdToMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["ebdToMonth"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  employeementHandleBlur(index,e){
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

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }


  componentWillMount(){
    this.fetchDetails()
    /*let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.employeeBreakupDepartmentChart)
    if(!empty){
      this.setState({loading: false, startupCompanyData: this.context.startupPortfolio.employeeBreakupDepartmentChart, dataList:this.context.startupPortfolio.employeeBreakupDepartmentChart});
    }*/
  }

  componentDidUpdate(){
    initalizeFloatLabel();
  }

  fetchDetails(){
    let that = this;
    //let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.startupPortfolio && that.context.startupPortfolio.employeeBreakupDepartmentChart)
    if(empty){
      this.setState({loading: false, startupCompanyData: that.props.dataDetails, dataList: that.props.dataDetails});
    }else{
      this.setState({loading: false, startupCompanyData: that.context.startupPortfolio.employeeBreakupDepartmentChart, dataList:that.context.startupPortfolio.employeeBreakupDepartmentChart});
    }
  }

  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyData:this.state.startupCompanyData})
      this.props.getStartupProfitRevenue(this.state.startupCompanyData);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyData;
      if(clients[index]) {

        clients[index] = _.extend(clients[index], data);
      }
      let arr = [];
      clients = _.map(clients, function (row) {
        return _.omit(row, ['__typename'])
      });
      this.setState({startupCompanyData:clients})
      this.props.getStartupEmployeeBreakup(clients);
    }

  }

  onSaveAction(index,e){
    let data = this.state.data
    data["ebdFromMonth"] =  this.refs["ebdFromMonth"+index].state.inputValue ;
    data["ebdFromYear"] =  this.refs["ebdFromYear"+index].state.inputValue;
    data["ebdToMonth"] =  this.refs["ebdToMonth"+index].state.inputValue;
    data["ebdToYear"] =   this.refs["ebdToYear"+index].state.inputValue;
    data["ebdNumberOfEmployment"] =  this.refs["ebdNumberOfEmployment"+index].value;
    data["ebdAbout"] = this.refs["ebdAbout"+index].value;
    data["index"] =  this.state.startupCompanyData&&this.state.startupCompanyData.length?this.state.startupCompanyData.length:0
    let clients = this.state.startupCompanyData;
    clients[index] = data
    this.setState({startupCompanyData:clients})
    this.props.getStartupEmployeeBreakup(clients);
    this.setState({dataList:this.state.startupCompanyData})
    this.refs["ebdFromMonth"+index].state.inputValue = ""
    this.refs["ebdFromYear"+index].state.inputValue = ""
    this.refs["ebdToMonth"+index].state.inputValue = ""
    this.refs["ebdToYear"+index].state.inputValue = ""
    this.refs["ebdNumberOfEmployment"+index].value = ""
    this.refs["ebdAbout"+index].value = ""
    this.setState({"selectedVal" : ""})
    this.setState({data : {}})

    /* this.refs["prlFromYear"+index].val(" ")
     this.refs["prlFromMonth"+index].val(" ")
     this.refs["prlToYear"+index].val(" ")
     this.refs["prlToMonth"+index].val(" ")*/

  }

  /*onRemoveAction(index,e){
   let updatedData = this.state.startupCompanyData || [];
   updatedData.splice(updatedData.indexOf(index), 1);
   this.setState({dataList: updatedData}, function () {
   this.sendDataToParent()
   });
   }*/
  optionsBySelectTypeOfDepartment(index,selectedId, callback, selObject){
    let details =this.state.data;
    details=_.omit(details,["ebdDepartment"]);
    details=_.extend(details,{["ebdDepartment"]: selectedId});
    this.setState({data:details}, function () {
      this.setState({"selectedVal" : selectedId})
      this.sendDataToParent(index)
    })

  }



  render(){
    let that = this;
    let revenueArray = this.state.dataList&&this.state.dataList.length>0?this.state.dataList:[]
    let defaultIndex = revenueArray&&revenueArray.length>0?revenueArray.length:0
    let departmentQuery=gql`query{ data:fetchDepartments{value:_id,label:departmentName}}`;

    return(<div>
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >
        <div className="panel panel-default">
          <div className="panel-heading">Employee Breakup At Department{
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
                        <Moolyaselect multiSelect={false} placeholder="Select Department"
                     className="form-control float-label" valueKey={'value'} labelKey={'label'}
                     selectedValue={this.state.selectedVal} queryType={"graphql"}
                     query={departmentQuery} onSelect={this.optionsBySelectTypeOfDepartment.bind(this,defaultIndex)}
                     isDynamic={true}/>

                  </div>
                  <div className="form-group col-lg-6">
                    <div className="form-group col-md-6 col-sm-6 nopadding-left">
                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select From Year", className:"float-label form-control",readOnly:true}}
                                closeOnSelect={true} ref={"ebdFromYear"+defaultIndex} onChange={this.handleFromYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 nopadding-right">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select From Month", className:"float-label form-control",readOnly:true}}
                                closeOnSelect={true} ref={"ebdFromMonth"+defaultIndex} onChange={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                    </div>

                  </div>

                  <div className="form-group col-lg-6">
                    <div className="form-group col-md-6 col-sm-6 nopadding-left">
                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select To Year", className:"float-label form-control",readOnly:true,readOnly:true}}
                                closeOnSelect={true} ref={"ebdToYear"+defaultIndex} onChange={this.handleToYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 nopadding-right">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select To Month", className:"float-label form-control"}}
                                closeOnSelect={true} ref={"ebdToMonth"+defaultIndex} onChange={this.handleToMonthChange.bind(this,defaultIndex)}/>
                    </div>
                  </div>

                  <div className="form-group col-lg-6 col-md-6 col-sm-6">
                    <input type="text" placeholder="Number of Employment" ref={"ebdNumberOfEmployment"+defaultIndex} className="form-control float-label"
                           id="" name="ebdNumberOfEmployment" onBlur={this.employeementHandleBlur.bind(this,defaultIndex)}/>
                  </div>

                  <div className="form-group col-lg-6 col-md-6 col-sm-6">
                  <textarea rows="1" placeholder="About" ref={"ebdAbout"+defaultIndex} className="form-control float-label"
                            id="" name="ebdAbout" onBlur={this.aboutHandleBlur.bind(this,defaultIndex)}></textarea>
                  </div>
                </div>
              </div>
            </div>
            {that.state.dataList.map(function (details, idx) {


              return(<div className="form_inner_block">

                {/*<div className="add_form_block" onClick={that.onRemoveAction.bind(that,idx)}><img src="/images/remove.png"/></div>*/}
                <div className="col-lg-12 col-md-12 col-sm-10">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <Moolyaselect multiSelect={false} placeholder="Select Department"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={details.ebdDepartment} queryType={"graphql"}
                                    query={departmentQuery} onSelect={that.optionsBySelectTypeOfDepartment.bind(that,idx)}
                                    isDynamic={true}/>

                    </div>
                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years" defaultValue={details.ebdFromYear}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}

                                  closeOnSelect={true} ref={"ebdFromYear"+idx} onChange={that.handleFromYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months" defaultValue={details.ebdFromMonth}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}

                                  closeOnSelect={true} ref={"ebdFromMonth"+idx} onChange={that.handleFromMonthChange.bind(that, idx)}/>
                      </div>

                    </div>


                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years" defaultValue={details.ebdToYear}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}

                                  closeOnSelect={true} ref={"ebdToYear"+idx} onChange={that.handleToYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months" defaultValue={details.ebdToMonth}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}

                                  closeOnSelect={true} ref={"ebdToMonth"+idx} onChange={that.handleToMonthChange.bind(that, idx)}/>
                      </div>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Number of Employment" ref={"ebdNumberOfEmployment"+idx}
                             className="form-control float-label" id="" defaultValue={details.ebdNumberOfEmployment} name="ebdNumberOfEmployment" onBlur={that.employeementHandleBlur.bind(that,idx)}/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                    <textarea rows="1" placeholder="About" ref={"ebdAbout"+idx} className="form-control float-label"
                              id="" name="ebdAbout"   defaultValue={details.ebdAbout} onBlur={that.aboutHandleBlur.bind(that,idx)}></textarea>
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

MlStartupEmployeeBreakup.contextTypes = {
  startupPortfolio: PropTypes.object,
};
