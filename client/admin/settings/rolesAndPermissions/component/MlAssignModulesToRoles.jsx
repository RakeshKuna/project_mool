import React from 'react';
import {Meteor} from 'meteor/meteor';
import ScrollArea from 'react-scrollbar';
let FontAwesome = require('react-fontawesome');
import gql from 'graphql-tag'
import Datetime from "react-datetime";
import moment from "moment";
import _ from 'lodash'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper';

const currentDate= moment().format(Meteor.settings.public.dateFormat);

export default class MlAssignModulesToRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
      assignModulesToRoles: [{
        moduleId: '',
        moduleName: '',
        validFrom: null,
        validTo: null,
        isActive: '',
        actions: []
      }]
    }
    this.addDepartmentComponent.bind(this);
    this.optionsBySelectAction = this.optionsBySelectAction.bind(this);
    //this.onStatusChange=this.onStatusChange.bind(this)
    this.optionsActionHandler.bind(this);
    return this;
  }

  assignModuleToRoles(id) {
    this.setState({
      assignModulesToRoles: this.state.assignModulesToRoles.concat([{
        moduleId: '',
        moduleName: '',
        validFrom: currentDate,
        validTo: null,
        isActive: '',
        actions: []
      }])
    }, function () {
      setTimeout(function () {
        this.context.scrollArea.refresh();
        this.context.scrollArea.scrollBottom();
      }.bind(this));
    });
  }

  RemoveModuleToRoles(id, event) {
    let assignModulesToRoles;
    assignModulesToRoles = this.state.assignModulesToRoles.filter(function (object, index) {
      return id !== index;
    });
    this.setState({
      assignModulesToRoles: assignModulesToRoles
    }, () => {
      this.props.getassignModulesToRoles(assignModulesToRoles)
    })
  }

  componentDidMount() {
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }


  componentWillMount() {
    let assignModulesToRolesDetails = this.props.assignModulesToRolesData
    if (assignModulesToRolesDetails) {
      let assignModulesToRolesForm = []
      for (let i = 0; i < assignModulesToRolesDetails.length; i++) {
        let actions = assignModulesToRolesDetails[i].actions
        let actionVal = []
        if (actions) {
          for (let j = 0; j < actions.length; j++) {
            actionVal.push({"actionId": actions[j].actionId, "actionCode": actions[j].actionCode})
          }
        }
        let validFromDate = null;
        let validToDate = null;

        if(assignModulesToRolesDetails[i] && assignModulesToRolesDetails[i].validFrom){
          if((assignModulesToRolesDetails[i].validFrom) == "Invalid Date" ){
            validFromDate = null
          }else{
            validFromDate = moment(assignModulesToRolesDetails[i].validFrom).format(Meteor.settings.public.dateFormat)
          }
        }

        if(assignModulesToRolesDetails[i] && assignModulesToRolesDetails[i].validTo){
          if((assignModulesToRolesDetails[i].validTo) == "Invalid Date" ){
            validToDate = null
          }else{
            validToDate = moment(assignModulesToRolesDetails[i].validTo).format(Meteor.settings.public.dateFormat)
          }
        }

        let json = {
          moduleId: assignModulesToRolesDetails[i].moduleId,
          moduleName: assignModulesToRolesDetails[i].moduleName,
          validFrom: validFromDate,
          validTo: validToDate,
          isActive: assignModulesToRolesDetails[i].isActive,
          actions: actionVal
        }


        assignModulesToRolesForm.push(json)
      }
      this.setState({assignModulesToRoles: assignModulesToRolesForm})
    }
  }

  optionsBySelectModule(index, selectedIndex) {
    let assignModulesToRoles = this.state.assignModulesToRoles
    assignModulesToRoles[index]['moduleId'] = selectedIndex
    this.setState({assignModulesToRoles: assignModulesToRoles})
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }

  optionsBySelectAction(index, event) {
    let assignModulesToRoles = this.state.assignModulesToRoles
    let actions = this.state.assignModulesToRoles[index].actions
    if (event.target.checked) {
      let value = event.target.name;
      actions.push({actionId: value, actionCode: value.toUpperCase()})
      if(value == 'CREATE' || value == 'UPDATE' && (_.findIndex(actions, {actionCode:"READ"}) < 0)){
        actions.push({actionId: "READ", actionCode: "READ"})
      }
    } else {
      let flag = '';
      _.each(actions, function (item, key) {
        if (item.actionId == event.target.name) {
          flag = key;
        }
      });
      actions.splice(flag, 1);

      if(event.target.name == 'READ'){
          var index = _.findIndex(actions, {actionCode:"UPDATE"})
          if(index >= 0)
              actions.splice(index, 1);
          index = _.findIndex(actions, {actionCode:"CREATE"})
          if(index >= 0)
            actions.splice(index, 1);
      }
    }
    let ary = [];
    _.each(actions, function (s, v) {
      if (s.actionId) {
        ary.push(s)
      }
    })
    actions = ary;
    assignModulesToRoles[index].actions = actions
    this.setState({assignModulesToRoles: assignModulesToRoles})
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }

  optionsActionHandler(value, event) {
    console.log(value);
  }

  addDepartmentComponent(event) {
    var mySwiper = new Swiper('.blocks_in_form', {
      // speed: 400,
      pagination: '.swiper-pagination',
      spaceBetween: 0,
      slidesPerView: 'auto',
      freeMode: true,
      paginationClickable: false
    });
    mySwiper.updateContainerSize()
    this.setState({
      assignModulesToRoles: this.state.assignModulesToRoles.concat([{
        moduleId: '',
        moduleName: '',
        validFrom: null,
        validTo: null,
        isActive: '',
        actions: []
      }])
    });
  }

  onStatusChange(id, event) {
    if (event.target.checked) {
      let departmentDetails = this.state.assignModulesToRoles
      departmentDetails[id]['isActive'] = true
      this.setState({assignModulesToRoles: departmentDetails})
      this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
    } else {
      let departmentDetails = this.state.assignModulesToRoles
      departmentDetails[id]['isActive'] = false
      this.setState({assignModulesToRoles: departmentDetails})
      this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
    }
  }

  onmoduleNameChange(index, event) {
    let assignModulesToRoles = this.state.assignModulesToRoles
    assignModulesToRoles[index]['moduleName'] = event.target.value
    this.setState({assignModulesToRoles: assignModulesToRoles})
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }


  onvalidFromChange(index, event) {
    if (event._d) {
      let value = moment(event._d).format(Meteor.settings.public.dateFormat);
      let assignModulesToRoles = this.state.assignModulesToRoles;
      assignModulesToRoles[index]['validFrom'] = value
      this.setState({assignModulesToRoles: assignModulesToRoles})
    }
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }

  onvalidToChange(index, event) {
    if (event._d) {
      let value = moment(event._d).format(Meteor.settings.public.dateFormat);
      let assignModulesToRoles = this.state.assignModulesToRoles;
      assignModulesToRoles[index]['validTo'] = value
      this.setState({assignModulesToRoles: assignModulesToRoles})
    }
    this.props.getassignModulesToRoles(this.state.assignModulesToRoles)
  }


  render() {
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
            if(s.actionCode=='DELETE'){
              statusDelete=true;
            }
            if(s.actionCode=='READ' || s.actionCode == 'ALL'){
              statusRead=true;
            }
            if(s.actionCode=='UPDATE' || s.actionCode == 'ALL'){
              statusUpdate=true;
            }
            if(s.actionCode=='CREATE' || s.actionCode == 'ALL'){
              statusCreate=true;
            }
          })
          // let currentDate= moment().format(Meteor.settings.public.dateFormat);
          let validFrom=that.state.assignModulesToRoles[id].validFrom || currentDate;
          let validTo=that.state.assignModulesToRoles[id].validTo
          if(validFrom&&validFrom!="Invalid date"){
            validFrom=moment(validFrom).format('DD-MM-YYYY')
          }else{
            validFrom=null
          }
          if(validTo&&validTo!="Invalid date"){
            validTo=moment(validTo).format('DD-MM-YYYY')
          }else {
            validTo=null
          }
          return (

            <div className="panel panel-default" key={id}>
              <div className="panel-heading">Add Module{id == 0 ? (
                <div className="pull-right block_action" onClick={that.assignModuleToRoles.bind(that, id)}><img
                  src="/images/add.png"/></div>) :
                <div className="pull-right block_action" onClick={that.RemoveModuleToRoles.bind(that, id)}><img
                  src="/images/remove.png"/></div>}
              </div>

                <div className="panel-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Module Name" className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} selectedValue={options.moduleId} queryType={"graphql"}
                                    query={getModulesquery} isDynamic={true} id={'moduleId' + id}
                                    onSelect={that.optionsBySelectModule.bind(that, id)}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input type="text" placeholder="Display Name"
                             className="form-control float-label" defaultValue={options.moduleName}
                             onBlur={that.onmoduleNameChange.bind(that, id)}/>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <Datetime dateFormat={true}  timeFormat={false} isValidDate={validDate} inputProps={{placeholder: "Active From",readOnly:true}} closeOnSelect={true} value={validFrom} onChange={that.onvalidFromChange.bind(that, id)}/>
                      {/*<FontAwesome name="calendar" className="input_icon nomargin-right"/>*/}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <Datetime dateFormat={true} timeFormat={false} isValidDate={validDate} inputProps={{placeholder: "Active Till",readOnly:true}}  closeOnSelect={true} value={validTo} onChange={that.onvalidToChange.bind(that, id)}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group switch_wrap inline_switch" style={{marginTop: '7px'}}>
                      <label className="">Overall Status</label>
                      <label className="switch">
                        <input type="checkbox" checked={options.isActive}
                               onChange={that.onStatusChange.bind(that, id)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12 ">
                    <div className="form-group">
                    <div className="input_types"><input id={`chapter_admin_create${id}`} type="checkbox" name="CREATE"
                                                        checked={statusCreate}
                                                        onChange={that.optionsBySelectAction.bind(that, id)}/><label
                      htmlFor={`chapter_admin_create${id}`}><span></span>Create</label></div>
                    <div className="input_types"><input id={`chapter_admin_read${id}`} type="checkbox" name="READ"
                                                        checked={statusRead}
                                                        onChange={that.optionsBySelectAction.bind(that, id)}/><label
                      htmlFor={`chapter_admin_read${id}`}><span></span>Read</label></div>
                    <div className="input_types"><input id={`chapter_admin_update${id}`} type="checkbox" name="UPDATE"
                                                        checked={statusUpdate}
                                                        onChange={that.optionsBySelectAction.bind(that, id)}/><label
                      htmlFor={`chapter_admin_update${id}`}><span></span>Update</label></div>
                    <div className="input_types"><input id={`chapter_admin_delete${id}`} type="checkbox" name="DELETE"
                                                        checked={statusDelete}
                                                        onChange={that.optionsBySelectAction.bind(that, id)}/><label
                      htmlFor={`chapter_admin_delete${id}`}><span></span>Delete</label></div>
                  </div>
                  </div>

                </div>
              </div>

            </div>
          )
        })}
        <br /><br /><br /><br /><br /><br /><br />
      </div>
    )
  }
};

MlAssignModulesToRoles.contextTypes = {
  scrollArea: React.PropTypes.object
};
