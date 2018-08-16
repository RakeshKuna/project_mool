/**
 * @author updated 'vishwadeep' 19/2/18
 */
import React, { Component } from 'react';
import {upsertProcessDocActionHandler} from '../actions/upsertProcessDocAction'
import {findProcessDocActionHandler} from '../actions/findProcessDocAction'
import {OnToggleSwitch, MoolyaToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';

class DocumentActiveComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{},isActive:false,isMandatory:false};
    // this.findProcessDocument=this.findProcessDocument.bind(this);
    return this;
  }

  /**
   * @func React life cycle
   * @see getting data from containor
   */
  componentWillMount(){
    //  console.log(this.props.config);
    // const processResp=this.findProcessDocument();
    // return processResp;
    this.props.getUpdatedData();
  }

  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  /**
   * @func calling function at the componentWillReceiveProps()
   * @param {*} props 
   */
  findProcessDocument(props){
    // async findProcessDocument(){
    // let pid=this.props.processConfig
    // const response =await  findProcessDocActionHandler(pid);
    // const response = this.props.response;
    const response = props.response;
    if(response){
      if(response.processDocuments) {
        let processDocuments = response.processDocuments
        let kycid = props.kycConfig;
        let doctypeId = props.data.DocType;
        let documentId= props.data.Id
        // let kycid = this.props.kycConfig;
        // let doctypeId = this.props.data.DocType;
        // let documentId= this.props.data.Id
        let fileterProcessDocuments = _.filter(processDocuments, function (docs) {
          return docs.kycCategoryId == kycid && docs.docTypeId == doctypeId&&docs.documentId== documentId
        });
        // if (fileterProcessDocuments.length && fileterProcessDocuments[0].isMandatory) {
        //   this.setState({"isMandatory": fileterProcessDocuments[0].isMandatory})
        // }else{
        //   this.setState({"isMandatory": false})
        // }
        const isMandatory = fileterProcessDocuments.length && fileterProcessDocuments[0].isMandatory ? fileterProcessDocuments[0].isMandatory : false;
        const isActive = fileterProcessDocuments.length && fileterProcessDocuments[0].isActive ? fileterProcessDocuments[0].isActive : false;
        this.setState({ "isActive": isActive, 'isMandatory': isMandatory });
      }
      return response;
    }
  }
  
  /**
   * @func React life cycle
   * @param {*} state 
   * @param {*} nextState 
   */
  componentWillReceiveProps(state, nextState) {
    this.findProcessDocument(state);
  }

  componentDidMount() {
    if(this.props.data.Active==true){
      this.refs.status.checked = true
      this.setState({"isActive":true})

    }else{
      this.refs.status.checked = false
      this.setState({"isActive":false})
    }
  }

  /**
   * @event {*} onChange
   */
  onChange(data) {
    if (this.refs.status.checked === true) {
      const validatePreCondition = this.validatePreCondition(this.refs.status.checked);
      if (!validatePreCondition.isValid) {
        this.refs.status.checked = false;
        toastr.error(validatePreCondition.msg);
        return;
      } else {
        this.setState({ isActive: true });
        this.saveData();
      }
    } else {
      const validatePreCondition = this.validatePreCondition(this.refs.status.checked);
      if (!validatePreCondition.isValid) {
        toastr.error(validatePreCondition.msg);
        return;
      } else {
        this.setState({ isActive: false })
        this.saveData();
      }
    }
  }

  /**
   * @func saving data to db
   * @todo moving this function to the containor
   */
  async saveData(){
    const processDocDetails = {
      id:this.props.processConfig,
      kycCategoryId:this.props.kycConfig,
      docTypeId:this.props.data.DocType,
      documentId:this.props.data.Id,
      isMandatory:this.state.isMandatory,
      isActive:this.refs.status.checked
    };

    const response= await upsertProcessDocActionHandler(processDocDetails);
    if (response){
      if(response.success) {
        this.props.getUpdatedData();
        // FlowRouter.go("/admin/documents/" + this.props.processConfig + "/" + this.props.kycConfig + "/" + this.props.docTypeConfig);
      }else {
        toastr.error(response.result);
      }
    }
  }

  /**
   * @func validating the data on event
   * @param {*boolean} isMandatory 
   * @return {*object}
   */
  validatePreCondition(isActive) {
    const { isMandatory } = this.state;
    return { isValid: !isActive && isMandatory ? false : true, msg: 'Mandatory document cannot be inactive' }
  }

  /**
   * @return UI
   */
  render() {
    return (
      <div className="form-group switch_wrap">
        <label className="switch">
          <input type="checkbox" ref="status" id="status" checked={this.state.isActive} onChange={this.onChange.bind(this, this.props.data)} />
          <div className="slider"></div>
        </label>
      </div>
    );
  }
};

export default DocumentActiveComponent;
