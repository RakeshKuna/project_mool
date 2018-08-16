import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";

export default class MlCompanyEmployment extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyEmployment:this.props.employmentDetails || [],
      selectedIndex:0,
      selectedVal:null,
      selectedObject:"default",
      employmentList : this.props.employmentDetails || []
    }
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
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
      let startupCompanyEmployment = _.cloneDeep(clients);
      data.index = index;
      startupCompanyEmployment[index] = data;
      let arr = [];
      _.each(startupCompanyEmployment, function (item)
      {
        for (var propName in item) {
          if (item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        let newItem = _.omit(item, "__typename");
        arr.push(newItem)
      })
      startupCompanyEmployment = arr;
      this.setState({startupCompanyEmployment:startupCompanyEmployment})
      this.props.getStartupCompanyEmployment(startupCompanyEmployment);
    }

  }

  onSaveAction(index,e){
    this.setState({employmentList:this.state.startupCompanyEmployment})
    if(this.state.startupCompanyEmployment){
      this.setState({selectedIndex:this.state.startupCompanyEmployment.length})
    }else{
      this.setState({selectedIndex:0})
    }
    this.refs["eofFromYear"+index].state.inputValue = ""
    this.refs["eofFromMonth"+index].state.inputValue = ""
    this.refs["eofToYear"+index].state.inputValue = ""
    this.refs["eofToMonth"+index].state.inputValue = ""
    this.refs["eofNumberOfEmployment"+index].value = ""
    this.refs["eofAbout"+index].value = ""

  }
  onUpdateAction(){
    if(this.state.startupCompanyEmployment){
      this.setState({selectedIndex:this.state.startupCompanyEmployment.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }
  componentWillMount(){
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.employmentOfCompanyChart)
    if(!empty){
      this.setState({loading: false, startupCompanyEmployment: this.context.startupPortfolio.employmentOfCompanyChart, employmentList:this.context.startupPortfolio.employmentOfCompanyChart});
    }
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
                                closeOnSelect={true} ref={"eofFromYear"+defaultIndex} onBlur={this.handleFromYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select From Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                closeOnSelect={true} ref={"eofFromMonth"+defaultIndex} onBlur={this.handleFromMonthChange.bind(this,defaultIndex)}/>
                    </div>

                  </div>


                  <div className="form-group col-lg-6">
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select To Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                closeOnSelect={true} ref={"eofToYear"+defaultIndex} onBlur={this.handleToYearChange.bind(this,defaultIndex)}/>
                    </div>
                    <div className="form-group col-md-6 col-sm-6">
                      <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                inputProps={{placeholder: "Select To Month", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data.year}
                                closeOnSelect={true} ref={"eofToMonth"+defaultIndex} onBlur={this.handleToMonthChange.bind(this,defaultIndex)}/>
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
                                  closeOnSelect={true} ref={"eofFromYear"+idx} onBlur={that.handleFromYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                  inputProps={{placeholder: "Select From Month", className: "float-label form-control",readOnly:true}}
                                  defaultValue={details.eofFromMonth}
                                  closeOnSelect={true} ref={"eofFromMonth"+idx} onBlur={that.handleFromMonthChange.bind(that, idx)}/>
                      </div>

                    </div>


                    <div className="form-group col-lg-6">
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                  inputProps={{placeholder: "Select To Year", className: "float-label form-control",readOnly:true}}
                                  defaultValue={details.eofToYear}
                                  closeOnSelect={true} ref={"eofToYear"+idx} onBlur={that.handleToYearChange.bind(that, idx)}/>
                      </div>
                      <div className="form-group col-md-6 col-sm-6">
                        <Datetime dateFormat="MMMM" timeFormat={false} viewMode="months"
                                  inputProps={{placeholder: "Select To Month", className: "float-label form-control",readOnly:true}}
                                  defaultValue={details.eofToMonth}
                                  closeOnSelect={true} ref={"eofToMonth"+idx} onBlur={that.handleToMonthChange.bind(that, idx)}/>
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
  startupPortfolio: PropTypes.object,
};
