/**
 * Created by vishwadeep on 28/7/17.
 */
/**
 * import of libs and routes
 * */
import React, {Component} from "react";
import MlUsersIdeatorIdeas from "../components/MlUsersIdeatorIdeas";
import MlLoader from "../../../commons/components/loader/loader";
import {fetchPortfolioActionHandler} from "../../transaction/portfolio/actions/findClusterIdForPortfolio";
import MlPortfolio from "../../transaction/portfolio/component/commons/MlPortfolio";
import {isEmpty} from "lodash";

/**
 * Export of default Component "MlUsersPortfolioLanding"
 * */
export default class MlUsersPortfolioLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {}
    }
    this.fetchPortfolioDetails.bind(this);
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp;
  }

  /**
   * @params "portfolioId from props"
   * getting user portfolio details
   * */
  async fetchPortfolioDetails() {
    let portfolioId = this.props.config ? this.props.config.portfolioId : ''
    const response = await fetchPortfolioActionHandler(portfolioId);
    if (response && response.communityCode) {
      if (response.communityCode != 'IDE')
        $('.swiper-menu').addClass('hide');
      this.setState({loading: false, data: response})
    } else {
      toastr.error('Portfolio not available');
      this.setState({loading: false});
    }
  }

  /**
   * condition based UI display for communities ["Ideator && all rest"]
   * */
  render() {
    const showLoader = this.state.loading;
    let userCommunityName = this.state.data ? this.state.data.communityType : ''
    let portfolioId = this.props.config ? this.props.config.portfolioId : ''
    let userCommunityCode = this.state.data ? this.state.data.communityCode : ''
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (<div>
            {(userCommunityCode == "IDE") ?
              <MlUsersIdeatorIdeas portfolioId={portfolioId}/> :
              <div>{userCommunityCode ?
                <MlPortfolio viewMode={true} config={portfolioId} communityType={userCommunityName} isHideAction={true}/> : "Portfolio not available"}</div>
            }
          </div>
        )}
      </div>

    )
  }
}
