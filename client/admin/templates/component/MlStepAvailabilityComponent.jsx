import React from "react";
import {render} from "react-dom";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'

export default class MlStepAvailabilityComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      stepAvailability:[{stepCode: null,templateCode:null,stepName:null,templateName:null}]
    }
    return this;
  }
  componentDidMount() {
    this.props.getStepAvailability(this.state.stepAvailability);
  }
  componentWillMount(){
    let stepAvailability = this.props.stepDetails
    if(stepAvailability){
      let stepDetails=[]
      for(let i=0;i<stepAvailability.length;i++){
        let json={
          stepCode      : stepAvailability[i].stepCode,
          templateCode  : stepAvailability[i].templateCode,
          stepName      : stepAvailability[i].stepName,
          templateName  : stepAvailability[i].templateName,
        }
        stepDetails.push(json)
      }
      this.setState({stepAvailability: stepDetails})
    }
  }

  AssignStep(idx){
    this.setState({
      stepAvailability: this.state.stepAvailability.concat([{ stepCode:null,templateCode:null,stepName:null,templateName:null}])
    });
  }

  RemovestepAvailability(idx,event){
    let stepAvailability;
    stepAvailability= this.state.stepAvailability.filter(function(object,index){
      return idx !== index;
    });
    this.setState({
      stepAvailability: stepAvailability
    })
    this.props.getStepAvailability(stepAvailability);
  }

  optionsBySelectStep(index,value, calback,selObject){
    if(value) {
      let stepAvailability = this.state.stepAvailability
      stepAvailability[index]['stepCode'] = value
      stepAvailability[index]['stepName'] = selObject.label
      this.setState({stepAvailability: stepAvailability})
      this.props.getStepAvailability(this.state.stepAvailability);
    }
    else{
      let stepAvailability = this.state.stepAvailability
      stepAvailability[index]['stepCode'] = value
      stepAvailability[index]['stepName'] = null
      this.setState({stepAvailability: stepAvailability})
      this.props.getStepAvailability(this.state.stepAvailability);
    }
  }


  optionsBySelecttemplate(index,value, calback,selObject){
    if(value){
      let stepAvailability = this.state.stepAvailability
      stepAvailability[index]['templateCode'] = value
      stepAvailability[index]['templateName'] = selObject.label
      this.setState({stepAvailability: stepAvailability})
      this.props.getStepAvailability(this.state.stepAvailability);
    }else{
      let stepAvailability = this.state.stepAvailability
      stepAvailability[index]['templateCode'] = value
      stepAvailability[index]['templateName'] = null
      this.setState({stepAvailability: stepAvailability})
      this.props.getStepAvailability(this.state.stepAvailability);
    }
  }

  render() {
    let that=this;
    let subProcessId = this.props.subProcessConfig;
    let stepOptions ={options:{variables: {id:subProcessId}}};
    let stepQuery=gql`  
    query($id:String){  
      data:findTemplateStepsSelect(id:$id) {
        value:stepCode
        label:stepName
      }  
    }
    `;
      let templateQuery=gql`  
    query($id:String,$stepName:String){  
      data:findTemplatesSelect(id:$id,stepName:$stepName) {
        value:templateCode
        label:templateName
      }  
    }
    `;
    let stepData = that.state.stepAvailability || [];
    return(
      <div>
        {stepData.map(function(stepAvailability, idx){
          let templateOptions = {options: { variables: {id:subProcessId,stepName:stepAvailability.stepName}}};
          return(
            <div className="panel panel-default" key={idx}>
              <div className="panel-heading"> Assign Step{idx==0&&(<div className="pull-right block_action" onClick={that.AssignStep.bind(that)}><img src="/images/add.png"/></div>)}
                {idx>0&&(<div className="pull-right block_action" onClick={that.RemovestepAvailability.bind(that,idx)}><img src="/images/remove.png"/></div>)}
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Select Step"  selectedValue={stepAvailability.stepCode} queryType={"graphql"} query={stepQuery} queryOptions={stepOptions}  isDynamic={true}  onSelect={that.optionsBySelectStep.bind(that,idx)} />
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Select Template"  selectedValue={stepAvailability.templateCode} queryType={"graphql"} query={templateQuery} queryOptions={templateOptions}  reExecuteQuery={true}  isDynamic={true} onSelect={that.optionsBySelecttemplate.bind(that,idx)} />
                </div>
              </div>
            </div>
          )}
        )}
      </div>
    )
  }
};

