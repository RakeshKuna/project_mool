import React from 'react';
import {updateProcessActionHandler} from '../actions/updateProcessMappingAction'
import {OnToggleSwitch,initalizeFloatLabel,passwordVisibilityHandler} from '../../../utils/formElemUtil';
class ActiveProcessFormatter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    return this;
  }
  componentDidMount() {
    if(this.props.data.isActive){
      this.refs.status.checked = true
    }
  }
  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }
  async onChange(data) {
    if (this.refs.status.checked == true) {
      this.refs.status.checked = true;
      this.setState({"data": {"isActive": true}});
    } else {
      this.refs.status.checked = false;
      this.setState({"data": {"isActive": false}});
    }

    let ProcessDetails = {
      processId   : data.processId,
      process     : data.process,
      communities : data.communities,
      userTypes   : data.userTypes,
      identity    : data.identity,
      industries  : data.industries,
      professions : data.professions,
      clusters    : data.clusters,
      states      : data.states,
      chapters    : data.chapters,
      subChapters : data.subChapters,
      isActive    : this.refs.status.checked,
      documents   : data.assignDocument
    }
let id=data.id
   let response = await updateProcessActionHandler(id,ProcessDetails);
    if (response){
      if(response.success)
        FlowRouter.go("/admin/documents/clusterList");
      else
        toastr.error(response.result);
    }
  }

  render() {
    return (
      <div className="form-group switch_wrap"><label className="switch"><input type="checkbox" ref="status" id="status" checked={this.state.data && this.state.data.isActive} onChange={this.onChange.bind(this,this.props.data)}/><div className="slider"></div></label></div>
      // <input type='checkbox' checked={ this.props.data.isActive } onChange={this.onChange.bind(this,this.props.data)}/>
    );
  }
};

export default ActiveProcessFormatter;
