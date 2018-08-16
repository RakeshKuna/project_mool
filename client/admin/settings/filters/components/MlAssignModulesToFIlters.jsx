import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {graphql} from 'react-apollo';
import ScrollArea from 'react-scrollbar';
let FontAwesome = require('react-fontawesome');
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import gql from 'graphql-tag'
import Datetime from "react-datetime";
import moment from "moment";
import MlAssignClustersToFilters from '../components/mlAssignClustersToFilters'
import _ from 'lodash';
import update from 'immutability-helper';

export default class MlAssignModulesToFilters extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
      listValues : [],
      assignModulesToFilters: []
    }
    this.optionsBySelectFieldName.bind(this);
    this.handleBlur.bind(this);

    return this;
  }



  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }
  componentDidMount() {
    let filterDetails = this.props.filterExistingData;
    this.setState({assignModulesToFilters:filterDetails.filterFields});
    setTimeout(function(){
      initalizeFloatLabel();
    },1000);

  }

  assignModuleToRoles(id) {
    this.setState({
      assignModulesToFilters: this.state.assignModulesToFilters.concat([{
        fieldName: '',
        displayName: '',
        isActive: '',
        fieldType:''
      }])
    });
  }

  RemoveModuleToRoles(id, event) {
    let assignModulesToFilters;
    assignModulesToFilters = this.state.assignModulesToFilters.filter(function (object, index) {
      return id !== index;
    });
    this.setState({
      assignModulesToFilters: assignModulesToFilters
    })
  }

  optionsBySelectFieldName(){

  }

  onStatusChange(index,event){
    let filterDetails=this.state.assignModulesToFilters
    if(event.currentTarget.checked){
      filterDetails[index]['isActive']=true
      this.setState({assignModulesToFilters:filterDetails})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }else {
      filterDetails[index]['isActive'] =false
      this.setState({assignModulesToFilters: filterDetails})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }
  }

  customChange(index,event){
    let cloneArray = _.cloneDeep(this.state.assignModulesToFilters);
    let filterDetails = cloneArray[index]
    if(event.currentTarget.checked){
      filterDetails['isCustom']=true
      cloneArray[index] = filterDetails
      this.setState({assignModulesToFilters:cloneArray})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }else {
      filterDetails['isCustom']=false
      cloneArray[index] = filterDetails
      this.setState({assignModulesToFilters: cloneArray})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }
  }

/*  componentWillReceiveProps(newProps){

    let filters=newProps.filterCatalog;
    if(filters){
      let availabilityDetailsForm=[]
      for(let i=0;i<filters.length;i++){
        let json={
          fieldName:filters[i].name,
          fieldType:filters[i].type,
          fieldList : filters[i].collectionName,
         }
        availabilityDetailsForm.push(json)
      }
      this.setState({assignModulesToFilters:availabilityDetailsForm})
    }
  }*/

  handleBlur(id,e){
    let cloneArray = _.cloneDeep(this.state.assignModulesToFilters);
    let details = cloneArray
    let name  = e.target.name;
   /* details=_.extend(details[id],{[name]:e.target.value});*/
    if(details[id]){
      details[id][name] = e.target.value;
    }
    this.setState({assignModulesToFilters:details})
    this.props.getFiltersData(details);
  }

/*
  restrictionChange(index,event){
    let filterDetails=this.state.assignModulesToFilters

    if(event.currentTarget.checked){
      filterDetails[index]['isRestrictedFilter']=true

      this.setState({assignModulesToFilters:filterDetails})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }else {
      filterDetails[index]['isRestrictedFilter'] =false
      this.setState({assignModulesToFilters: filterDetails})
      this.props.getFiltersData(this.state.assignModulesToFilters);
    }
  }
*/

  getRolesData(index,details){
      let filterDetails = this.state.assignModulesToFilters || [];
      let zz =  details|| [];
      var fieldListDataArray=_.map(zz, function (row) {
        let val= _.omit(row, ['__typename']);
        return val;
      });

    filterDetails[index]["fieldList"] = fieldListDataArray;
    this.setState({assignModulesToFilters: filterDetails})
    this.props.getFiltersData(this.state.assignModulesToFilters);

  }


  render() {
    let that = this;
    let listOptions = null;
    let customSelect = false;
    let listQuery=gql`query($moduleName:String!){  
      data:fetchFilterListDropDown(moduleName:$moduleName) {
       label
        value
      }  
    }`;
    let listSelect = false
    let listValues = that.state.listValues || []
    return (

      <div>

        {that.state.assignModulesToFilters.map(function (options, id) {

         if(options&&!options.isDynamic){
            if(options.fieldType == "List" || options.fieldType == "Boolean"){
              listSelect = true
            }
          }else{
            listSelect = false
          }
          if(options && !options.isDynamic&&options.isCustom){
            if(options&&options.fieldType == "List" || options&&options.fieldType == "Boolean"){
              customSelect = true
            }

          }else{
            customSelect = false
          }
          if(options&&options.fieldResolverName){
             listOptions={options: { variables: {moduleName:options.fieldResolverName}}}
          }else{
            listOptions={options: { variables: {moduleName:''}}}
          }

          return (

            <div className="panel panel-default" key={id}>
             {/* <div className="panel-heading">Add Filter{id == 0 ? (
                <div className="pull-right block_action" onClick={that.assignModuleToRoles.bind(that, id)}><img
                  src="/images/add.png"/></div>) :
                <div className="pull-right block_action" onClick={that.RemoveModuleToRoles.bind(that, id)}><img
                  src="/images/remove.png"/></div>}
              </div>*/}
            <div className="panel-heading">Filter Field</div>

              <div className="panel-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                        <input type="text" placeholder="Field Name" className="form-control float-label" defaultValue={options.fieldName}  disabled={true}/>



                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <input type="text" placeholder="Display Name" name={"displayName"} defaultValue={options.displayName}
                             className="form-control float-label" onBlur={that.handleBlur.bind(that,id)}/>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <input type="text" placeholder="Field Type"
                             className="form-control float-label" defaultValue={options.fieldType}  disabled={true}/>
                    </div>
                  </div>

                  <div className="col-md-12"  hidden="true">
                    {listSelect?<div className="form-group">
                      <input type="text" placeholder="Field Collection" ref={"resolverName"}
                             className="form-control float-label" defaultValue={options.fieldResolverName} disabled={true}/>
                    </div>:""}
                  </div>

                  <div className="col-md-4 nopadding">
                    <div className="form-group switch_wrap inline_switch">
                      <label>Status</label>
                      <label className="switch">
                        <input type="checkbox"  checked={options.isActive} onChange={that.onStatusChange.bind(that,id)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                  </div>

                  {listSelect?<div className="col-md-4 nopadding">

                      <div className="input_types">
                        <input  type="checkbox" name="checkbox" checked={options.isCustom} onChange={that.customChange.bind(that,id)}/>
                        <label htmlFor="checkbox1"><span> </span>Is Custom</label>
                      </div>

                  </div>:""}

               {/*   <div className="col-md-4 nopadding">

                      <div className="input_types">
                        <input  type="checkbox" name="checkbox" checked={options.isRestrictedFilter} onChange={that.restrictionChange.bind(that,id)}/>
                        <label htmlFor="checkbox1"><span> </span>Is Restrictedfilter</label>
                      </div>

                  </div>
*/}
                  <br className="brclear"/><br/>
                  {listSelect && customSelect?<div><MlAssignClustersToFilters getRolesData={that.getRolesData.bind(that,id)} moduleName={options.fieldResolverName} filtersDepartmentData={options.fieldList}/></div>:""}


                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
/*  render() {
    let that = this;
    let getModulesquery = gql` query{data:fetchModules{label:name,value:_id}}`;

    return (
      <div>

        {that.state.assignModulesToRoles.map(function (options, id) {
          let statusRead=false;
          let statusUpdate=false;
          let statusDelete=false;
          let statusCreate=false;
          let yesterday = Datetime.moment().subtract(1, 'day');
          let validDate = function (current) {
            return current.isAfter(yesterday);
          }
          _.each(options.actions,function (s,v) {
            if(s.actionId=='DELETE'){
              statusDelete=true;
            }
            if(s.actionId=='READ'){
              statusRead=true;
            }
            if(s.actionId=='UPDATE'){
              statusUpdate=true;
            }
            if(s.actionId=='CREATE'){
              statusCreate=true;
            }
          })
          return (

            <div className="panel panel-default" key={id}>


              <div className="panel-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <input type="text" placeholder="Display Name"
                             className="form-control float-label"/>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <input type="text" placeholder="Display Name"
                             className="form-control float-label"/>
                    </div>
                  </div>


                  <div className="col-md-6">
                    <div className="form-group switch_wrap inline_switch" style={{marginTop: '7px'}}>
                      <label className="">Status</label>
                      <label className="switch">
                        <input type="checkbox" checked={options.isActive}
                               onChange={that.onStatusChange.bind(that, id)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                  </div>


                </div>
              </div>

            </div>
          )
        })}
      </div>
    )
  }*/
};

