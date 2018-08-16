import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";

import {initalizeFloatLabel} from '../../../../../../../utils/formElemUtil';

export default class MlStartupCompanyReview extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyReview: [],
      selectedVal:null,
      selectedObject:"default",
      reviewList :  []
    }
    this.fetchDetails.bind(this);
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }

  componentDidUpdate(){
    initalizeFloatLabel();
  }

  handleFromYearChange(index,e){
    let details =this.state.data;
    let name  = 'rofYear';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs["rofYear"+index].state.inputValue});
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


  componentWillMount(){
    this.fetchDetails()
   /* let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.reviewOfCompanyChart)
    if(!empty){
      this.setState({loading: false, startupCompanyReview: this.context.startupPortfolio.reviewOfCompanyChart, reviewList:this.context.startupPortfolio.reviewOfCompanyChart});
    }*/
  }

  fetchDetails(){
    let that = this;
    //let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.startupPortfolio && that.context.startupPortfolio.reviewOfCompanyChart)
    if(empty){
      this.setState({loading: false, startupCompanyReview: that.props.reviewDetails, reviewList: that.props.reviewDetails});
    }else{
      this.setState({loading: false, startupCompanyReview: that.context.startupPortfolio.reviewOfCompanyChart, reviewList:that.context.startupPortfolio.reviewOfCompanyChart});
    }
  }

  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyReview:this.state.startupCompanyReview})
      this.props.startupCompanyReview(this.state.startupCompanyReview);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyReview;
      if(clients[index]){
        clients[index] = _.extend(clients[index],data);
      }
      let arr = [];
      clients = _.map(clients, function (row) {
        return _.omit(row, ['__typename'])
      });
      this.setState({startupCompanyReview:clients})
      this.props.getStartupCompanyReview(clients);
    }

  }

  onSaveAction(index,e){
    let data = this.state.data
    data["rofYear"] =  this.refs["rofYear"+index].state.inputValue ;
    data["rofValue"] =  this.refs["rofValue"+index].value;
    data["rofAbout"] = this.refs["rofAbout"+index].value;
    data["index"] =  this.state.startupCompanyReview&&this.state.startupCompanyReview.length?this.state.startupCompanyReview.length:0
    let clients = this.state.startupCompanyReview;
    clients[index] = data
    this.setState({startupCompanyReview:clients})
    this.props.getStartupCompanyReview(clients);
    this.setState({reviewList:this.state.startupCompanyReview})
    this.refs["rofYear"+index].state.inputValue = ""
    this.refs["rofValue"+index].value = ""
    this.refs["rofAbout"+index].value = ""
    this.setState({data : {}})

  }


  /*onRemoveAction(index,e){
   let updatedData = this.state.startupCompanyReview || [];
   updatedData.splice(updatedData.indexOf(index), 1);
   this.setState({reviewList: updatedData}, function () {
   this.sendDataToParent()
   });
   }*/

  render(){
    let that = this;
    let employemntArray = this.state.reviewList&&this.state.reviewList.length>0?this.state.reviewList:[]
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
          <div className="panel-heading">Review Of Company{
            <div className="pull-right block_action" onClick={this.onSaveAction.bind(this,defaultIndex)}><img
              src="/images/add.png"/></div>}
          </div>
          <div className="panel-body">
            <div className="office-members-detail">

              <div className="form_inner_block">
                {/*<div className="add_form_block" onClick={this.onSaveAction.bind(this,defaultIndex)}><img src="/images/add.png"/></div>*/}

                <div className="col-lg-12 col-md-12 col-sm-10">
                  <div className="row">
                    <div className="form-group col-lg-6  col-md-6 col-sm-6">

                      <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                closeOnSelect={true} ref={"rofYear"+defaultIndex} onChange={this.handleFromYearChange.bind(this, defaultIndex)}/>


                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Enter Value" ref={"rofValue"+defaultIndex}
                             className="form-control float-label" id=""  name="rofValue" onBlur={this.valueHandleBlur.bind(this,defaultIndex)}/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <textarea rows="1" placeholder="About" ref={"rofAbout"+defaultIndex} className="form-control float-label"
                                id="" name="rofAbout"   onBlur={this.aboutHandleBlur.bind(this,defaultIndex)}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              {that.state.reviewList.map(function (details, idx) {


                return(<div className="form_inner_block">

                  {/*<div className="add_form_block" onClick={that.onRemoveAction.bind(that,idx)}><img src="/images/remove.png"/></div>*/}
                  <div className="col-lg-12 col-md-12 col-sm-10">
                    <div className="row">
                      <div className="form-group col-lg-6  col-md-6 col-sm-6">

                          <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                    inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                    defaultValue={details.rofYear}
                                    closeOnSelect={true} ref={"rofYear"+idx} onChange={that.handleFromYearChange.bind(that, idx)}/>


                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                        <input type="text" placeholder="Enter Value" ref={"rofValue"+idx}
                               className="form-control float-label" id="" defaultValue={details.rofValue} name="rofValue" onBlur={that.valueHandleBlur.bind(that,idx)}/>
                      </div>

                      <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <textarea rows="1" placeholder="About" ref={"rofAbout"+idx} className="form-control float-label"
                                id="" name="rofAbout"   defaultValue={details.rofAbout} onBlur={that.aboutHandleBlur.bind(that,idx)}></textarea>
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

MlStartupCompanyReview.contextTypes = {
  startupPortfolio: PropTypes.object,
};

