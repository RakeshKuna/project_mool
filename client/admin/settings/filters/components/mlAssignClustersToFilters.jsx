import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default class MlAssignClustersToFilters extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedValue:null,
      assignFilterToClusters:[{departmentId:'',subDepartmentId:'',roleId:'',listValueId:''}]
    }
    this.addDepartmentComponent.bind(this);
    this.onStatusChange=this.onStatusChange.bind(this)
    return this;
  }

  AssignassignRoleToClusters(id){
    this.setState({
      assignFilterToClusters: this.state.assignFilterToClusters.concat([{departmentId:'',subDepartmentId:'',roleId:'',listValueId:''}])
    });
  }

  RemoveAssignassignRoleToClusters(id,event){
    let assignFilterToClusters;
    assignFilterToClusters= this.state.assignFilterToClusters.filter(function(object,index){
      return id !== index;
    });
    this.setState({
      assignFilterToClusters: assignFilterToClusters
    })
  }

  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    let filtersDepartmentData=this.props.filtersDepartmentData || [];

    filtersDepartmentData=_.map(filtersDepartmentData, function (row) {
      let val= _.omit(row, ['__typename']);
      return val;
    });
    if(filtersDepartmentData && filtersDepartmentData.length>0){
      let availabilityDetailsForm=[]
      for(let i=0;i<filtersDepartmentData.length;i++){
        let json={
          departmentId:filtersDepartmentData[i].departmentId,
          subDepartmentId:filtersDepartmentData[i].subDepartmentId,
          roleId : filtersDepartmentData[i].roleId,
          listValueId:filtersDepartmentData[i].listValueId,
        }
        availabilityDetailsForm.push(json)
      }
      this.setState({assignFilterToClusters:availabilityDetailsForm})
      this.props.getRolesData(this.state.assignFilterToClusters)
    }
  }

/*  optionsBySelectCluster(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['cluster']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getassignFilterToClusters(this.state.assignFilterToClusters)
  }

  optionsBySelectChapter(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['chapter']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getassignFilterToClusters(this.state.assignFilterToClusters)
  }

  optionsBySelectSubChapter(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['subChapter']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getassignFilterToClusters(this.state.assignFilterToClusters)
  }*/

  optionsBySelectDepartment(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['departmentId']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getRolesData(this.state.assignFilterToClusters)
  }

  optionsBySelectSubDepartment(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['subDepartmentId']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getRolesData(this.state.assignFilterToClusters)
  }

  optionsBySelectRole(index, selectedIndex){
    let availabilityDetails=this.state.assignFilterToClusters
    availabilityDetails[index]['roleId']=selectedIndex
    this.setState({assignFilterToClusters:availabilityDetails})
    this.props.getRolesData(this.state.assignFilterToClusters)
  }

  optionsBySelectValue(id,resolverName,val){
    let details = this.state.assignFilterToClusters
    if(details[id]){
      details[id]["listValueId"] = val;
    }
    this.setState({assignFilterToClusters:details})
    this.props.getRolesData(this.state.assignFilterToClusters)

  }

  addDepartmentComponent(event) {

    var mySwiper = new Swiper('.blocks_in_form', {
      // speed: 400,
      pagination: '.swiper-pagination',
      spaceBetween: 0,
      slidesPerView:'auto',
      freeMode:true,
      paginationClickable: false
    });
    mySwiper.updateContainerSize()
    this.setState({
      assignFilterToClusters: this.state.assignFilterToClusters.concat([{departmentId:'',subDepartmentId:'',roleId:'',listValueId:''}])
    });

  }
  onStatusChange(id,event){
    let filedName=event.target.name
    let fieldValue=event.target.value;
    if(filedName=='isActive'){
      fieldValue=event.target.checked;
    }
    let departmentDetails=this.state.assignFilterToClusters

    departmentDetails[id][filedName]=fieldValue
    this.setState({assignFilterToClusters:departmentDetails})
   /* this.props.getassignFilterToClusters(this.state.assignFilterToClusters)*/
  }



  render() {
    let that=this;
    let departmentqueryOptions=''
    let queryOptions={options: { variables: {searchQuery:null}}};
    let listOptions = null;

/*    let clusterQuery=gql` query{
      data:fetchActiveClusters{label:countryName,value:_id}
    }
    `;
    let chapterQuery=gql`query($id:String){
    data:fetchChapters(id:$id) {
      value:_id
      label:chapterName
      }
    }`;
    let subChapterQuery=gql`query($id:String){
      data:fetchSubChaptersForRegistration(id:$id) {
        value:_id
        label:subChapterName
      }
    }`;
    let fetchcommunities = gql` query{
      data:fetchCommunityDefinition{label:name,value:code}
    }
    `;
    let departmentQuery=gql`query($cluster:String,$chapter:String,$subChapter:String){
      data:fetchDepartmentsForRegistration(cluster:$cluster,chapter:$chapter,subChapter:$subChapter) {
        value:_id
        label:displayName
      }
    }`;
    let subDepartmentQuery=gql`query($id:String){
      data:fetchSubDepartmentsForRegistration(id:$id) {
        value:_id
        label:displayName
      }
    }`;
    let roleQuery=gql`query($cluster:String,$chapter:String,$subChapter:String,$department:String,$subDepartment:String){
      data:fetchRolesForRegistration(cluster:$cluster,chapter:$chapter,subChapter:$subChapter,department:$department,subDepartment:$subDepartment) {
        value:_id
        label:displayName
      }
    }`;*/

    let listQuery=gql`query($moduleName:String!){
      data:fetchFilterListDropDown(moduleName:$moduleName) {
       label
        value
      }
    }`;

    let departmentQuery=gql`query{  
      data:fetchDepartments{
        value:_id
        label:displayName
      }  
    }`;

    let subDepartmentQuery=gql`query($id:String){
      data:fetchSubDepartmentsForRegistration(id:$id) {
        value:_id
        label:displayName
      }
    }`;

    let roleQuery=gql`query($cluster:String,$chapter:String,$subChapter:String,$department:String,$subDepartment:String){
      data:fetchRolesForRegistration(cluster:$cluster,chapter:$chapter,subChapter:$subChapter,department:$department,subDepartment:$subDepartment) {
        value:_id
        label:displayName
      }
    }`;




    return (

      <div>


        {that.state.assignFilterToClusters.map(function(assignCluster,id){

/*
          let chapterOption={options: { variables: {id:assignCluster.cluster}}};
          let subChapterOption={options: { variables: {id:assignCluster.chapter}}}
          let departmentOption={options: { variables: {cluster:assignCluster.cluster,chapter:assignCluster.chapter,subChapter:assignCluster.subChapter}}}
          let subDepartmentOption={options: { variables: {id:assignCluster.department}}};
          let roleOption={
            options: {
              variables: {
                cluster:assignCluster.cluster,
                chapter:assignCluster.chapter,
                subChapter:assignCluster.subChapter,
                department:assignCluster.department,
                subDepartment:assignCluster.subDepartment,

              }}};*/
          if(that.props.moduleName){
            listOptions={options: { variables: {moduleName:that.props.moduleName}}}
          }else{
            listOptions={options: { variables: {moduleName:''}}}
          }

          let subDepartmentOption={options: { variables: {id:assignCluster.departmentId}}};
          let roleOption={
            options: {
              variables: {
                cluster:'',
                chapter:'',
                subChapter:'',
                department:assignCluster.departmentId,
                subDepartment:assignCluster.subDepartmentId,

              }}};


          return(

            <div className="col-lg-12"  key={id}>
            <div className="panel panel-default nomargin" >
              <div className="panel-heading">Assign Role{id==0?(<div className="pull-right block_action" onClick={that.AssignassignRoleToClusters.bind(that,id)}><img src="/images/add.png"/></div>):(<div className="pull-right block_action" onClick={that.RemoveAssignassignRoleToClusters.bind(that,id)}><img src="/images/remove.png"/></div>)}
              </div>

                <div className="panel-body">

                  {/*<Moolyaselect multiSelect={false} placeholder="Select Cluster" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.cluster} queryType={"graphql"} query={clusterQuery}  isDynamic={true} id={'country'+id} onSelect={that.optionsBySelectCluster.bind(that,id)} />



                    <Moolyaselect multiSelect={false} placeholder="Select Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.chapter} queryType={"graphql"} query={chapterQuery}  isDynamic={true} id={'chapter'+id} reExecuteQuery={true} queryOptions={chapterOption} onSelect={that.optionsBySelectChapter.bind(that,id)} />


                    <Moolyaselect multiSelect={false} placeholder="Select SubChapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.subChapter} queryType={"graphql"} query={subChapterQuery}  isDynamic={true} id={'subChapter'+id} reExecuteQuery={true} queryOptions={subChapterOption} onSelect={that.optionsBySelectSubChapter.bind(that,id)} />

*/}
                    <Moolyaselect multiSelect={false} placeholder="Select Department" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.departmentId} queryType={"graphql"} query={departmentQuery}  isDynamic={true} id={'department'+id} onSelect={that.optionsBySelectDepartment.bind(that,id)} />


                    <Moolyaselect multiSelect={false} placeholder="Select SubDepartment" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.subDepartmentId} queryType={"graphql"} query={subDepartmentQuery}  isDynamic={true} id={'subDepartment'+id} reExecuteQuery={true} queryOptions={subDepartmentOption}  onSelect={that.optionsBySelectSubDepartment.bind(that,id)} />


                    <Moolyaselect multiSelect={true} placeholder="Select Role" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.roleId} queryType={"graphql"} query={roleQuery}  isDynamic={true} id={'role'+id} reExecuteQuery={true} queryOptions={roleOption}  onSelect={that.optionsBySelectRole.bind(that,id)} />

                {/*<div className="form-group switch_wrap inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" name={'isActive'} checked={assignCluster.isActive} onChange={that.onStatusChange.bind(that,id)} />
                    <div className="slider"></div>
                  </label>
                </div>*/}


                      <Moolyaselect multiSelect={true} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.listValueId} queryType={"graphql"} query={listQuery} reExecuteQuery={true} queryOptions={listOptions}  isDynamic={true} id={'list'+id}  onSelect={that.optionsBySelectValue.bind(that,id,that.props.moduleName)} />

                </div>
            </div>
            </div>
          )})}
      </div>

    )
  }
};

