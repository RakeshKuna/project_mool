/**
 * @author updated 'vishwadeep' 19/2/18
 */
import React, { Component } from 'react';
import {upsertProcessDocActionHandler} from '../actions/upsertProcessDocAction'
import {findProcessDocActionHandler} from '../actions/findProcessDocAction'

class MandatoryProcessDocFormatter extends Component {
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
    this.props.getUpdatedData();
    //  console.log(this.props.config);
    // const processResp=this.findProcessDocument();
    // return processResp;
  }

    /**
     * @func calling function at the componentWillReceiveProps()
     * @param {*} props 
     */
    findProcessDocument(props) {
    // async findProcessDocument(props) {
    // let pid=this.props.processConfig
    // const response =await  findProcessDocActionHandler(pid);
    // const response = this.props.response;
    const response = props.response;
    if(response){
      if(response.processDocuments) {
        let processDocuments = response.processDocuments
        let kycid = this.props.kycConfig;
        let doctypeId = this.props.data.DocType;
        let documentId= this.props.data.Id
        let fileterProcessDocuments = _.filter(processDocuments, function (docs) {
          return docs.kycCategoryId == kycid && docs.docTypeId == doctypeId&&docs.documentId== documentId
        });
        // if (fileterProcessDocuments.length && fileterProcessDocuments[0].isActive) {
        //   this.setState({"isActive": fileterProcessDocuments[0].isActive})
        // }else{
        //   this.setState({"isActive": false})
        // }
        const isActive = fileterProcessDocuments.length && fileterProcessDocuments[0].isActive ? fileterProcessDocuments[0].isActive : false;
        const isMandatory = fileterProcessDocuments.length && fileterProcessDocuments[0].isMandatory ? fileterProcessDocuments[0].isMandatory : false;
        this.setState({ "isMandatory": isMandatory, 'isActive': isActive });
      }
      return response;
    }

  }
  componentDidMount() {
    if(this.props.data.Mandatory){
      this.refs.status.checked = true
      this.setState({"isMandatory":true})

    }else{
      this.refs.status.checked = false
      this.setState({"isMandatory":false})
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

  /**
   * @event {*} onChange
   */
  onChange() {
    if (this.refs.status.checked === true) {
      const validatePreCondition = this.validatePreCondition(this.refs.status.checked);
      if (!validatePreCondition.isValid) {
        this.refs.status.checked = false;
        toastr.error(validatePreCondition.msg);
        return;
      } else {
        this.setState({ isMandatory: true });
        this.saveData();
      }
    } else {
      const validatePreCondition = this.validatePreCondition(this.refs.status.checked);
      if (!validatePreCondition.isValid) {
        toastr.error(validatePreCondition.msg);
        return;
      } else {
        this.setState({ isMandatory: false });
        this.saveData();
      }
    }
  }

  /**
   * @func saving data to db
   * @todo moving this function to the containor
   */
  async saveData() {
    const processDocDetails = {
      id: this.props.processConfig,
      kycCategoryId: this.props.kycConfig,
      docTypeId: this.props.data.DocType,
      documentId: this.props.data.Id,
      isMandatory: this.refs.status.checked,
      isActive: this.state.isActive,
    };

    const response = await upsertProcessDocActionHandler(processDocDetails);
    if (response) {
      if (response.success) {
        this.props.getUpdatedData();
        // FlowRouter.go("/admin/documents/" + this.props.processConfig + "/" + this.props.kycConfig + "/" + this.props.docTypeConfig);
      } else {
        toastr.error(response.result);
      }
    }
  }

  /**
   * @func validating the data on event
   * @param {*boolean} isMandatory 
   * @return {*object}
   */
  validatePreCondition(isMandatory) {
    const { isActive } = this.state;
    return { isValid: !isActive && isMandatory ? false : true, msg: 'Document should be active to make it mandatoy' }
  }

  /**
   * @return UI
   */
  render() {
    return (
      <div className="input_types">
        <input ref="status" checked={this.state.isMandatory} onChange={this.onChange.bind(this,this.props.data)}  id="checkbox1" type="checkbox" name="isMandatory" value="1" />
        <label htmlFor="checkbox1">
          <span></span>
        </label>
      </div>
    );
  }
};

export default MandatoryProcessDocFormatter;
