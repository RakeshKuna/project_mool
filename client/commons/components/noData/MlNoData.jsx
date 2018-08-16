import React from 'react';

export default class MlNoData extends React.Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
  }

  render(){
    var NoDataContent =React.cloneElement(this.props.content||'',this.props);
    return(
      <div className= {this.props.parentClassName?this.props.parentClassName:''} style={this.props.parentStyle?this.props.parentStyle:{}}>
        {NoDataContent}
      </div>
    )
  }
}
