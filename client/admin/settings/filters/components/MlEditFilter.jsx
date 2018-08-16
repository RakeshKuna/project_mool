/*
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import {fetchSelectedFilterDataActionHandler} from '../actions/fetchSelectedFilterDataActionHandler'
import Moolyaselect from  '../../../commons/component/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import ScrollArea from 'react-scrollbar';
export default class MlEditFilter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {transactionId: ' ',
      transactionType: ' ',
      filterCatalogData : [],
      filterData:{},
      clustersData:{},
      isFilterActive : false,
      showFilters:false,
      data : {},
      loading:true
    }
    this.fetchSelectedFilterData.bind(this);
    return this;
  }

  componentDidMount() {
    this.fetchSelectedFilterData()
  }

  async fetchSelectedFilterData(){
    const response= await fetchSelectedFilterDataActionHandler(this.props.config);
    this.setState({loading:false,data : response});
  }
  getassignFilterToClusters(details){
    this.setState({'assignFilterToClusters':details})
  }
  render(){

    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler:null
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/filtersList")
        }
      }
    ]

    let transactionType = gql` query{data:fetchModules{label:name,value:name}}`;
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?( <div className="loader_wrap"></div>):(
          <div className="admin_padding_wrap">
            <h2>Edit Filter</h2>
            <div className="main_wrap_scroll">
              <ScrollArea
                speed={0.8}
                className="main_wrap_scroll"
                smoothScrolling={true}
                default={true}
              >
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <input type="text" ref="departmentName" defaultValue={this.state.data&&this.state.data.filterName} placeholder="Filter Name" className="form-control float-label" id=""/>
                      </div>


                      <div className="form-group">
                        <textarea placeholder="About" ref="about" defaultValue={this.state.data&&this.state.data.filterDescription} className="form-control float-label" ></textarea>
                      </div>

                      {/!*
                      <div className="form-group">
                        <input ref="displayName" defaultValue={this.state.data&&this.state.data.displayName} placeholder="Display Name" className="form-control float-label" id=""></input>
                      </div>
                      <div className="form-group">
                        <textarea ref="aboutDepartment" defaultValue={this.state.data&&this.state.data.departmentDesc} placeholder="About Department" className="form-control float-label" id=""></textarea>
                      </div>

                      <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" ref="departmentStatus" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>*!/}
                    </form>
                  </div>
                </div>

                {/!*<div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                      <div className="clearfix"></div>
                      <div className="form-group switch_wrap switch_names">
                        <label>Select Type</label><br/>
                        <span className="state_label acLabel">moolya</span><label className="switch nocolor-switch">
                        <input type="checkbox" ref="appType" disabled="true" checked={this.state.isMoolyaChecked} onChange={this.onMoolyaChange.bind(this)} />
                        <div className="slider"></div>
                      </label>
                        <span className="state_label">non-moolya</span>
                      </div><br className="brclear"/>
                      {this.state.isMoolyaChecked?<MlAssignDepartments getDepartmentAvailability={this.getDepartmentAvailability.bind(this)} nonMoolya={this.state.data&&this.state.data.depatmentAvailable} isSystemDefined={this.state.data&&this.state.data.isSystemDefined}/>:<MlMoolyaAssignDepartment getMoolyaDepartmentAvailability={this.getMoolyaDepartmentAvailability.bind(this)} moolya={this.state.data&&this.state.data.depatmentAvailable}/>}
                    </form>
                  </div>
                </div>*!/}
              </ScrollArea>
            </div>

            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>)}
      </div>
    )
  }
}
*/
