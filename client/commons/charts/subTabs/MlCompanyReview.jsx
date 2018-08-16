import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import Datetime from "react-datetime";
import _ from 'lodash';
import ScrollArea from "react-scrollbar";

export default class MlCompanyReview extends React.Component{
  constructor(props, context){
    super(props)
    this.state={
      data:{},
      startupCompanyReview:this.props.reviewDetails || [],
      selectedIndex:0,
      selectedVal:null,
      selectedObject:"default",
      reviewList : this.props.reviewDetails || []
    }
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
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

  sendDataToParent(index){
    if(index == null){
      this.setState({startupCompanyReview:this.state.startupCompanyReview})
      this.props.startupCompanyReview(this.state.startupCompanyReview);
    }else{
      let data = this.state.data;
      let clients = this.state.startupCompanyReview;
      let startupCompanyReview = _.cloneDeep(clients);
      data.index = index;
      startupCompanyReview[index] = data;
      let arr = [];
      _.each(startupCompanyReview, function (item)
      {
        for (var propName in item) {
          if (item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        let newItem = _.omit(item, "__typename");
        arr.push(newItem)
      })
      startupCompanyReview = arr;
      this.setState({startupCompanyReview:startupCompanyReview})
      this.props.getStartupCompanyReview(startupCompanyReview);
    }

  }

  onSaveAction(index,e){
    this.setState({reviewList:this.state.startupCompanyReview})
    if(this.state.startupCompanyReview){
      this.setState({selectedIndex:this.state.startupCompanyReview.length})
    }else{
      this.setState({selectedIndex:0})
    }
    this.refs["rofYear"+index].state.inputValue = ""
    this.refs["rofValue"+index].value = ""
    this.refs["rofAbout"+index].value = ""

  }
  onUpdateAction(){
    if(this.state.startupCompanyReview){
      this.setState({selectedIndex:this.state.startupCompanyReview.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  componentWillMount(){
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.reviewOfCompanyChart)
    if(!empty){
      this.setState({loading: false, startupCompanyReview: this.context.startupPortfolio.reviewOfCompanyChart, reviewList:this.context.startupPortfolio.reviewOfCompanyChart});
    }
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
          <div className="panel-heading">Company Review{
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
                                closeOnSelect={true} ref={"rofYear"+defaultIndex} onBlur={this.handleFromYearChange.bind(this, defaultIndex)}/>


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
                                    closeOnSelect={true} ref={"rofYear"+idx} onBlur={that.handleFromYearChange.bind(that, idx)}/>


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

MlCompanyReview.contextTypes = {
  startupPortfolio: PropTypes.object,
};

