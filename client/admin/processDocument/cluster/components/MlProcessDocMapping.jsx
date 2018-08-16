/**
 * @author updated 'vishwadeep' 19/2/18
 */
import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {findDocumentMappingActionHandler} from '../actions/findDocumentMappingAction'
import DocumentActiveComponent from "./DocumentActiveComponent";
import MandatoryProcessDocFormatter from "./MandatoryProcessDocFormatter";
import { findProcessDocActionHandler } from '../actions/findProcessDocAction';

import _ from 'underscore'
import moment from 'moment'
export default class MlProcessDocMapping extends Component {
    constructor(props){
      super(props);

      this.state={
        documentInfo:[],
        processDocumentsList:[],
        response: {}
      }
      this.findDocument=this.findDocument.bind(this);
      this.getUpdatedData = this.getUpdatedData.bind(this);
      return this;
    }

  componentDidMount() {

  }
  componentWillMount(){
  //  console.log(this.props.config);
    // this.findProcessDocument();
    const processResp=this.findDocument();
    return processResp;
  }

  async findDocument() {
   /* const respProcessDoc=findProcessDocument();
    console.log(respProcessDoc)*/
    let kycId = this.props.kycConfig
    let docTypeId =this.props.docConfig
    let processId=this.props.processConfig
    const response = await findDocumentMappingActionHandler(kycId,processId);
    if(response){
      let documentDetails=[]
      //let processDocumentsList=this.state.processDocumentsList
      for(let i=0;i<response.length;i++){
        let json = {
          Id:response[i]._id,
          Name: response[i].documentName,
          DocType:response[i].documentType,
          Formate: response[i].allowableFormat,
          MaxSize: response[i].allowableMaxSize,
          Validity : response[i]&&response[i].validity?moment(response[i].validity).format('MM-DD-YYYY') : null
        }
        documentDetails.push(json);
      }

      this.setState({"documentInfo":documentDetails})
    }
  }

  /**
   * @func called after the child mounting
   */
  async findProcessDocument() {
    const { processConfig } = this.props;
    const response = await findProcessDocActionHandler(processConfig);
    this.setState({ response })
  }

  /**
   * @func calling from the child component
   */
  getUpdatedData() {
    this.findProcessDocument();
  }

  SwitchBtn(cell, row){
    const { processConfig, kycConfig, docConfig } = this.props;
    return <DocumentActiveComponent response={this.state.response} getUpdatedData={this.getUpdatedData} data={row} processConfig={processConfig} kycConfig={kycConfig} docTypeConfig={docConfig} />;
    // return <DocumentActiveComponent response={this.state.response} getUpdatedData={this.getUpdatedData} data={row} processConfig={this.props.processConfig} kycConfig={this.props.kycConfig} docTypeConfig={this.props.docConfig}/>;
  }
  SwitchMandatoryBtn(cell, row){
    const { processConfig, kycConfig, docConfig } = this.props;
    return <MandatoryProcessDocFormatter response={this.state.response} getUpdatedData={this.getUpdatedData} data={row} processConfig={processConfig} kycConfig={kycConfig} docTypeConfig={docConfig} />;
    // return <MandatoryProcessDocFormatter response={this.state.response} getUpdatedData={this.getUpdatedData} data={row} processConfig={this.props.processConfig} kycConfig={this.props.kycConfig} docTypeConfig={this.props.docConfig}/>;
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };

    return (

      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <BootstrapTable  data={ this.state.documentInfo }
                           options={ options }

                           pagination
          >
            {/*<TableHeaderColumn dataField="docId" isKey={true} dataSort={true} width='62px' dataAlign='center'>Id</TableHeaderColumn>*/}
            <TableHeaderColumn  dataField="Id" hidden={true}>Id</TableHeaderColumn>
            <TableHeaderColumn  isKey={true} dataField="Name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="DocType">DocType</TableHeaderColumn>
            <TableHeaderColumn dataField="Formate">Format</TableHeaderColumn>
            <TableHeaderColumn dataField="MaxSize">MaxSize</TableHeaderColumn>
            <TableHeaderColumn dataField="Validity">Validity</TableHeaderColumn>
            <TableHeaderColumn dataField="Mandatory" dataFormat={this.SwitchMandatoryBtn.bind(this)}>Mandatory</TableHeaderColumn>
            <TableHeaderColumn dataField="Active" dataFormat={this.SwitchBtn.bind(this)}>Action</TableHeaderColumn>
          </BootstrapTable>



        </div>


      </div>
    )
  }
}
