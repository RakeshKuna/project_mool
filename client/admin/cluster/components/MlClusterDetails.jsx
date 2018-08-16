import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import MlActionComponent from '../../../commons/components/actions/ActionComponent'
import {findClusterTypeActionHandler} from '../actions/findCluster'
import {updateClusterActionHandler} from '../actions/updateCluster'
import formHandler from '../../../commons/containers/MlFormHandler';
import _ from 'lodash';
import {OnToggleSwitch,initalizeFloatLabel} from '../../utils/formElemUtil';
import MlLoader from '../../../commons/components/loader/loader';



class MlClusterDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, data: {}};
    this.onStatusChangeActive = this.onStatusChangeActive.bind(this);
    this.onStatusChangeMap = this.onStatusChangeMap.bind(this);
    this.findCluster.bind(this);
    this.updateCluster.bind(this)
    return this;
  }

  componentWillMount() {
    const resp = this.findCluster();
    return resp;
  }

  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  async findCluster() {
    let clusterId = this.props.params;
    const response = await findClusterTypeActionHandler(clusterId);
    this.setState({loading: false, data: response});
  }

  async  updateCluster() {
    let clusterDetails = {
      _id: this.props.params,
      countryName: this.refs.countryName.value,
      displayName: this.refs.displayName.value,
      about: this.refs.about.value,
      email: this.refs.email.value,
      isEmailNotified:  this.state.data.isEmailNotified,
      showOnMap: this.refs.showOnMap.checked,
      isActive: this.refs.isActive.checked
    }
    const response = await updateClusterActionHandler(clusterDetails)
    return response;
  }

  onStatusChangeActive(e) {
    let updatedData = this.state.data||{};
    updatedData=_.omit(updatedData,["isActive"]);
    if (e.currentTarget.checked) {
      var z=_.extend(updatedData,{isActive:true});
      this.setState({data:z,loading:false});
    } else {
      var z=_.extend(updatedData,{isActive:false});
      this.setState({data:z,loading:false});
    }
  }
  onStatusChangeNotify(e)
  {
    let updatedData = this.state.data||{};
    updatedData=_.omit(updatedData,["isEmailNotified"]);
    if (e.currentTarget.checked) {
      var z=_.extend(updatedData,{isEmailNotified:true});
      this.setState({data:z,loading:false});
    } else {
      var z=_.extend(updatedData,{isEmailNotified:false});
      this.setState({data:z,loading:false});
    }
  }
  onStatusChangeMap(e)
  {
      let updatedData = this.state.data||{};
      updatedData=_.omit(updatedData,["showOnMap"]);
      if (e.currentTarget.checked) {
        var z=_.extend(updatedData,{showOnMap:true});
        this.setState({data:z,loading:false});
      } else {
        var z=_.extend(updatedData,{showOnMap:false});
        this.setState({data:z,loading:false});
    }
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/clusters");
      else
        toastr.error(response.result);
    }
  };

  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateCluster.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/clusters");
        }
      }
    ]

    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (

            <div className="admin_padding_wrap">
              <h2>Edit Cluster Details</h2>
              <form >

                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <div className="form-group">
                      <input type="text" ref="id" defaultValue={this.state.data && this.state.data.id} hidden="true"/>
                      <input type="text" ref="countryName" placeholder="Cluster Name"
                             defaultValue={this.state.data && this.state.data.countryName}
                             className="form-control float-label" disabled="disabled"/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="displayName" placeholder="Display Name"
                             defaultValue={this.state.data && this.state.data.displayName}
                             className="form-control float-label"/>
                    </div>
                    <div className="form-group">
                      <textarea ref="about" placeholder="About"
                                defaultValue={this.state.data && this.state.data.about}
                                className="form-control float-label">
                      </textarea>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <div className="form-group ">
                      {/*<div className="fileUpload mlUpload_btn">*/}
                        {/*<span>Country Flag</span>*/}
                        {/*/!*<input type="file" ref="uploadImage" className="upload"/>*!/*/}
                      {/*</div>*/}
                      <div className="previewImg">
                          <img src={this.state.data && Meteor.settings.public.countriesFlagBaseUrl+this.state.data.countryFlag}/>
                      </div>

                    </div>
                    <br className="brclear"/>
                    <div className="form-group ">
                      <input type="text" ref="email" placeholder="Email"
                             defaultValue={this.state.data && this.state.data.email}
                             className="form-control float-label"/>
                      <div className="email_notify">
                        <div className="input_types">
                          <input ref="isEmailNotified" type="checkbox" name="checkbox"
                                 checked={this.state.data && this.state.data.isEmailNotified}
                                 onChange={this.onStatusChangeNotify.bind(this)}/>
                          <label htmlFor="checkbox1"><span> </span>Notify</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group switch_wrap inline_switch">
                      <label>Show on map</label>
                      <label className="switch">
                        <input type="checkbox" id="showOnMap" ref="showOnMap" checked={this.state.data && this.state.data.showOnMap}
                               onChange={this.onStatusChangeMap.bind(this)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                    <div className="form-group switch_wrap inline_switch">
                      <label>Status</label>
                      <label className="switch">
                        <input type="checkbox" ref="isActive" checked={this.state.data && this.state.data.isActive}
                               onChange={this.onStatusChangeActive.bind(this)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                  </div>
                </div>

              </form>

            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
            />
          </div>)}
      </div>
    )
  }
}
;

export default MoolyaAddCluster = formHandler()(MlClusterDetails);

