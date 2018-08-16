import React from 'react';
import MlInfinity from "../../dashboard/component/MlInfinity";
import MlListViewContainer from "../../core/containers/MlListViewContainer";
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"

export default class MlChaptersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: true
    }
    this.viewModeChange.bind(this);
  }

  viewModeChange(mode){
    this.setState({'viewMode':mode});
  }


  render() {
    let viewMode = this.state.viewMode;
    let showInfinity=true;
    let infinityViewProps = {viewMode: this.state.viewMode, onViewModeChange:this.viewModeChange.bind(this)};
    let config=this.props;
    let listConfig=this.props.listConfig;
     let params=this.props.params?this.props.params:null;
    return (
      <div>
        <div className="admin_main_wrap">

          <div><MlListViewContainer params={params} {...listConfig}/></div>

        </div>
      </div>

    )

  }
}
