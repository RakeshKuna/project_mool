import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {fetchPortfolioActionHandler} from '../../ideators/actions/ideatorActionHandler'
import CDNImage from '../../../../commons/components/CDNImage/CDNImage'
import MlLoader from "../../../../commons/components/loader/loader";
import NoDataList from '../../../../commons/components/noData/noDataList';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath'

export default class MlAppServiceProviderListView extends Component {

  async viewDetails(portfolioId, e) {
    const response = await fetchPortfolioActionHandler(portfolioId);
    if (this.props.config.isExplore && response && response.canAccess)
      FlowRouter.go('/app/explore/serviceProvider/' + portfolioId)
    else if (response && response.canAccess)
      FlowRouter.go('/app/serviceProvider/' + portfolioId)
    else if(response && !response.canAccess)
      toastr.error('Portfolio not available for view')
  }

  render(){
    let that = this
    const data=this.props.data||[];
    let loading=this.props.config&&this.props.config.loading;
    const list=  data.map((provider, idx) =>
      <div className="col-md-3 col-sm-4 col-lg-2" key={idx}>
        <a href='' onClick={that.viewDetails.bind(that, provider.portfolioDetailsId)}>
          <div className="ideators_list_block">
            <div className="premium">
              <span>{provider.accountType}</span>
            </div>
           {/* <h3>{provider.about&&provider.about.aboutTitle?provider.about.aboutTitle:""}</h3> */}
               <h3>{provider.firstName}</h3>
            {provider.profileImage ? <CDNImage src={generateAbsolutePath(provider.profileImage)} className="c_image"/> :
              <div className="list_icon">
                <span className="ml my-ml-Service-Providers"></span>
              </div>}

            <div className="block_footer">
              <span>{provider.chapterName}{!provider.isDefaultSubChapter?"-" +provider.subChapterName:""}</span>
            </div>
          </div>
        </a>
      </div>
    );

    return (
      <div>
      {loading === true ? ( <MlLoader/>) : (
      <div>
      {/* <div className="col-md-12"><h2>Service Providers</h2></div> */}
      {data && !data.length?(
        <NoDataList  profile={true} moduleName="user profiles" />
      ):(<div>{list}</div>)
      }
      </div>)}
        </div>
      );

  }

}

