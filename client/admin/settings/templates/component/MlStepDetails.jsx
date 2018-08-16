import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {findStepTemplatesActionHandler} from '../actions/findTemplatesAction'
import FontAwesome from 'react-fontawesome'
import ActiveFormater from './ActiveFormater'
import moment from 'moment';
import _ from 'underscore'
import {OnToggleSwitch,initalizeFloatLabel,passwordVisibilityHandler} from '../../../utils/formElemUtil';
export default class MlStepDetails extends Component {
    constructor(props){
      super(props);

      this.state={
        templateInfo:[]
      }
     // this.findDocument=this.findDocument.bind(this);
      return this;
    }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }
  componentWillMount(){
    const processResp=this.findDocument();
    return processResp;
  }

  async findDocument() {
    let templateId = this.props.templateId
    const response = await findStepTemplatesActionHandler(templateId,this.props.stepCode);
    console.log(response)
    if(response){
      let assignedTemplates = response.templates
      let documentDetails=[]
      for(let i=0;i<assignedTemplates.length;i++){
        let json = {
          templateCode:assignedTemplates[i].templateCode,
          date: moment(assignedTemplates[i].createdDate).format(Meteor.settings.public.dateFormat),
          templateName: assignedTemplates[i].templateName,
          isActive:assignedTemplates[i].isActive,
          view: 'Yes',
          templateImage:assignedTemplates[i].templateImage
        }
        documentDetails.push(json);
      }
      this.setState({"templateInfo":documentDetails})
    }
  }
  showTemplateImage(row){
    window.open(row.templateImage)
  }
  showEyeButton(cell, row){
    return    (<div>

        <FontAwesome  onClick={this.showTemplateImage.bind(this,row)} name='eye fa-4x"'/>

    </div>);
  }
  SwitchBtn(cell, row){
    return <ActiveFormater data={row} subProcessConfig={this.props.subProcessConfig} stepCode={this.props.stepCode} templateId={this.props.templateId}/>;
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };
    const selectRow = {
      mode: 'radio',
      bgColor: '#feeebf',
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true   // click to expand row, default is false// click to expand row, default is false
    }

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Details</h2>
          <BootstrapTable  data={ this.state.templateInfo }
                           options={ options }
                           selectRow={ selectRow }
                           pagination>
            <TableHeaderColumn  dataField="Id" hidden={true}>Id</TableHeaderColumn>
            <TableHeaderColumn  dataField="date">Date</TableHeaderColumn>
            <TableHeaderColumn  isKey={true}  dataField="templateName">Template Name</TableHeaderColumn>
            <TableHeaderColumn  dataField="view"  dataFormat={this.showEyeButton.bind(this)}>View</TableHeaderColumn>
            <TableHeaderColumn  dataField="isActive"  dataFormat={this.SwitchBtn.bind(this)}>Status</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    )
  }
}
