import React from 'react';
import {updateCountryActionHandler} from './updateCountryAction'
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
  async onChange(data) {
    if (this.refs.status.checked == true) {
      this.refs.status.checked = true;
      this.setState({"data": {"isActive": true}});
    } else {
      this.refs.status.checked = false;
      this.setState({"data": {"isActive": false}});
    }

      let CountryDetails = {
        id: data.id,
        country: data.country,
        countryCode: data.countryCode,
        displayName:data.displayName,
        url: data.url,
        isActive: this.refs.status.checked
      }

    const response= await updateCountryActionHandler(CountryDetails);
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/countriesList");
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

export default ActiveFormatter;
