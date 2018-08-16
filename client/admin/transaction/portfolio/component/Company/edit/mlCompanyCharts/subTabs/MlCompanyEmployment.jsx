import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";
import {initalizeFloatLabel} from '../../../../../../../utils/formElemUtil';

export default class MlCompanyEmployment extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyEmployment:[],
      selectedVal:null,
      selectedObject:"default",
      //employmentList : this.props.employmentDetails || []
      employmentList : []
    }
    this.fetchDetails.bind(this);
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }

  componentWillMount(){
    this.fetchDetails();
    /* let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.employmentOfCompanyChart)
     if(!empty){
     this.setState({loading: false, startupCompanyEmployment: this.context.startupPortfolio.employmentOfCompanyChart, employmentList:this.context.startupPortfolio.employmentOfCompanyChart});
     }*/
  }
  componentDidUpdate(){
    initalizeFloatLabel();
  }
  fetchDetails(){
    let that = this;
    //let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.companyPortfolio && that.context.companyPortfolio.employmentOfCompanyChart)
    if(empty){
      this.setState({loading: false, startupCompanyEmployment: that.props.employmentDetails, employmentList: that.props.employmentDetails});
    }else{
      this.setState({loading: false, startupCompanyEmployment: that.context.companyPortfolio.employmentOfCompanyChart, employmentList:that.context.companyPortfolio.employmentOfCompanyChart});
    }
  }

  handleFromYearChange(index,e){
    let details =this.state.data;
    let name  = 'eofFromYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["eofFromYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }


  handleFromMonthChange(index,e){
    let details =this.state.data;
    let name  = 'eofFromMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["eofFromMonth"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToYearChange(index,e){
    let details =this.state.data;
    let name  = 'eofToYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["eofToYear"+index].state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent(index)
    })
  }

  handleToMonthChange(index,e){
    let details =this.state.data;
    let name  = 'eofToMonth';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["eofToMonth"+index].state.inputValue});
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

  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyEmployment:this.state.startupCompanyEmployment})
      this.props.getStartupCompanyEmployment(this.state.startupCompanyEmployment);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyEmployment;
      if(clients[index]) {
        clients[index] = _.extend(clients[index], data);
      }
      let arr = [];
      clients = _.map(clients, function (row) {
        return _.omit(row, ['__typename'])
      });
      this.setState({startupCompanyEmployment:clients})
      this.props.getStartupCompanyEmployment(clients);
    }

  }

  onSaveAction(index,e){
    let data = this.state.data;
    data["eofFromYear"] =  this.refs["eofFromYear"+index].state.inputValue;
    data["eofFromMonth"] =  this.refs["eofFromMonth"+index].state.inputValue;
    data["eofToYear"] =  this.refs["eofToYear"+index].state.inputValue;
    data["eofToMonth"] =  this.refs["eofToMonth"+index].state.inputValue;
    data["eofNumberOfEmployment"] =  this.refs["eofNumberOfEmployment"+index].value
    data["eofAbout"] =  this.refs["eofAbout"+index].value
    data["index"] =  this.state.startupCompanyEmployment&&this.state.startupCompanyEmployment.length?this.state.startupCompanyEmployment.length:0
    let clients = this.state.startupCompanyEmployment;
    clients[index] = data
    this.setState({startupCompanyEmployment:clients})
    this.props.getStartupCompanyEmployment(clients);
    this.setState({employmentList:this.state.startupCompanyEmployment})
    this.refs["eofFromYear"+index].state.inputValue = ""
    this.refs["eofFromMonth"+index].state.inputValue = ""
    this.refs["eofToYear"+index].state.inputValue = ""
    this.refs["eofToMonth"+index].state.inputValue = ""
    this.refs["eofNumberOfEmployment"+index].value = ""
    this.refs["eofAbout"+index].value = ""
    this.setState({data : {}})

  }

  /*onRemoveAction(index,e){
   let updatedData = this.state.startupCompanyEmployment || [];
   updatedData.splice(updatedData.indexOf(index), 1);
   this.setState({employmentList: updatedData}, function () {
   this.sendDataToParent()
   });
   }*/

  render(){
    let that = this;
    let employemntArray = this.state.employmentList&&this.state.employmentList.length>0?this.state.employmentList:[]
    let defaultIndex = employemntArray&&employemntArray.length>0?employemntArray.length:0
    return(<div>
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >
          <div className="panel panel-default">
            <div className="panel-heading">Company Employment{
              <div className="pull-right block_action" onClick={this.onSaveAction.bind(this,defaultIndex)}><img
                src="/images/add.png"/></div>}
            </div>
            <div className="panel-body">
              <div className="office-members-detail">

                <div className="form_inner_block">
                  {/*<div className="add_form_block" onClick={this.onSaveAction.bind(this,defaultIndex)}><img src="/images/add.png"/></div>*/}

                  <div className="col-lg-12 col-md-12 col-sm-10">
                    <div className="row">
                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select From Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"eofFromYear"+defaultIndex} onChange={this.handleFromYearChange.bind(this,defaultIndex)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select From Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"eofFromMonth"+defaultIndex} onChange={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                        </div>

                      </div>


                      <div className="form-group col-lg-6">
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select To Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"eofToYear"+defaultIndex} onChange={this.handleToYearChange.bind(this,defaultIndex)}/>
                        </div>
                        <div className="form-group col-md-6 col-sm-6">
                          <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                    inputProps={{placeholder: "Select To Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                    closeOnSelect={true} ref={"eofToMonth"+defaultIndex} onChange={this.handleToMonthChange.bind(this,defaultIndex)}/>
                        </div>
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <input type="text" placeholder="Number of Employment" ref={"eofNumberOfEmployment"+defaultIndex} className="form-control float-label"
                               id="" name="eofNumberOfEmployment" onBlur={this.employeementHandleBlur.bind(this,defaultIndex)}/>
                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                    <textarea rows="1" placeholder="About" ref={"eofAbout"+defaultIndex} className="form-control float-label"
                              id="" name="eofAbout" onBlur={this.aboutHandleBlur.bind(this,defaultIndex)}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                {that.state.employmentList.map(function (details, idx) {


                  return(<div className="form_inner_block">

                    {/*<div className="add_form_block" onClick={that.onRemoveAction.bind(that,idx)}><img src="/images/remove.png"/></div>*/}
                    <div className="col-lg-12 col-md-12 col-sm-10">
                      <div className="row">
                        <div className="form-group col-lg-6">
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                      inputProps={{placeholder: "Select From Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.eofFromYear}
                                      closeOnSelect={true} ref={"eofFromYear"+idx} onChange={that.handleFromYearChange.bind(that, idx)}/>
                          </div>
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                      inputProps={{placeholder: "Select From Month", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.eofFromMonth}
                                      closeOnSelect={true} ref={"eofFromMonth"+idx} onChange={that.handleFromMonthChange.bind(that, idx)}/>
                          </div>

                        </div>


                        <div className="form-group col-lg-6">
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                      inputProps={{placeholder: "Select To Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.eofToYear}
                                      closeOnSelect={true} ref={"eofToYear"+idx} onChange={that.handleToYearChange.bind(that, idx)}/>
                          </div>
                          <div className="form-group col-md-6 col-sm-6">
                            <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                      inputProps={{placeholder: "Select To Month", className: "float-label form-control",readOnly:true}}
                                      defaultValue={details.eofToMonth}
                                      closeOnSelect={true} ref={"eofToMonth"+idx} onChange={that.handleToMonthChange.bind(that, idx)}/>
                          </div>
                        </div>
                        <div className="form-group col-lg-6 col-md-6 col-sm-6">
                          <input type="text" placeholder="Number of Employment" ref={"eofNumberOfEmployment"+idx}
                                 className="form-control float-label" id="" defaultValue={details.eofNumberOfEmployment} name="eofNumberOfEmployment" onBlur={that.employeementHandleBlur.bind(that,idx)}/>
                        </div>

                        <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <textarea rows="1" placeholder="About" ref={"eofAbout"+idx} className="form-control float-label"
                                id="" name="eofAbout"   defaultValue={details.eofAbout} onBlur={that.aboutHandleBlur.bind(that,idx)}></textarea>
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
MlCompanyEmployment.contextTypes = {
  //institutionPortfolio: PropTypes.object,
  companyPortfolio: PropTypes.object,
};
