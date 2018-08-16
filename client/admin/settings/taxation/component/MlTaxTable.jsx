import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import  MlAssignTaxInformation from './MlAssignTaxInformation'
import {findTaxTypeDetailsActionHandler} from '../actions/findTaxTypeDetailsAction'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
export default class MlTaxTable extends Component {
  constructor(props){
    super(props);
    this.state={
      taxTypeInfo:[{taxId:'',taxName:'',taxPercentage:'',applicableStates:'',statesInfo:[],aboutTax:''}]
    }
    this.onGetTaxDetails=this.onGetTaxDetails.bind(this)
    return this;
  }
  componentWillMount() {
      let taxTableDetails=this.props.taxTableDetails
    if(taxTableDetails){
      let taxInfo = []
      for (let i = 0; i < taxTableDetails.length; i++) {
        let json = {
          taxName: taxTableDetails[i].taxName,
          taxPercentage: taxTableDetails[i].taxPercentage,
          applicableStates: taxTableDetails[i].applicableStates,
          taxId:taxTableDetails[i].taxId,
          aboutTax:taxTableDetails[i].aboutTax,
          statesInfo:taxTableDetails[i].statesInfo
        }
        taxInfo.push(json)
      }
      this.setState({'taxTypeInfo':taxInfo})
    }else{
      const resp=this.findTaxTypDetails();
      return resp;
    }

  }
  onGetTaxDetails(taxDetails){
    console.log(taxDetails)
   // console.log(taxName)
    let states=[];
    let percentages=[];
    for(let i=0;i<taxDetails.length;i++){
      if(taxDetails[i].isChecked){
        states.push(taxDetails[i].stateName)
        percentages.push(taxDetails[i].taxPercentage)
      }

    }
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };

    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };

    let taxTypeInfoDetails=this.state.taxTypeInfo
    for(let i=0;i<taxTypeInfoDetails.length;i++){
      if(taxDetails.length>0){
        if (taxTypeInfoDetails[i].taxId==taxDetails[0].taxId){
          taxTypeInfoDetails[i].statesInfo=taxDetails;
          taxTypeInfoDetails[i].applicableStates=states
          taxTypeInfoDetails[i].taxPercentage=percentages.min()+"-"+percentages.max()+"%"
        }
      }

    }
    this.setState({taxTypeInfo:taxTypeInfoDetails})
    this.props.getTaxTableDetails(this.state.taxTypeInfo)
  }
  async findTaxTypDetails() {
        let taxDetails = await findTaxTypeDetailsActionHandler();
        let taxInfo = []
        for (let i = 0; i < taxDetails.length; i++) {
          let json = {
            taxName: taxDetails[i].taxTypeInfo.taxName,
            taxPercentage: '',
            applicableStates: '',
            taxId:taxDetails[i]._id,
            aboutTax:taxDetails[i].taxTypeInfo.aboutTax,
            statesInfo:[]
          }
          taxInfo.push(json)
        }
    this.setState({'taxTypeInfo':taxInfo})
  }

  isExpandableRow(row) {
    if (row.taxId!=undefined) return true;
    else return false;
  }


  expandComponent(row) {
    return (
     <MlAssignTaxInformation id={ row.taxId }  onGetTaxDetails={this.onGetTaxDetails} statesInfo={row.statesInfo} about={row.aboutTax} taxName={row.taxName}/>
    );
  }
  render() {
    const options = {
     expandRowBgColor: 'rgb(242, 255, 163)'
    };
    const selectRow = {
      mode: 'checkbox',
      bgColor: '#feeebf',
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true  // click to expand row, default is false// click to expand row, default is false
    }
    return (
      <BootstrapTable  data={ this.state.taxTypeInfo }
                       options={ options }
                       expandableRow={ this.isExpandableRow }
                       expandComponent={ this.expandComponent.bind(this) }
                       selectRow={ selectRow }
                       pagination
                       hover={true}
      >
        <TableHeaderColumn dataField="taxId" isKey={true} dataSort={true} width='62px' dataAlign='center'>Id</TableHeaderColumn>
        <TableHeaderColumn dataField="taxName">Tax Name</TableHeaderColumn>
        <TableHeaderColumn dataField="taxPercentage">Percentage</TableHeaderColumn>
        <TableHeaderColumn dataField="applicableStates">Applicable States</TableHeaderColumn>
      </BootstrapTable>

    )
  }
};

