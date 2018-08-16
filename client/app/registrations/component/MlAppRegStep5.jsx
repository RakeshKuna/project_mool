import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import _ from "lodash";
import _underscore from "underscore";
import {multipartASyncFormHandler} from "../../../commons/MlMultipartFormAction";
import MlAppDocumentViewer from "./MlAppDocumentViewer";
import {findProcessDocumentForRegistrationActionHandler} from "../actions/findProcessDocumentForRegistration";
import {addRegistrationStep3Details} from "../actions/addRegistrationStep3DetailsAction";
import {removeFileFromDocumentsActionHandler} from "../actions/removeFileFromDocuments";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import Moolyaselect from "../../commons/components/MlAppSelectWrapper";
import MlAccordion from "../../../app/commons/components/MlAccordion";
import MlAppActionComponent from "../../../app/commons/components/MlAppActionComponent";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import {createKYCDocument} from "../actions/createKYCDocumentAction";
import {mlFieldValidations} from "../../../commons/validations/mlfieldValidation";
var convertS = require('unit-converter');
import MlLoader from "../../../commons/components/loader/loader";
// import {approvedStausForDocuments} from "../actions/approvedStatusForDocuments";
// import {rejectedStausForDocuments} from "../actions/rejectedStatusForDocuments";
// import {approvedStatusForUser} from "../actions/approveUser";
// import {rejectStatusForUser} from "../actions/rejectUser";
//import formHandler from '../../../../commons/containers/MlFormHandler';
export default class MlAppRegStep5 extends React.Component {
  constructor(props) {
    super(props);
    this.onDocumentSelect.bind(this);
    this.onFileUpload.bind(this);
    this.state = {
      loading: true,
      selectedFiles: [],
      selectedDocTypeFiles: [],
      popoverOpen: false
    }
    return this;
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentWillUpdate(nextProps) {
    /*let registrtionInfo = nextProps.registrationInfo
     let kycInfo = registrtionInfo && registrtionInfo.kycDocuments ? registrtionInfo.kycDocuments : []
     this.setState({"registrationDocuments": kycInfo})*/

    let kycInfo = nextProps.registrationData && nextProps.registrationData.kycDocuments ? nextProps.registrationData.kycDocuments : []
    if (!this.compareQueryOptions(this.props.registrationData.kycDocuments, nextProps.registrationData.kycDocuments)) {
      this.setState({loading: false, registrationDocuments: kycInfo || []});
    }
  }

  isValidated(){
    return true
  }

  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (150 + $('.app_header').outerHeight(true)));
    // this.props.getRegistrationKYCDetails()
    let communityType = this.props.registrationData && this.props.registrationData.registrationInfo && this.props.registrationData.registrationInfo.registrationType ? this.props.registrationData.registrationInfo.registrationType : ""
    this.setState({"communities": communityType})
    let registrationRecord = this.props.registrationData
    let addressDetails = registrationRecord&&registrationRecord.addressInfo?registrationRecord.addressInfo:[]
    /**
     * Check whether registration contains address array
     */
    if(addressDetails&&addressDetails.length<1){
      toastr.error("Default Address is manditory")
    }else if(addressDetails&&addressDetails.length>0){
      /**
       * If registration contains address array
       * Check isDefault Address Exist or Not
       */
      var found = addressDetails.some(function (el) {
        return el.isDefaultAddress == true;
      });
      if (!found) {
        /**
         * If registration contains address array
         * If default address not found throw an error
         */

        toastr.error("Default Address is manditory")

      }else if(found){
        /**
         * If registration contains address array
         * If default address exist
         * Check whether default address is active for single or multiple address
         */
        let addressData =  _.filter(addressDetails, {'isDefaultAddress': true});
        if(addressData&&addressData.length>1){
          toastr.error("Only one default address should exist")
        }
      }
    }
  }

  componentWillMount() {
    const resp = this.findProcessDocuments();
    /*return resp;*/
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    this.props.getRegistrationKYCDetails();
  };


  async findProcessDocuments() {
    let kycDocuments = this.props.registrationData && this.props.registrationData.kycDocuments ? this.props.registrationData.kycDocuments : [];
    if (kycDocuments.length < 1) {
      let countryId = this.props.registrationData && this.props.registrationData.registrationInfo.countryId ? this.props.registrationData.registrationInfo.countryId : '';
      let clusterId = this.props.registrationData && this.props.registrationData.registrationInfo.clusterId ? this.props.registrationData.registrationInfo.clusterId : '';
      let chapterId = this.props.registrationData && this.props.registrationData.registrationInfo.chapterId ? this.props.registrationData.registrationInfo.chapterId : '';
      let subChapterId = this.props.registrationData && this.props.registrationData.registrationInfo.subChapterId ? this.props.registrationData.registrationInfo.subChapterId : '';
      let communityType = this.props.registrationData && this.props.registrationData.registrationInfo.registrationType ? this.props.registrationData.registrationInfo.registrationType : '';
      let userType = this.props.registrationData && this.props.registrationData.registrationInfo.userType ? this.props.registrationData.registrationInfo.userType : '';
      let identityType = this.props.registrationData && this.props.registrationData.registrationInfo.identityType ? this.props.registrationData.registrationInfo.identityType : '';
      let profession = this.props.registrationData && this.props.registrationData.registrationInfo.profession ? this.props.registrationData.registrationInfo.profession : '';
      let industry = this.props.registrationData && this.props.registrationData.registrationInfo.industry ? this.props.registrationData.registrationInfo.industry : '';
      let email = this.props.registrationData && this.props.registrationData.registrationInfo.email ? this.props.registrationData.registrationInfo.email : '';
      const response = await  findProcessDocumentForRegistrationActionHandler(countryId, clusterId, chapterId, subChapterId, communityType, userType, identityType, profession, industry, email);
      if (response) {
        let processDoc = response
        processDoc = _underscore.without(processDoc,null);
        if (processDoc && processDoc.length > 0) {
          var ActiveResults = _underscore.where(processDoc, {isActive: true});
          var result = _.map(ActiveResults, function (currentObject) {

            if (currentObject.status && currentObject.docFiles) {
              return _.pick(currentObject, "docTypeName", "docTypeId", "kycCategoryId", "kycCategoryName", "documentId", "documentDisplayName", "documentName", "isMandatory", "isActive", "allowableFormat", "allowableMaxSize", "status", "docFiles");
            } else {
              return _.pick(currentObject, "docTypeName", "docTypeId", "kycCategoryId", "kycCategoryName", "documentId", "documentDisplayName", "documentName", "isMandatory", "isActive", "allowableFormat", "allowableMaxSize");
            }
          });
          var KYCDocResp = result.map(function (el) {
            var o = Object.assign({}, el);
            if (!el.status && !el.docFiles) {
              o.status = "Awaiting upload";
              o.docFiles = []
              return o;
            }
            return el;
          })
          let kycDoc = _.map(KYCDocResp, function (Docs) {
            if (Docs.docFiles.length > 0) {
              Docs.docFiles = _.map(Docs.docFiles, function (row) {
                return _.omit(row, ['__typename'])
              });
            }
            return Docs
          });

          let registrationId = this.props.registrationData._id
          const regResponse = await  addRegistrationStep3Details(kycDoc, "KYCDOCUMENT", registrationId);
          if (regResponse) {
            this.props.getRegistrationKYCDetails();

          }
        }else{
          this.setState({loading:false,registrationDocuments:kycDocuments})
        }
      }
    }
    else {
      this.setState({loading: false, registrationDocuments: kycDocuments})
    }
  }

  onDocumentSelect(selectedDocs, selectedDocType) {
    let selectedValues = [];
    selectedValues = selectedDocs
    this.setState({selectedFiles: selectedValues})
    this.setState({selectedDocTypeFiles: selectedDocType})
  };

  async onDocumentRemove(docTypeId, documentId, fileId) {
    console.log(docTypeId)
    let registrationId = this.props.registrationData._id
    const response = await removeFileFromDocumentsActionHandler(fileId, docTypeId, documentId, registrationId);
    if (response.success) {
      this.props.getRegistrationKYCDetails();

      $('*').tooltip('hide');
    } else {
      toastr.error(response.result)
    }
  }

  onFileUpload(file, documentId, docTypeId) {
    let id = this.props.registrationData && this.props.registrationData._id ? this.props.registrationData._id : '';
    let processDocument = this.state.registrationDocuments
    kycDoc = _.find(processDocument, function (item) {
      return item.docTypeId == docTypeId && item.documentId == documentId;
    });
    let fileName = file&&file.name?file.name:""
    let fileFormate = fileName.split('.').pop()
    let docFormate = kycDoc&&kycDoc.allowableFormat&&kycDoc.allowableFormat[0]?kycDoc.allowableFormat[0]:{}
    console.log(docFormate)
    let lowerDocFormate = docFormate.toLowerCase();
    let docResponse = _.includes(lowerDocFormate, fileFormate);
    let documentAllowableSize = convertS(kycDoc&&kycDoc.allowableMaxSize?kycDoc.allowableMaxSize:null).to('B');
    let uploadedDocSize = file&&file.size?file.size:""
    if(uploadedDocSize > documentAllowableSize){
      toastr.error("Please upload documents only in the permitted file size")
    }else if (docResponse) {
      let data = {
        moduleName: "REGISTRATION",
        actionName: "UPLOAD",
        registrationId: "registration1",
        documentId: documentId,
        docTypeId: docTypeId,
        registrationId: id
      };
      let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      if (response) {
        this.props.getRegistrationKYCDetails();
      }
    } else {
      toastr.error("please provide allowable formate documents")
    }


  }

  onFileUploadCallBack(resp) {
    if (resp) {
      this.props.getRegistrationKYCDetails();
      setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
          trigger: "hover"
        });
      }, 1000);
    }
  }

  addDocument(key) {
    if (this.state[key] == true) {
      this.setState({[key]: false})
    } else if (this.state[key] == false) {
      this.setState({[key]: true})
    } else {
      this.setState({[key]: true})
    }
    this.setState({
      "clusters": [],
      "chapters": [],
      "subChapters": [],
      "kycCategory": "",
      "documentType": "",
      "kycDocument": ""
    })
  }


  optionsBySelectClusters(val) {
    /* let clusters=this.state.clusters
     clusters[0]['id']=val;*/
    this.setState({clusters: val})
  }

  optionsBySelectChapters(val) {
    /* let chapters=this.state.chapters
     chapters[0]['id']=val;*/
    this.setState({chapters: val})
  }

  optionsBySelectSubChapters(val) {
    /*let subChapters=this.state.subChapters
     subChapters[0]['id']=val;*/
    this.setState({subChapters: val})
  }


  optionsByKycCategories(val) {
    /*let kycCategory=this.state.kycCategory
     kycCategory[0]['id']=val;*/
    this.setState({kycCategory: val})
  }


  optionsBySelectCommunities(val) {
    this.setState({communities: val})
  }

  optionsBySelectDocumentType(val) {
    /* let documentType=this.state.documentType
     documentType[0]['id']=val;*/
    this.setState({documentType: val})
  }

  optionsBySelectKYCDocument(val) {
    this.setState({kycDocument: val})
  }

  async onSaveAction(key) {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let documentID = this.state.kycDocument ? this.state.kycDocument : null;
      let kycDocID = this.state.kycCategory ? this.state.kycCategory : null;
      let docTypeID = this.state.documentType ? this.state.documentType : null;
      let registrationId = this.props.registrationData && this.props.registrationData._id ? this.props.registrationData._id : ""


      const response = await createKYCDocument(registrationId, documentID, kycDocID, docTypeID);

      if (response && response.success) {
        toastr.success(response.result);
        this.props.getRegistrationKYCDetails();
        this.setState({[key]: !(this.state[key])})
      } else {
        toastr.error("Unable to create document,enter all manditory fields");
      }
    }
  }

  async onCancelAction(key) {
    this.setState({[key]: false})
  }

  exitRegistration(){
    FlowRouter.go('/app/dashboard')
  }

  render() {
    let MlActionConfig
    let userType = this.props.userType;

    let clusterquery = gql`  query{
      data:fetchActiveClusters{label:countryName,value:_id}
    }`;
    let chapterquery = gql`query($clusters:[String],$displayAllOption:Boolean){  
            data:fetchActiveClusterChapters(clusters:$clusters,displayAllOption:$displayAllOption) {
              value:_id
              label:chapterName
            }  
        }`;
    let subChapterquery = gql`query($chapters:[String],$clusters:[String],$displayAllOption:Boolean){  
            data:fetchActiveChaptersSubChapters(chapters:$chapters,clusters:$clusters,displayAllOption:$displayAllOption) {
              value:_id
              label:subChapterName
            }  
        }`;
    let kycCategoryquery = gql`query{  
      data:fetchKYCCategories{
        value:_id
        label:docCategoryName
      }  
    }`;
    let documentTypequery = gql`query{  
      data:fetchDocumentsType{
        value:_id
        label:docTypeName
      }  
    }`;
    let documentFormatquery = gql`query{  
      data:fetchDocumentsFormat{
        value:_id
        label:docFormatName
      }  
    }`;

    let fetchcommunities = gql` query{
      data:fetchCommunityDefinitionForProcessMapping{label:name,value:code}
    }
    `;
    let kycDocuments = gql`query($chapters:[String],$clusters:[String],$subChapters:[String],$community:String,$kyc:String,$documentType:String,$displayAllOption:Boolean){  
        data:fetchKYCDocuments(chapters:$chapters,clusters:$clusters,subChapters:$subChapters,community:$community,kyc:$kyc,documentType:$documentType,displayAllOption:$displayAllOption) {
          value:documentId
          label:documentDisplayName
        }  
    }`;

    let chapterOption = {options: {variables: {clusters: this.state.clusters, displayAllOption: true}}};
    let subChapterOption = {
      options: {
        variables: {
          chapters: this.state.chapters,
          clusters: this.state.clusters,
          displayAllOption: true
        }
      }
    };
    let documentsOption = {
      options: {
        variables: {
          chapters: this.state.chapters,
          clusters: this.state.clusters,
          subChapters: this.state.subChapters,
          community: this.state.communities,
          kyc: this.state.kycCategory,
          documentType: this.state.documentType,
          displayAllOption: false
        }
      }
    };

    /**
     * kyc handlers
     * */
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'cancel',
        handler: this.exitRegistration.bind(this)
      }
    ]

    export const genericPortfolioAccordionConfig = {
      id: 'registrationAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{
              resourceId: 'registrationId',
              resourceType: 'registration'
            }}
            actionOptions={appActionConfig}/>
        }]
    }

    /*   let registrationDocuments=this.state.registrationDocuments||[];
     registrationDocuments= _.filter(registrationDocuments, function(doc) { return doc.docTypeName&&doc.documentId; });
     let registrationDocumentsGroup=_.groupBy(registrationDocuments,'docTypeName')||{};*/
    let registrationDocumentsGroup = this.props.kycDocuments || []
    let communityType = this.props.registrationData && this.props.registrationData.registrationInfo && this.props.registrationData.registrationInfo.registrationType ? this.props.registrationData.registrationInfo.registrationType : ""
    let that = this;

     const showLoader=this.state.loading;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (<div className="step_form_wrap step5">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          {Object.keys(registrationDocumentsGroup).map(function (key,id) {
            var documentNames =  key.replace(/\b\w/g, l => l.toUpperCase())
            return (<div className="col-md-12" key={id}>
              <div key={key} className="row">
                <h3 className="sub-head-border">{documentNames}</h3>
                {registrationDocumentsGroup[key].map(function (regDoc, idx) {
                  let documentExist = _.isEmpty(regDoc)
                  return (
                    <div key={idx}>{!documentExist && regDoc.documentId != null &&
                    <MlAppDocumentViewer key={regDoc.documentId} doc={regDoc}
                                         selectedDocuments={that.state.selectedFiles}
                                         selectedDocType={that.state.selectedDocTypeFiles}
                                         onFileUpload={that.onFileUpload.bind(that)}
                                         onDocumentSelect={that.onDocumentSelect.bind(that)}
                                         onDocumentRemove={that.onDocumentRemove.bind(that)}/>} </div>)

                })
                }
               {/* <div className="col-lg-4">
                  <div className="panel panel-default uploaded_files">
                    <div className="panel-heading">
                      <div><label htmlFor="chapter_admin_check"><span></span>Add New Document</label></div>
                    </div>
                    <div className="panel-body uploaded_files_swiper" onClick={that.addDocument.bind(that, key)}>
                      <ul className="swiper-wrapper">
                        <li className="doc_card" data-toggle="tooltip" data-placement="bottom" title="File name"><a
                          id={"kyc" + key} data-placement="top" data-class="large_popover"><img
                          src="/images/sub_default.jpg"/></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Popover placement="right" isOpen={that.state[key]} target={"kyc" + key}>
                  <PopoverTitle>Add New Document</PopoverTitle>
                  <PopoverContent>
                    <div className="ml_create_client">
                      <div className="medium-popover">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <Moolyaselect ref="cluster" multiSelect={true} mandatory={true} placeholder={"Cluster"}
                                            className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                            selectedValue={that.state.clusters} queryType={"graphql"}
                                            query={clusterquery} id={'clusterquery'} isDynamic={true}
                                            onSelect={that.optionsBySelectClusters.bind(that)} data-required={true}
                                            data-errMsg="Cluster is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="chapter" multiSelect={true} mandatory={true} placeholder={"Chapter"}
                                            className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                            selectedValue={that.state.chapters} queryType={"graphql"}
                                            query={chapterquery} queryOptions={chapterOption} isDynamic={true}
                                            id={'query'} onSelect={that.optionsBySelectChapters.bind(that)}
                                            data-required={true} data-errMsg="Chapter is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="subChapter" multiSelect={true} mandatory={true}
                                            placeholder={"SubChapter"} className="form-control float-label"
                                            valueKey={'value'} labelKey={'label'} selectedValue={that.state.subChapters}
                                            queryType={"graphql"} query={subChapterquery}
                                            queryOptions={subChapterOption} isDynamic={true} id={'query'}
                                            onSelect={that.optionsBySelectSubChapters.bind(that)} data-required={true}
                                            data-errMsg="SubChapter is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="communities" multiSelect={false} mandatory={true}
                                            placeholder={"Communities"} className="form-control float-label"
                                            valueKey={'value'} labelKey={'label'} selectedValue={communityType}
                                            queryType={"graphql"} query={fetchcommunities} isDynamic={true}
                                            id={'fetchcommunities'}
                                            onSelect={that.optionsBySelectCommunities.bind(that)} data-required={true}
                                            data-errMsg="Community Needed" disabled={true}/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="kycCategory" multiSelect={false} mandatory={true}
                                            placeholder={"KYC Categories"} className="form-control float-label"
                                            valueKey={'value'} labelKey={'label'} selectedValue={that.state.kycCategory}
                                            queryType={"graphql"} query={kycCategoryquery} isDynamic={true} id={'query'}
                                            onSelect={that.optionsByKycCategories.bind(that)} data-required={true}
                                            data-errMsg="KYC Category is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="documentType" multiSelect={false} mandatory={true}
                                            placeholder={"Type of Document"} className="form-control float-label"
                                            valueKey={'value'} labelKey={'label'}
                                            selectedValue={that.state.documentType} queryType={"graphql"}
                                            query={documentTypequery} isDynamic={true} id={'query'}
                                            onSelect={that.optionsBySelectDocumentType.bind(that)} data-required={true}
                                            data-errMsg="Document Type is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect ref="document" multiSelect={false} mandatory={true}
                                            placeholder={"Select Document"} className="form-control float-label"
                                            valueKey={'value'} labelKey={'label'} selectedValue={that.state.kycDocument}
                                            queryType={"graphql"} query={kycDocuments} queryOptions={documentsOption}
                                            isDynamic={true} id={'query'}
                                            onSelect={that.optionsBySelectKYCDocument.bind(that)} data-required={true}
                                            data-errMsg="Document Type is required"/>
                            </div>
                            <div className="clearfix"></div>
                            <div className="ml_btn mart20" style={{'textAlign': 'center'}}>
                              <a href="" className="save_btn"
                                 onClick={that.onSaveAction.bind(that, key)}>Add</a>&nbsp;&nbsp;&nbsp;<a href=""
                                                                                                         className="cancel_btn"
                                                                                                         onClick={that.onCancelAction.bind(that, key)}>Cancel</a>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>*/}
              </div>
            </div>)
          })}
        </ScrollArea>
        {/*<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>*/}
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>)}
      </div>
    )
  }
};
//export default Step5 = formHandler()(Step5);
