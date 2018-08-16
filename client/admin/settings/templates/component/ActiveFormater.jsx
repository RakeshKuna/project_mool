import React from 'react';
import {updateTemplateActionHandler} from '../actions/updateTemplateAction'
class ActiveFormater extends React.Component {
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
  async onChange(data) {
    if (this.refs.status.checked == true) {
      this.refs.status.checked = true;
      this.setState({"data": {"isActive": true}});
    } else {
      this.refs.status.checked = false;
      this.setState({"data": {"isActive": false}});
    }
    let isActive=this.refs.status.checked;
    let templateCode=this.props.data.templateCode;
    let templateId=this.props.templateId
    let stepCode=this.props.stepCode
    let subprocessId=this.props.subProcessConfig
 let response = await updateTemplateActionHandler(templateId,templateCode,isActive);
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/stepDetails/"+subprocessId+"/"+templateId+"/"+stepCode);
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

export default ActiveFormater;
