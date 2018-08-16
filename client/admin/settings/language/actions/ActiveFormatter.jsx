import React from 'react';
import {updateLanguageActionHandler} from './updateLanguageAction'
class ActiveFormatter extends React.Component {
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
  onChange(data) {

    if (this.refs.status.checked == true) {
      // $('#status').prop('checked', true);
      this.refs.status.checked = true;
      this.setState({"data": {"isActive": true}});
    } else {
      this.refs.status.checked = false;
      this.setState({"data": {"isActive": false}});
    }

    let LanguageDetails = {
      id: data._id,
      languageName: data.languageInfo.languageName,
      languageDisplayName: data.languageInfo.languageDisplayName,
      aboutLanguage:data.languageInfo.aboutLanguage,
      isActive: this.refs.status.checked
    }

    updateLanguageActionHandler(LanguageDetails);
  }

  render() {
    return (
      <div className="form-group switch_wrap"><label className="switch"><input type="checkbox" ref="status" id="status" checked={this.state.data && this.state.data.isActive} onChange={this.onChange.bind(this,this.props.data)}/><div className="slider"></div></label></div>
      // <input type='checkbox' checked={ this.props.data.isActive } onChange={this.onChange.bind(this,this.props.data)}/>
    );
  }
};

export default ActiveFormatter;
