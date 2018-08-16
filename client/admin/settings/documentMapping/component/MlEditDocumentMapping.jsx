
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import formHandler from '../../../../commons/containers/MlFormHandler'
import {updateDocumentMappingActionHandler} from '../actions/updateDocumentMappingAction'
import {findDocumentMappingActionHandler} from '../actions/findDocumentMappingAction'
// import MlAssignDocument from './MlAssignDocument'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
let Select = require('react-select');
import _ from 'lodash';
import moment from "moment";
import Datetime from "react-datetime";

class MlEditDocumentMapping extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      data:{},
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
    // this.addEventHandler.bind(this);
    return this;
  }


  // async addEventHandler() {
  //   const resp=await this.createBackendUser();
  //   return resp;
  // }

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

  async findDocument(){
    let id=this.props.config
    const response = await findDocumentMappingActionHandler(id);
    let allowableUnit;let allowableSize;
    if(response) {
      allowableUnit = response&&response.allowableMaxSize?response.allowableMaxSize:"";
      allowableUnit = allowableUnit.replace(/[0-9]/g, '');

      allowableSize = response&&response.allowableMaxSize?parseInt(response.allowableMaxSize):""
      let dataDetails = response

      let cloneBackUp = _.cloneDeep(dataDetails);
      if (cloneBackUp) {
        cloneBackUp.allowableMaxSize = allowableSize;


      }

      this.setState({ allowableUnit : allowableUnit,data: cloneBackUp,loading : false})
      //this.setState({loading:false,data:response});
      // this.setState({documentId: this.state.data.documentId});
      // this.setState({id: this.state.data._id});
      if (this.state.data.documentType) {
        let documentTypeId = this.state.data.documentType
        this.setState({documentType: documentTypeId});
      }
      if (this.state.data.kycCategory) {
        let kycCategoryId = this.state.data.kycCategory;
        this.setState({kycCategory: kycCategoryId});
      }
      if (this.state.data.allowableFormat) {
        let allowableFormatId = this.state.data.allowableFormat
        this.setState({allowableFormat: allowableFormatId});
      }
      if (this.state.data.clusters) {
        let clustersId = this.state.data.clusters;
        this.setState({clusters: clustersId});
      }
      if (this.state.data.chapters) {
        let chaptersId = this.state.data.chapters;
        this.setState({chapters: chaptersId});
      }
      if (this.state.data.subChapters) {
        let subChaptersId = this.state.data.subChapters;
        this.setState({subChapters: subChaptersId});
      }

      if(this.state.data&&this.state.data.validity){
        let existData = this.state.data;
        existData.validity = moment(this.state.data&&this.state.data.validity).format('MM-DD-YYYY')
        this.setState({loading: false,"data":existData});
      }




    }


  }


  // onSubmit(){
  //   console.log(this.state.assignDocuments)
  // }

  componentWillMount() {
    const resp=this.findDocument();
    return resp;

  }
  async  updateDocument() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let Details = {
        documentId: this.refs.documentId.value,
        documentDisplayName: this.refs.displayName.value,
        allowableFormat: this.state.allowableFormat,
        clusters: this.state.clusters,
        chapters: this.state.chapters,
        subChapters: this.state.subChapters,
        validity: this.state.data&&this.state.data.validity?this.state.data.validity:null,
        inputLength: this.refs.length.value,
        remarks: this.refs.remark.value,
        documentName: this.refs.documentName.value,
        kycCategory: this.state.kycCategory,
        documentType: this.state.documentType,
        allowableMaxSize: this.refs.allowableSize.value+this.state.allowableUnit,
        issuingAuthority: this.refs.issuingAuthority.value,
        isActive: this.refs.status.checked,
      }
      let id = this.refs.documentId.value;
      const response = await updateDocumentMappingActionHandler(id, Details)
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
  /*  let clusters=this.state.clusters
    clusters[0]['id']=val;*/
    this.setState({clusters:val})
  }

  optionsBySelectChapters(val){
   /* let chapters=this.state.chapters
    chapters[0]['id']=val;*/
    this.setState({chapters:val})
  }

  optionsBySelectSubChapters(val){
   /* let subChapters=this.state.subChapters
    subChapters[0]['id']=val;*/
    this.setState({subChapters:val})
  }

  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
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
      let existData = this.state.data;
      existData.validity = value
      this.setState({loading: false,"data":existData});
    }
  }

  componentDidUpdate()
  {
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    OnToggleSwitch(true,true);

    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }
  componentDidMount()  {
    setTimeout(function(){
      initalizeFloatLabel();
    },1000);
  }
  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateDocument.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      // {
      //   showAction: true,
      //   actionName: 'add',
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/documentMappingList")
        }
      }
    ]

    let query=gql` query{
    data:fetchCountriesSearch{label:country,value:countryCode}
    }
`;
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

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Edit Document</h2>
              <div className="main_wrap_scroll">

              <div className="col-md-6 nopadding-left">
                <div className="left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <div className="form_bg">
                      <form>
                        <div className="form-group">
                          <input type="text"  ref="documentId" defaultValue={this.state.data&&this.state.data.documentId} placeholder="Document Id" className="form-control float-label" id="" disabled="disabled"/>
                        </div>

                        <div className="form-group mandatory">
                          <input type="text"  ref="displayName" defaultValue={this.state.data&&this.state.data.documentDisplayName} placeholder="Display Name" className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
                        </div>


                          <Moolyaselect ref="allowableFormat" multiSelect={true} mandatory={true} placeholder={"Allowable Format"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.allowableFormat} queryType={"graphql"} query={documentFormatquery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectAllowableFormats.bind(this)}  data-required={true} data-errMsg="Format is required"/>

                        <div className="panel panel-default">
                          <div className="panel-heading">Jurisdiction</div>
                          <div className="panel-body">


                              <Moolyaselect ref="cluster" multiSelect={true} mandatory={true}  placeholder={"Cluster"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters} queryType={"graphql"} query={clusterquery} isDynamic={true} id={'clusterquery'} onSelect={this.optionsBySelectClusters.bind(this)}  data-required={true} data-errMsg="Cluster is required" />


                              <Moolyaselect ref="chapter" multiSelect={true}  placeholder={"Chapter"} mandatory={true} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters} queryType={"graphql"} query={chapterquery} queryOptions={chapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectChapters.bind(this)}  data-required={true} data-errMsg="Chapter is required"/>

                              <Moolyaselect ref="subChapter" multiSelect={true}  placeholder={"SubChapter"} mandatory={true}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapters} queryType={"graphql"} query={subChapterquery}  queryOptions={subChapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubChapters.bind(this)}  data-required={true} data-errMsg="subChapter is required"/>

                            <div className="form-group">
                              {/*<input type="text"  ref="validity" defaultValue={moment(this.state.data&&this.state.data.validity).format('DD-MM-YYYY')} placeholder="Validity" className="form-control float-label" id=""/>*/}
                              <Datetime dateFormat="MM-DD-YYYY" timeFormat={false}  inputProps={{placeholder: "Validity",readOnly:true}}   closeOnSelect={true}  value={this.state.data&&this.state.data.validity} onChange={this.onemploymentDateSelection.bind(this)}/>
                            </div>
                            <div className="form-group">
                              <input type="text"  ref="length" defaultValue={this.state.data&&this.state.data.inputLength} placeholder="Length" className="form-control float-label" id=""/>
                            </div>
                            <div className="form-group">
                              <input type="text"  ref="remark" defaultValue={this.state.data&&this.state.data.remarks} placeholder="Remark" className="form-control float-label" id=""/>
                            </div>
                            <div className="form-group switch_wrap inline_switch">
                              <label className="">Status</label>
                              <label className="switch">
                                <input type="checkbox" ref="status" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="col-md-6 nopadding-right"  >
                <div className="form_bg">
                  <form>
                <div className="form-group mandatory">
                  <input type="text"  ref="documentName" defaultValue={this.state.data&&this.state.data.documentName} placeholder="Name" className="form-control float-label" id="" data-required={true} data-errMsg="Name is required"/>
                </div>

                  <Moolyaselect  ref="kycCategory" multiSelect={true}  placeholder={"KYC Categories"} mandatory={true} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.kycCategory} queryType={"graphql"} query={kycCategoryquery}  isDynamic={true} id={'query'} onSelect={this.optionsByKycCategories.bind(this)}  data-required={true} data-errMsg="kyc Category is required"/>

                  <Moolyaselect  ref="documentType" multiSelect={true}  placeholder={"Type of Document"} mandatory={true}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.documentType} queryType={"graphql"} query={documentTypequery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectDocumentType.bind(this)}  data-required={true} data-errMsg="Document Type is required"/>
                  <div className="col-md-8 nopadding-left">
                    <div className="form-group mandatory">
                      <input type="text"  ref="allowableSize" defaultValue={this.state.data&&this.state.data.allowableMaxSize} placeholder="Allowable Size" className="form-control float-label" id="" data-required={true} data-errMsg="Size is required"/>
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
                    <div className="clearfix"></div>
                <div className="form-group">
                  <input type="text"  ref="issuingAuthority" defaultValue={this.state.data&&this.state.data.issuingAuthority} placeholder="Issuing Authority" className="form-control float-label" id=""/>
                </div>
                  </form>
                </div>
              </div>

              </div>

              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

            </div>


          )}
      </div>
    )
  }
};
export default MlEditDocumentMapping = formHandler()(MlEditDocumentMapping);

