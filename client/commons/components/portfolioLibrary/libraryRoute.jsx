import PortfolioLibrary from './PortfolioLibrary'
import React from 'react';

export default class  Library extends React.Component {
  constructor(props){
    super(props)
  }
render(){
  const isAdmin = this.props.isAdmin ? this.props.isAdmin : false;
  const portfolioDetailsId = this.props.portfolioDetailsId ? this.props.portfolioDetailsId : null;
  return(
    <div className="app_main_wrap">
      <div className="app_padding_wrap">
           <PortfolioLibrary client={this.props.client} isAdmin={isAdmin} portfolioDetailsId={portfolioDetailsId}/>
      </div>
    </div>
  )
  }
}

