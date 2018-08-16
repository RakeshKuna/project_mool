import React from 'react';
import MlInfinity from "../../dashboard/component/MlInfinity";
import MlListViewContainer from "../../core/containers/MlListViewContainer";
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"

export default class MlChapterView extends React.Component {
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
    //console.log(this.props);
    // listConfig.data=[{displayName:"India"}];
    return (
      <div>
        <div className="admin_main_wrap">
          {viewMode ? <MlMapViewContainer {...config.mapConfig} /> : <div><MlListViewContainer {...listConfig}/></div> }
          {showInfinity && (<MlInfinity {...infinityViewProps} />)}
        </div>
      </div>

    )
  }
}
