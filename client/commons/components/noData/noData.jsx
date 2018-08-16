import React from 'react';

export default class NoData extends React.Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
    //console.log('----Nodaa----', this.props.user)
  }

  render(){
    return(
      <div className="alert alert-info text-center">
        User is yet to upload content for this section {this.props.tabName}.<br/> Please check after a few days.<br/>You can also connect with the user to get more details.
      </div>
      /*<div className="alert alert-info col-md-8 col-md-offset-2 text-center" style={{'marginTop':'40px'}}>
    User is yet to upload content for this section {this.props.tabName}.<br/> Please check after a few days.<br/>You can also connect with the user to get more details.
  </div>*/
    )
  }
}
