import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Select from 'react-select';
import _ from 'lodash';

export default class MlAssignClustersToRoles extends React.Component {
  constructor(props){
      super(props);
      this.state={
         selectedValue:null,
         assignRoleToClusters:[{cluster: '',chapter:'',subChapter:'',community:'',department:'',subDepartment:'',isActive:false }]
      }
      this.addDepartmentComponent.bind(this);
      this.onStatusChange=this.onStatusChange.bind(this)
      return this;
  }

  AssignassignRoleToClusters(id){
    this.setState({
      assignRoleToClusters: this.state.assignRoleToClusters.concat([{cluster: '',chapter:'',subChapter:'',community:'',department:'',subDepartment:'',isActive:false }])
    }, function () {
      setTimeout(function () {
        this.context.scrollArea.refresh();
        this.context.scrollArea.scrollBottom();
      }.bind(this));
    });
  }

  RemoveAssignassignRoleToClusters(id,event){
    let assignRoleToClusters;
    assignRoleToClusters= this.state.assignRoleToClusters.filter(function(object,index){
      return id !== index;
    });
    this.setState({
      assignRoleToClusters: assignRoleToClusters
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
    this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
  }
  componentWillMount() {
    let assignedClusterDetails=this.props.assignedClusterDetails
    if(assignedClusterDetails){
      let assignedClusterDetailsForm=[]
      for(let i=0;i<assignedClusterDetails.length;i++){
        let json={
          cluster:assignedClusterDetails[i].cluster,
          chapter:assignedClusterDetails[i].chapter,
          subChapter:assignedClusterDetails[i].subChapter,
          community:assignedClusterDetails[i].community,
          department:assignedClusterDetails[i].department,
          subDepartment:assignedClusterDetails[i].subDepartment,
          isActive:assignedClusterDetails[i].isActive
        }
        assignedClusterDetailsForm.push(json)
      }
      this.setState({assignRoleToClusters:assignedClusterDetailsForm})
    }
  }
  optionsBySelectCluster(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['cluster']=selectedIndex;
    availabilityDetails[index]['chapter'] = null;
    availabilityDetails[index]['subChapter'] = null;
    availabilityDetails[index]['community'] = null;
    availabilityDetails[index]['department'] = null;
    availabilityDetails[index]['subDepartment'] = null;
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd) {
      this.setState({assignRoleToClusters: availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['cluster']=""
      toastr.error("Role already exists")
    }
  }

  optionsBySelectChapter(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['chapter']=selectedIndex
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd) {
      this.setState({assignRoleToClusters: availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['chapter']=""
      toastr.error("Role already exists")
    }
  }

  optionsBySelectSubChapter(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['subChapter']=selectedIndex
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd) {
      this.setState({assignRoleToClusters: availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['subChapter']=""
      toastr.error("Role already exists")
    }
  }

  optionsBySelectCommunity(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['community']=selectedIndex
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd) {
      this.setState({assignRoleToClusters: availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['community']=""
      toastr.error("Role already exists")
    }
  }

  optionsBySelectDepartment(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['department']=selectedIndex
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd) {
      this.setState({assignRoleToClusters: availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['department']=""
      toastr.error("Role already exists")
    }
  }

  optionsBySelectSubDepartment(index, selectedIndex){
    let availabilityDetails=this.state.assignRoleToClusters
    availabilityDetails[index]['subDepartment']=selectedIndex
    let canAdd = this.checkAvailabilityOfRole(availabilityDetails[index])
    if(canAdd){
      this.setState({assignRoleToClusters:availabilityDetails})
      this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
    }else{
      availabilityDetails[index]['subDepartment']=""
      toastr.error("Role already exists")
    }
  }

  checkAvailabilityOfRole(role){
    role = _.omit(role, "isActive");
    let roleObj = _.filter(this.state.assignRoleToClusters, role);
    if(roleObj&&roleObj.length>1){
      return false
    }else{
      return true
    }

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
      assignRoleToClusters: this.state.assignRoleToClusters.concat([{cluster: '',chapter:'',subChapter:'',community:'',email:'',isActive:false }])
    });

  }
  onStatusChange(id,event){
    let filedName=event.target.name
    let fieldValue=event.target.value;
    if(filedName=='isActive'){
      fieldValue=event.target.checked;
    }
    let departmentDetails=this.state.assignRoleToClusters

    departmentDetails[id][filedName]=fieldValue
    this.setState({assignRoleToClusters:departmentDetails})
    this.props.getassignRoleToClusters(this.state.assignRoleToClusters)
  }


  render() {
    let that=this;
    let departmentqueryOptions=''
    let queryOptions={options: { variables: {searchQuery:null}}};
    let departmentQuery=gql` query($isMoolya:Boolean,$clusterId:String){
            data:fetchMoolyaBasedDepartmentRoles(isMoolya:$isMoolya,clusterId:$clusterId){label:displayName,value:_id}
          }
          `;
    let clusterquery=gql`query{ data:fetchActiveClusters{label:countryName,value:_id}}`;
    let chapterquery=gql`query($id:String){  
    data:fetchChapters(id:$id) {
        value:_id,
        label:displayName
      }  
    }`;

    let subDepartmentquery=gql`query($id:String){  
      data:fetchSubDepartments(id:$id) {
        value:_id
        label:displayName
      }  
    }`;
      let subChapterquery=gql`query($chapterId:String,$clusterId:String){
        data:fetchSubChaptersSelectMoolya(chapterId:$chapterId,clusterId:$clusterId) {
          value:_id
          label:subChapterDisplayName
        }
      }`;


    let communityQuery=gql`query($clusterId:String, $chapterId:String, $subChapterId:String){  
      data:fetchCommunitiesForRolesSelect(clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId) {
          value:code    
          label:name
      }  
    }`;

    let selectedUserType=this.props.selectedBackendUserType
    // let selectedSubChapter=this.props.selectedSubChapter
    if(selectedUserType=='moolya'){
      departmentQuery=gql`  query($isMoolya:Boolean,$clusterId:String){
            data:fetchMoolyaBasedDepartmentRoles(isMoolya:$isMoolya,clusterId:$clusterId){label:displayName,value:_id}
          }
          `;
       subChapterquery=gql`query($chapterId:String,$clusterId:String){  
        data:fetchSubChaptersSelectMoolya(chapterId:$chapterId,clusterId:$clusterId) {
          value:_id
          label:subChapterName
        }  
      }`;
    }
    // if(selectedUserType=='non-moolya'&&selectedSubChapter==''){
    //   clusterquery = [];
    // }

    //&&selectedSubChapter!=''
    if(selectedUserType=='non-moolya'){
      departmentQuery=gql` query($isMoolya:Boolean,$clusterId:String,$subChapter:String){
      data:fetchNonMoolyaBasedDepartment(isMoolya:$isMoolya,clusterId:$clusterId,subChapter:$subChapter){label:displayName,value:_id}
    }
    `;
      subChapterquery=gql`query($chapterId:String,$clusterId:String){  
        data:fetchSubChaptersSelectNonMoolya(chapterId:$chapterId,clusterId:$clusterId) {
          value:_id
          label:subChapterName
        }  
      }`;
    }

    return (

      <div>

        <div className="form-group"></div>
        {that.state.assignRoleToClusters.map(function(assignCluster,id){
          if(selectedUserType=='moolya') {
            departmentqueryOptions = {options: {variables: {isMoolya: true, clusterId:assignCluster.cluster}}};
          }
          if(selectedUserType=='non-moolya'&& assignCluster.subChapter!=''){
            departmentqueryOptions={options: { variables: {isMoolya:false,clusterId:assignCluster.cluster,subChapter:assignCluster.subChapter}}};
          }

          let chapterOption={options: { variables: {id:assignCluster.cluster}}};
          let subchapterOption = null;
          if(selectedUserType=='moolya'){
             subchapterOption={options: { variables: {chapterId:assignCluster.chapter,clusterId:assignCluster.cluster}}};
          {/*}else if(selectedUserType=='non-moolya'&&selectedSubChapter!=''){*/}
          }else if(selectedUserType=='non-moolya'){
             subchapterOption={options: { variables: {chapterId:assignCluster.chapter,clusterId:assignCluster.cluster}}};
          }

          let subDeparatmentOption={options: { variables: {id:assignCluster.department}}};
          let communityOption={options: { variables: {clusterId:assignCluster.cluster, chapterId:assignCluster.chapter, subChapterId:assignCluster.subChapter}}};
          return(
            <div className="panel panel-default" key={id}>
                <div className="panel-heading">Assign Role{id==0?(<div className="pull-right block_action" onClick={that.AssignassignRoleToClusters.bind(that,id)}><img src="/images/add.png"/></div>):(<div className="pull-right block_action" onClick={that.RemoveAssignassignRoleToClusters.bind(that,id)}><img src="/images/remove.png"/></div>)}</div>

                <div className="panel-body">

                  <div className="form-group">
                    <Moolyaselect multiSelect={false}  mandatory={true} placeholder="Select Cluster" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.cluster} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'country'+id} onSelect={that.optionsBySelectCluster.bind(that,id)} />
                  </div>

                  <div className="form-group">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false}  mandatory={true} placeholder="Select Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.chapter} queryType={"graphql"} query={chapterquery}  isDynamic={true} id={'chapter'+id} reExecuteQuery={true} queryOptions={chapterOption} onSelect={that.optionsBySelectChapter.bind(that,id)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} mandatory={true} placeholder="Select SubChapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.subChapter} queryType={"graphql"} query={subChapterquery}  isDynamic={true} id={'subChapter'+id} reExecuteQuery={true} queryOptions={subchapterOption} onSelect={that.optionsBySelectSubChapter.bind(that,id)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} mandatory={true} placeholder="Select Community" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.community} queryType={"graphql"} query={communityQuery}  isDynamic={true} id={'community'+id} reExecuteQuery={true} queryOptions={communityOption} onSelect={that.optionsBySelectCommunity.bind(that,id)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group">
                      { assignCluster.community && assignCluster.subChapter ?
                        <Moolyaselect multiSelect={false} mandatory={true} placeholder="Select Department" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.department} queryType={"graphql"} query={departmentQuery} queryOptions={departmentqueryOptions}  isDynamic={true} id={'department'+id} onSelect={that.optionsBySelectDepartment.bind(that,id)} />
                          :
                            <Select multi={false} placeholder="Select Department" className="float-label" valueKey={'value'} labelKey={'label'}/>
                      }
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false}  mandatory={true} placeholder="Select SubDepartment" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={assignCluster.subDepartment} queryType={"graphql"} query={subDepartmentquery}  isDynamic={true} id={'subDepartment'+id} reExecuteQuery={true} queryOptions={subDeparatmentOption}  onSelect={that.optionsBySelectSubDepartment.bind(that,id)} />
                    </div>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" name={'isActive'} checked={assignCluster.isActive} onChange={that.onStatusChange.bind(that,id)} />
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>
              </div>
          )})}
      </div>

    )
  }
};

MlAssignClustersToRoles.contextTypes = {
  scrollArea: React.PropTypes.object
};
