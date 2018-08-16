import React from 'react';
import MlNoData from '../../commons/components/noData/MlNoData.jsx';
import _ from 'lodash';
export default class MlNoDataContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render() {
    var data = this.props.data;
    var dataType = this.props.dataType || null;
    var skipCheck = this.props.skipCheck || false;
    var isEmpty = skipCheck ? true : false;
    if (!skipCheck) {
      switch (dataType) {
        case 'String':
          if (_.isEmpty(data || ''))isEmpty = true;
          break;
        case 'Object':
          if (_.isPlainObject(data || {}))isEmpty = true;
          break;
        case 'Array':
          if (_.isEmpty(data || []))isEmpty = true;
          break;
      }
    }

    if ( !isEmpty) return null;

    return (
    /** returning the Generic NoData Component*/
      <MlNoData {...this.props}/>
    )
  }
}
