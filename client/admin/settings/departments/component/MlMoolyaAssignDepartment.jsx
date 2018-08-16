import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
export default class MlMoolyaAssignDepartment extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedValue:null,
      departmentAvailability:[{cluster: [],chapter:'all',subChapter:'all',email:'',isActive:true }]
    }
    /**making the status default active as no provision is there to activate the department when it is moolya*/
    return this;
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
    this.props.getMoolyaDepartmentAvailability(this.state.departmentAvailability)
  }
  componentWillMount(){
    let availabilityDetails=this.props.moolya

    if(availabilityDetails){
      let  availabilityDetailsForm=[{
        cluster :availabilityDetails[0].cluster,
        chapter:'all',
        subChapter:'all',
        email:availabilityDetails[0].email,
        isActive:availabilityDetails[0].isActive

      }]
      this.setState({departmentAvailability:availabilityDetailsForm})
    }
  }
  optionsBySelectCluster(index, selectedIndex){
    let availabilityDetails=this.state.departmentAvailability
    console.log("Selected--"+availabilityDetails);
    availabilityDetails[index]['cluster'] = selectedIndex;
    this.setState({departmentAvailability:availabilityDetails})
    this.props.getMoolyaDepartmentAvailability(this.state.departmentAvailability)
  }


  onChange(id,event){
    let filedName=event.target.name
    let fieldValue=event.target.value;
    if(filedName=='isActive'){
      fieldValue=event.target.checked;
    }
    let departmentDetails=this.state.departmentAvailability

    departmentDetails[id][filedName]=fieldValue
    this.setState({departmentAvailability:departmentDetails})
    this.props.getMoolyaDepartmentAvailability(this.state.departmentAvailability)
  }
  onEmailChange(index,event){
    let availabilityDetails=this.state.departmentAvailability
    availabilityDetails[index]['email']=event.target.value;
    this.setState({departmentAvailability:availabilityDetails})
    this.props.getMoolyaDepartmentAvailability(this.state.departmentAvailability)
  }


  render() {
    let that=this;
    let clusterQuery=gql` query{
  data:fetchActiveClusters{label:countryName,value:_id}
}
`;
    return (

      <div>
        {that.state.departmentAvailability.map(function(options,id){
          return(
            <div className="panel panel-default" key={id}>
                <div className="panel-heading">Assign Department<div className="pull-right block_action"></div></div>
                <div className="panel-body">

                  <div className="form-group" disabled="true">
                    <Moolyaselect multiSelect={true} placeholder="Select Cluster" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={options.cluster} queryType={"graphql"} query={clusterQuery}  isDynamic={true} id={'country'+id} onSelect={that.optionsBySelectCluster.bind(that,id)} />

                  </div>

                  <div className="form-group"  disabled="true">
                    <div className="form-group">
                      <input type="text" id="" placeholder="Select Chapter" className="form-control float-label"  value="All" disabled="true"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <input type="text" id="" placeholder="Select Sub Chapter" className="form-control float-label"  value="All" disabled="true"/>
                  </div>
                  <div className="form-group">
                    <input placeholder=" Department Email Id" className="form-control float-label" defaultValue={options.email} onBlur={that.onEmailChange.bind(that,id)}/>
                  </div>
                </div>
            </div>
          )})}
      </div>
    )
  }
};

