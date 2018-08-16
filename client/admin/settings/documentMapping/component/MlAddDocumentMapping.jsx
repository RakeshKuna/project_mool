import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
// import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import formHandler from '../../../../commons/containers/MlFormHandler'
import {addDocumentMappingActionHandler} from '../actions/addDocumentMappingAction'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
// import MlAssignDocument from './MlAssignDocument'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import Datetime from "react-datetime";
import moment from "moment";

let Select = require('react-select');

class MlAddDocumentMapping extends React.Component{
  constructor(props){
    super(props);
    this.state={
      clusters: [],
      chapters:[],
      subChapters:[],
      allowableFormat:[],
      isActive:false,
      documentId   : '',
      displayName  : '',
      validity    : null,
      length      : '',
      remark      : '',
      documentName   : '',
      kycCategory  : [],
      documentType   : [],
      allowableSize  : '',
      issuingAuthority   : '',
      allowableUnit : ''
    }
    this.addEventHandler.bind(this);
    return this;
  }
  componentDidMount()
  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }
  async addEventHandler() {
    const resp=await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/documentMappingList");
      else
        toastr.error(response.result);
    }
  };

  // getassignDocuments(details){
  //   console.log("details->"+details);
  //   this.setState({'assignDocuments':details})
  // }
  //
  //
  // onSubmit(){
  //   console.log(this.state.assignDocuments)
  // }

  async  createDocument() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let documentDetails = {
        documentDisplayName: this.refs.displayName.value,
        allowableFormat: this.state.allowableFormat,
        clusters: this.state.clusters,
        chapters: this.state.chapters,
        subChapters: this.state.subChapters,
        validity: this.state.validDate?this.state.validDate:null,
        inputLength: this.refs.length.value,
        remarks: this.refs.remark.value,
        documentName: this.refs.documentName.value,
        kycCategory: this.state.kycCategory,
        documentType: this.state.documentType,
        allowableMaxSize: this.refs.allowableSize.value+this.state.allowableUnit,
        issuingAuthority: this.refs.issuingAuthority.value,
        isActive: this.refs.status.checked,
      }
      const response = await addDocumentMappingActionHandler(documentDetails)
      toastr.success("Document mapping created successfully");
      return response;
    }
  }

  optionsBySelectAllowableFormats(val){
   /* let allowableFormat=this.state.allowableFormat
    allowableFormat[0]['id']=val;*/
    this.setState({allowableFormat:val})
  }

  optionsBySelectDocumentType(val){
   /* let documentType=this.state.documentType
    documentType[0]['id']=val;*/
    this.setState({documentType:val})
  }

  optionsByKycCategories(val){
    /*let kycCategory=this.state.kycCategory
    kycCategory[0]['id']=val;*/
    this.setState({kycCategory:val})
  }

  optionsBySelectClusters(val){
   /* let clusters=this.state.clusters
    clusters[0]['id']=val;*/
    this.setState({clusters:val})
  }

  optionsBySelectChapters(val){
   /* let chapters=this.state.chapters
    chapters[0]['id']=val;*/
    this.setState({chapters:val})
  }

  optionsBySelectSubChapters(val){
    /*let subChapters=this.state.subChapters
    subChapters[0]['id']=val;*/
    this.setState({subChapters:val})
  }

  optionsByAllowableSizeUnit(data){
    /*let subChapters=this.state.subChapters
    subChapters[0]['id']=val;*/
    let value = data&&data.value
    this.setState({allowableUnit:value})
  }

  onemploymentDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('MM-DD-YYYY 00:00:00');
      this.setState({loading: false, validDate: value});
    }
  }

  render(){
    let MlActionConfig = [
      // {
      //   actionName: 'edit',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createDocument.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/documentMappingList")
        }
      }
    ]
    // let cluster=gql`query{data:fetchClustersForMap{label:displayName,value:_id}}`;

    let clusterquery=gql`  query{
  data:fetchActiveClusters{label:countryName,value:_id}
}`;
    let chapterquery=gql`query($clusters:[String],$displayAllOption:Boolean){  
        data:fetchActiveClusterChapters(clusters:$clusters,displayAllOption:$displayAllOption) {
          value:_id
          label:chapterName
        }  
    }`;
    let subChapterquery=gql`query($chapters:[String],$clusters:[String],$displayAllOption:Boolean){  
        data:fetchActiveChaptersSubChapters(chapters:$chapters,clusters:$clusters,displayAllOption:$displayAllOption) {
          value:_id
          label:subChapterName
        }  
    }`;
    let kycCategoryquery=gql`query{  
  data:fetchKYCCategories{
    value:_id
    label:docCategoryDisplayName
  }  
}`;
    let documentTypequery=gql`query{  
  data:fetchDocumentsType{
    value:_id
    label:docTypeDisplayName   
  }  
}`;
    let documentFormatquery=gql`query{  
  data:fetchDocumentsFormat{
    value:_id
    label:docFormatDisplayName
  }  
}`;

    let chapterOption={options: { variables: {clusters:this.state.clusters,displayAllOption:true}}};
    let subChapterOption={options: { variables: {chapters:this.state.chapters,clusters:this.state.clusters,displayAllOption:true}}};

    let unitTypes = [
      {value: 'KB', label: 'KB'},
      {value: 'MB', label: 'MB'},
      {value: 'GB', label: 'GB'},
      {value: 'TB', label: 'TB'},
    ];

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Document</h2>
          <div className="main_wrap_scroll">

          <div className="col-md-6 nopadding-left">
            <div className="left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text"  ref="documentId" placeholder="DocumentId AutoGenerated" className="form-control float-label" id="" disabled={true}/>
                    </div>

                    <div className="form-group mandatory">
                      <input type="text"  ref="displayName" placeholder="Display Name" className="form-control float-label" id=""data-required={true} data-errMsg="Display Name is required"/>
                    </div>


                      <Moolyaselect ref="allowableFormat"multiSelect={true} mandatory={true} placeholder={"Allowable Format"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.allowableFormat} queryType={"graphql"} query={documentFormatquery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectAllowableFormats.bind(this)} data-required={true} data-errMsg="Format is required"/>

                    <div className="panel panel-default">
                      <div className="panel-heading">Jurisdiction</div>
                      <div className="panel-body">


                          <Moolyaselect ref="cluster" multiSelect={true} mandatory={true} placeholder={"Cluster"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'clusterquery'}  onSelect={this.optionsBySelectClusters.bind(this)} data-required={true} data-errMsg="Cluster is required"/>


                          <Moolyaselect ref="chapter" multiSelect={true} mandatory={true} placeholder={"Chapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters} queryType={"graphql"} query={chapterquery} queryOptions={chapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectChapters.bind(this)}  data-required={true} data-errMsg="Chapter is required"/>


                          <Moolyaselect ref="subChapter" multiSelect={true} mandatory={true} placeholder={"SubChapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapters} queryType={"graphql"} query={subChapterquery} queryOptions={subChapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubChapters.bind(this)}  data-required={true} data-errMsg="SubChapter is required"/>

                        <div className="form-group">
                          {/*<input type="text"  ref="validity" placeholder="Validity" className="form-control float-label" id=""/>*/}
                          <Datetime dateFormat="MM-DD-YYYY" timeFormat={false}  inputProps={{placeholder: "Validity",readOnly:true}}   closeOnSelect={true}  onChange={this.onemploymentDateSelection.bind(this)}/>
                        </div>
                        <div className="form-group">
                          <input type="text"  ref="length" placeholder="Length" className="form-control float-label" id=""/>
                        </div>
                        <div className="form-group">
                          <input type="text"  ref="remark" placeholder="Remark" className="form-control float-label" id=""/>
                        </div>
                        <div className="form-group switch_wrap inline_switch">
                          <label className="">Status</label>
                          <label className="switch">
                            <input type="checkbox" ref="status"/>
                            <div className="slider"></div>
                          </label>
                        </div>
                      </div>
                    </div>


                  </form>
                </div>
              </Scrollbars>
            </div>
          </div>
          <div className="col-md-6 nopadding-right"  >
            <div className="form_bg">
              <form>
            <div className="form-group mandatory">
              <input type="text"  ref="documentName" placeholder="Name" className="form-control float-label" id="" data-required={true} data-errMsg="Name is required"/>
            </div>
            <div className="form-group">
              <Moolyaselect  ref="kycCategory"multiSelect={true}  mandatory={true} placeholder={"KYC Categories"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.kycCategory} queryType={"graphql"} query={kycCategoryquery}  isDynamic={true} id={'query'} onSelect={this.optionsByKycCategories.bind(this)}  data-required={true} data-errMsg="KYC Category is required"/>
            </div>
            <div className="form-group">
              <Moolyaselect ref="documentType" multiSelect={true} mandatory={true} placeholder={"Type of Document"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.documentType} queryType={"graphql"} query={documentTypequery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectDocumentType.bind(this)} data-required={true} data-errMsg="Document Type is required" />
            </div>
                <div className="col-md-8 nopadding-left">
                  <div className="form-group mandatory">
                    <input type="text"  ref="allowableSize" placeholder="Allowable Size" className="form-control float-label" id="" data-required={true} data-errMsg="Size is required"/>
                  </div>
                </div>
                <div className="col-md-4 nopadding-right">
                  <div className="form-group mandatory">
                    <Select name="form-field-name"
                            ref = {"unit"}
                            options={unitTypes}
                            value={this.state.allowableUnit}
                            placeholder='Select Unit'
                            onChange={this.optionsByAllowableSizeUnit.bind(this)}
                            data-required={true} data-errMsg="Unit is required"/>
                  </div>
                </div>
                <br className="brclear"/>


            <div className="form-group">
              <input type="text"  ref="issuingAuthority" placeholder="Issuing Authority" className="form-control float-label" id=""/>
            </div>
              </form>
            </div>
          </div>

          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

        </div>


      </div>
    )
  }
};
export default MlAddDocumentMapping = formHandler()(MlAddDocumentMapping);

