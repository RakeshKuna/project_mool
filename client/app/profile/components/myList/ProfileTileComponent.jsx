import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import NoDataList from '../../../../commons/components/noData/noDataList';
import MlLoader from "../../../../commons/components/loader/loader";
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath'

export default class ProfileTileComponent extends Component {
  getModuleName(modulName) {
    if(modulName){
      let selectedModuleName=modulName.split('my')[1];
      return selectedModuleName
    }else{
      return "";
    }
  }
  render(){
    const users=this.props.data || [];
    let config=this.props.config;
    return (
      <div>
        {config.loading === true ? ( <MlLoader/>) : (
      <div className="row ideators_list">
        {users && !users.length?(
          <NoDataList moduleName={this.getModuleName(config.moduleName)} />
        ):(
          <div>
          {users.map( (data) => {
            let profileTypeMask='provider_mask';
            let profileTypeBlock='provider_block';
            let profileTypeImg='';
            let showImage=false;
            let communityType=data.communityCode;
            switch(communityType){
              case 'IDE':profileTypeBlock='ideator_block';profileTypeMask='ideator_mask'; break;
              case 'FUN':profileTypeBlock='provider_block';profileTypeMask='provider_mask'; break;
              case 'STU':profileTypeBlock='provider_block';profileTypeMask='provider_mask'; break;
              case 'CMP':profileTypeBlock='provider_block';profileTypeMask='provider_mask'; break;
              case 'SPS':profileTypeBlock='provider_block';profileTypeMask='provider_mask'; break;
              case 'INS':profileTypeBlock='provider_block';profileTypeMask='provider_mask'; break;
            }
            return (
              <div className="col-md-3 col-sm-4 col-lg-2">
                <div className={"ideators_list_block " + profileTypeBlock}>
                  <h3>{data.displayName}</h3>
                  <img src={generateAbsolutePath(data.profileImage)?generateAbsolutePath(data.profileImage):'/images/img2.png'} className="c_image" />
                  <div className="block_footer">
                    <span>{data.countryName}</span>
                  </div>
                </div>
              </div>



            );
          })}
          </div>
          )}
      </div>)}
        </div>
    );
  }
}
