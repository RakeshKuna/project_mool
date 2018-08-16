import React from 'react';

export default class NoDataList extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let message='';
    if(this.props.appointment){
      message = <div className="alert alert-info col-md-8 col-md-offset-2 text-center" style={{'marginTop':'40px'}}>
        There are no '{this.props.moduleName}' as of now.<br/>
      </div>;
    }
    else if(this.props.profile){
      message = <div className="alert alert-info col-md-8 col-md-offset-2 text-center" style={{'marginTop':'40px'}}>
        There are no '{this.props.moduleName}' to be displayed here.<br/>
      </div>;
    }else{
      message = <div className="alert alert-info col-md-8 col-md-offset-2 text-center" style={{'marginTop':'40px'}}>
        There are no portfolios in '{this.props.moduleName}' stage as of now.<br/>
        You can move portfolios from the previous steps.
      </div>;
    }
    return(
      message
    )
  }
}
