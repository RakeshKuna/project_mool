/**
 * Created by vishwadeep on 17/7/17.
 */

/**
 * import of the libs and routes
 * */
import React, {Component} from "react";
import {fetchPendingRegistration} from "../../registrations/actions/findRegistration";
import MlLoader from "../../../commons/components/loader/loader";
import {requestPermission} from "./MlFireBaseClientSetup"

export default class MlAppContextHandler extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {lodaing: true}
    return this;
  }

  /**
   * component will mount to fetch the registation
   * */
  componentWillMount() {
    const resp = this.fetchPendingReg()
    return resp
  }

  /**
   * fetching and redirecting to pending registration it will check only first time login by the user
   * @todo {*} uncomment the code onces the issue is been resolved of slowness
   * */
  async fetchPendingReg() {
    if (this.props.isFirst) {
      const response = await fetchPendingRegistration();
      if (response && response.length > 0) {
        FlowRouter.go('/app/register/' + response[0].registrationId)
      }
      else if (response && response.length == 0) {
        this.setState({loading: false})
      }
      // requestPermission('LOGIN');
    }
  }

  /**
   * render element to display the passing header if no pending registration
   * */
  render() {
    var data = this.props;
    var showLoader = this.state.loading;
    return (<div>{showLoader === true ? <MlLoader/> : data.context}</div>)
  }
}
