/*
import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import gql from "graphql-tag";
import Moolyaselect from "../../../admin/commons/components/MlAdminSelectWrapper";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";

export default class MlEmployeeBreakup extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyData:this.props.dataDetails || [],
      selectedIndex:0,
      selectedVal:null,
      selectedObject:"default",
      dataList : this.props.dataDetails || []
    }
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
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.employeeBreakupDepartmentChart)
    if(!empty){
      this.setState({loading: false, startupCompanyData: this.context.startupPortfolio.employeeBreakupDepartmentChart, dataList:this.context.startupPortfolio.employeeBreakupDepartmentChart});
    }
  }


  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyData:this.state.startupCompanyData})
      this.props.getStartupProfitRevenue(this.state.startupCompanyData);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyData;
      let startupCompanyData = _.cloneDeep(clients);
      data.index = index;
      startupCompanyData[index] = data;
      let arr = [];
      _.each(startupCompanyData, function (item)
      {
        for (var propName in item) {
          if (item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        let newItem = _.omit(item, "__typename");
         newItem = _.omit(item, "ebdDepartmentName");
        arr.push(newItem)
      })
      startupCompanyData = arr;
      this.setState({startupCompanyData:startupCompanyData})
      this.props.getStartupEmployeeBreakup(startupCompanyData);
    }

  }

  onSaveAction(index,e){
    this.setState({dataList:this.state.startupCompanyData})
    if(this.state.startupCompanyData){
      this.setState({selectedIndex:this.state.startupCompanyData.length})
    }else{
      this.setState({selectedIndex:0})
    }
    this.refs["ebdFromMonth"+index].state.inputValue = ""
    this.refs["ebdFromYear"+index].state.inputValue = ""
    this.refs["ebdToMonth"+index].state.inputValue = ""
    this.refs["ebdToYear"+index].state.inputValue = ""
    this.refs["ebdNumberOfEmployment"+index].value = ""
    this.refs["ebdAbout"+index].value = ""
    this.setState({"selectedVal" : ""})

    /!* this.refs["prlFromYear"+index].val(" ")
     this.refs["prlFromMonth"+index].val(" ")
     this.refs["prlToYear"+index].val(" ")
     this.refs["prlToMonth"+index].val(" ")*!/

  }

  /!*onRemoveAction(index,e){
   let updatedData = this.state.startupCompanyData || [];
   updatedData.splice(updatedData.indexOf(index), 1);
   this.setState({dataList: updatedData}, function () {
   this.sendDataToParent()
   });
   }*!/
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
          <div className="panel-heading">Employee Breakup{
            <div className="pull-right block_action" onClick={this.onSaveAction.bind(this,defaultIndex)}><img
            src="/images/add.png"/></div>}

          </div>
          <div className="panel-body">
            <div className="office-members-detail">

            <div className="form_inner_block">
              {/!*<div className="add_form_block" onClick={this.onSaveAction.bind(this,defaultIndex)}><img src="/images/add.png"/></div>*!/}

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
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select From Year", className:"float-label form-control"}}
                                closeOnSelect={true} ref={"ebdFromYear"+defaultIndex} onBlur={this.handleFromYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select From Month", className:"float-label form-control"}}
                                closeOnSelect={true} ref={"ebdFromMonth"+defaultIndex} onBlur={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                    </div>

                  </div>

                  <div className="form-group col-lg-6">
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select To Year", className:"float-label form-control"}}
                                closeOnSelect={true} ref={"ebdToYear"+defaultIndex} onBlur={this.handleToYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select To Month", className:"float-label form-control"}}
                                closeOnSelect={true} ref={"ebdToMonth"+defaultIndex} onBlur={this.handleToMonthChange.bind(this,defaultIndex)}/>
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

                {/!*<div className="add_form_block" onClick={that.onRemoveAction.bind(that,idx)}><img src="/images/remove.png"/></div>*!/}
                <div className="col-lg-12 col-md-12 col-sm-10">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <Moolyaselect multiSelect={false} placeholder="Select Type Of Entity"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={details.ebdDepartment} queryType={"graphql"}
                                    query={departmentQuery} onSelect={that.optionsBySelectTypeOfDepartment.bind(that,idx)}
                                    isDynamic={true}/>

                    </div>
                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years" defaultValue={details.ebdFromYear}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control"}}

                                  closeOnSelect={true} ref={"ebdFromYear"+idx} onBlur={that.handleFromYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months" defaultValue={details.ebdFromMonth}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control"}}

                                  closeOnSelect={true} ref={"ebdFromMonth"+idx} onBlur={that.handleFromMonthChange.bind(that, idx)}/>
                      </div>

                    </div>


                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years" defaultValue={details.ebdToYear}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control"}}

                                  closeOnSelect={true} ref={"ebdToYear"+idx} onBlur={that.handleToYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months" defaultValue={details.ebdToMonth}
                                  inputProps={{placeholder: "Select Year", className: "float-label form-control"}}

                                  closeOnSelect={true} ref={"ebdToMonth"+idx} onBlur={that.handleToMonthChange.bind(that, idx)}/>
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

MlEmployeeBreakup.contextTypes = {
  startupPortfolio: PropTypes.object,
};
*/
