import React from 'react';

import MlListViewComposer from './MlAppListViewComposer';

export default class MlListViewContainer extends React.Component {

  render() {
    let config=this.props;
    return (
      <MlListViewComposer {...config}/>
    );
  }
};
