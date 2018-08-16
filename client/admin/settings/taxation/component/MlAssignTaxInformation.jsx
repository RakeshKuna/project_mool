import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import {findClusterBasedStatesDeatilsActionHandler} from '../actions/findClusterBasedStatesAction'
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
export default class MlAssignTaxInformation extends Component {
  constructor(props){
    super(props);
    this.state={
      states:[{stateName:'',isChecked:null,taxPercentage:'',taxId:''}]
    }
    return this;
  }
  componentDidMount() {
    initalizeFloatLabel();
    this.props.onGetTaxDetails(this.state.states)
  }
  componentWillMount(){
    let selectaxName=this.props.id
    this.setState({taxId:selectaxName})
    let StatesInfoDetails=this.props.statesInfo
    if(StatesInfoDetails.length>0){
      let statesInfo=[]
      for(i=0;i<StatesInfoDetails.length;i++){
        let json={
          stateName:StatesInfoDetails[i].stateName,
          isChecked:StatesInfoDetails[i].isChecked,
        taxPercentage:StatesInfoDetails[i].taxPercentage,
          taxId:StatesInfoDetails[i].taxId
        }
        statesInfo.push(json)
      }
      this.setState({"states":statesInfo})
    }else{
      const resp=this.findClusterBasedStates();
      return resp;
    }
  }
  async findClusterBasedStates() {
    let stateDetails = await findClusterBasedStatesDeatilsActionHandler();
    //this.setState({states:stateDetails})
    let stateInfo = []
    for (let i = 0; i < stateDetails.length; i++) {
      let json = {
        stateName: stateDetails[i].name,
        isChecked:null,
        taxPercentage:'',
        taxId:this.props.id
      }
      stateInfo.push(json)
    }
    this.setState({'states':stateInfo})
  }
  onSelectTaxType(value){
    this.setState({taxId:value})
  }
  onSelectState(id,event){
   if(event.currentTarget.checked){
     let  stateDetails=this.state.states
     stateDetails[id]['isChecked']=true;
     this.setState({'states':stateDetails})
     this.props.onGetTaxDetails(this.state.states)
   }else{
     let  stateDetails=this.state.states
     stateDetails[id]['isChecked']=false;
     this.setState({'states':stateDetails})
     this.props.onGetTaxDetails(this.state.states)
   }

   }
  ontaxPercentage(index,event){
    let  stateDetails=this.state.states
    stateDetails[index]['taxPercentage']=event.target.value;
    this.setState({'taxPercentage':stateDetails})
    this.props.onGetTaxDetails(this.state.states)
  }
  render() {
    let taxQuery=gql`query{
 data: fetchMasterSettingsForDropDown(type:TAXTYPE) {
    label
    value
  }
}
`;
    console.log(taxQuery)
    let that=this;

      return (
        <div className="ml_tabs" id={that.props.id}>

          <ul className="nav nav-pills" role="tablist">
            <li role="presentation" className="active">
              <a href={`#home${that.props.id}`} aria-controls="home" role="tab" data-toggle="tab">Tax
              Information</a></li>
            <li role="presentation">
              <a href={`#profile${that.props.id}`} aria-controls="profile" role="tab" data-toggle="tab">Applicable
              States</a></li>
          </ul>
          <div className="tab-content clearfix">
            <div role="tabpanel" className="tab-pane active" id={`home${this.props.id}`}>
              <div className="padding_wrap">
                <div className="col-md-3">
                  <div className="form-group">
                    {/*<Select name="form-field-name"value="select"options={options} className="float-label"/>*/}
                    {/*<Moolyaselect multiSelect={false} className="float-label" valueKey={'value'} labelKey={'label'} placeholder="Tax Name" selectedValue={this.state.taxId} queryType={"graphql"} query={taxQuery} isDynamic={true}  onSelect={this.onSelectTaxType.bind(this)}/>*/}
                  <input type="text" placeholder="Tax Name" className="form-control float-label" value={that.props.taxName} readOnly/>
                    </div>
                </div>
                <div className="col-md-9">
                  <div className="form-group">

                    <textarea placeholder="About" className="form-control float-label" id="cl_about" value={that.props.about} readOnly>

                        </textarea>

                  </div>
                </div>
            </div>
            </div>
            <div role="tabpanel" className="tab-pane" id={`profile${this.props.id}`}>
              <ul>
                {that.state.states.map(function (options,id) {
                  return( <li key={options.stateName}>
                      <div className="form-group">
                        <div className="input_types">
                          <input type="checkbox" checked={options.isChecked} onChange={that.onSelectState.bind(that,id)}  />
                          <label htmlFor="checkbox1"><span></span>{options.stateName}</label>
                        <input type="text" placeholder="%" defaultValue={options.taxPercentage} onBlur={that.ontaxPercentage.bind(that,id)} id="cluster_name"/>
                        </div>
                        </div>
                    </li>
                  )
                })

                }
              </ul>

            </div>
          </div>

        </div>


      )
  }
        }
