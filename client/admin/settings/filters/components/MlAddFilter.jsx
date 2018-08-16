import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import ScrollArea from 'react-scrollbar';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import MlAssignClustersToFilters from './mlAssignClustersToFilters'
import MlAssignModulesToFilters from './MlAssignModulesToFIlters'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {fetchFilterCatalogActionHandler} from '../actions/fetchFilterCatalogActionHandler'
import {updateFilterActionHandler} from '../actions/createFilterActionHandler'
import {fetchSelectedFilterDataActionHandler} from '../actions/fetchSelectedFilterDataActionHandler'
import MlLoader from '../../../../commons/components/loader/loader'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
export default class MlEditFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {transactionId: ' ',
      transactionType: ' ',
      filterCatalogData : [],
      filterData:{},
      clustersData:{},
      isFilterActive : false,
      data : {},
      loading:true
    }
    this.optionBySelectTransactionType.bind(this);
    this.fetchSelectedFilterData.bind(this);
    return this;
  }

  componentDidMount() {
    this.fetchSelectedFilterData()
  }
  componentDidUpdate(){
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    OnToggleSwitch(true,true);
  }

/*  getassignFilterToClusters(details){
    this.setState({'assignFilterToClusters':details})
  }*/

  optionBySelectTransactionType(value, calback, selObject){
    this.setState({transactionId:value});
    this.fetchFilterCatalogDetails(value);
  }

  onStatusChange(event){

    let updatedData = this.state.data||{};
    updatedData=_.omit(updatedData,["isActive"]);
    if (event.currentTarget.checked) {
      var z=_.extend(updatedData,{isActive:true});
      this.setState({data:z,loading:false});
    } else {
      var z=_.extend(updatedData,{isActive:false});
      this.setState({data:z,loading:false});
    }
  }


  getFiltersData(details){
    this.setState({filterData:details});
  }

  getassignFilterToClusters(details){
    this.setState({clustersData:details});
  }

  async fetchSelectedFilterData(){
    const response= await fetchSelectedFilterDataActionHandler(this.props.config);

    this.setState({loading:false,data : response,transactionId : response.moduleName,"filterData" : response.filterFields});
  }

  async updateFilterDetails() {
    let jsonData={
      filterName :this.refs.name.value || "",
      filterDescription : this.refs.about.value || "",
      isActive : this.refs.filterStatus.checked,
      moduleName:this.state.transactionId || "",
      filterFields : this.state.filterData || []
    }

    const response = await updateFilterActionHandler(this.props.config  ,jsonData)
    if(response){
      FlowRouter.go("/admin/settings/filtersList");
      return response;
    }

  }



  async fetchFilterCatalogDetails(value) {
    const response= await fetchFilterCatalogActionHandler(value);
    this.setState({filterCatalogData : response,showFilters : true})
  }

  render() {

    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler:this.updateFilterDetails.bind(this)
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/filtersList")
        }
      }
    ]
 /*   let transactionType=gql`query  {
      data:fetchTransaction{
        value:_id
        label:transactionDisplayName
      }
    }
     `;*/
    let transactionType = gql` query{data:fetchModules{label:name,value:name}}`;
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/> ):(
          <div className="admin_padding_wrap">
            <h2>Edit Filter</h2>

                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <input type="text" ref="name" defaultValue={this.state.data&&this.state.data.filterName} placeholder="Filter Name" className="form-control float-label" id=""/>
                      </div>


                      <div className="form-group">
                        <textarea placeholder="About" ref="about" defaultValue={this.state.data&&this.state.data.filterDescription} className="form-control float-label" ></textarea>
                      </div>


                     {/* <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" name={'isActive'} checked={this.state.data.isActive} onChange={this.onStatusChange.bind(this)} />
                          <div className="slider"></div>
                        </label>
                      </div>
*/}
                      <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" ref="filterStatus" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)} />
                          <div className="slider"></div>
                        </label>
                      </div>
                      <br className="brclear"/>


                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right"  >
                  <div className="clearfix"></div>
                  <div className="form_bg left_wrap">
                    <ScrollArea
                      speed={0.8}
                      className="left_wrap"
                      smoothScrolling={true}
                      default={true}
                    >
                      <form>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Module Name" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.transactionId} queryType={"graphql"}  query={transactionType} onSelect={this.optionBySelectTransactionType.bind(this)} isDynamic={true} disabled={true}/>
                        </div>
                        <MlAssignModulesToFilters filterExistingData = {this.state.data} getFiltersData={this.getFiltersData.bind(this)} filterCatalog={this.state.filterCatalogData}/>
                      </form>
                    </ScrollArea>
                  </div>
                </div>



            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>)}
      </div>
/*      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">d
          <h2>Create Filter</h2>
          <div className="main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
              <div className="col-md-6 nopadding-left">
                <div className="left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <div className="form_bg">
                      <form>
                        <div className="form-group">
                          <input type="text" ref="Name" defaultValue={this.state.data&&this.state.data.filterName} placeholder="Filter Name" className="form-control float-label" id=""/>
                        </div>


                        <div className="form-group">
                          <textarea placeholder="About" ref="about" className="form-control float-label"></textarea>
                        </div>






                        <div className="form-group switch_wrap inline_switch">
                          <label>Status</label>
                          <label className="switch">
                            <input type="checkbox" name={'isActive'} onChange={this.onStatusChange.bind(this)} />
                            <div className="slider"></div>
                          </label>
                        </div>

                        <br className="brclear"/>


                      </form>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="col-md-6 nopadding-right"  >
                <div className="clearfix"></div>
                <div className="form_bg left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <form>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} placeholder="Transaction Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.transactionId} queryType={"graphql"}  query={transactionType} onSelect={this.optionBySelectTransactionType.bind(this)} isDynamic={true}/>
                      </div>
                      {this.state.showFilters?<MlAssignModulesToFilters getFiltersData={this.getFiltersData.bind(this)} filterCatalog={this.state.filterCatalogData}/>:""}
                    </form>
                  </ScrollArea>
                </div>
              </div>
            </ScrollArea>
          </div>

          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

        </div>


      </div>*/
    )
  }
}

