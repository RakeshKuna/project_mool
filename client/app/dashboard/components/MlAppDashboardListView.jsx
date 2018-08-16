
/**
 * @todo replacement of the icon component with the generic component
 */
import React, { Component, PropTypes } from 'react';
// import dashboardRoutes from '../actions/routesActionHandler';
var FontAwesome = require('react-fontawesome');
import _ from 'lodash';
import dashboardRoutes from '../actions/routesActionHandler';
import {getAdminUserContext} from '../../../commons/getAdminUserContext'
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import { fetchSubChapterDetails } from '../../registrations/actions/findRegistration.js';
import MapCommunityFilter from '../../../commons/components/map/MapCommunityFilter';

export default class MlAppDashboardListView extends Component {
  constructor(props){
    super(props);
    this.state = {
      userType: "All",
      configState: {},
      subChapterName: null,
      communityName: null
    };
    return this;
  }

  // componentDidMount() {
  //   let loggedInUser = getAdminUserContext();
  //   if(loggedInUser.hierarchyLevel != 0) {
  //     $(".community_icons a").click(function () {
  //       $('.community_icons a').removeClass('active_community');
  //       $(this).addClass('active_community');
  //       var value = $(this).attr('data-filter');
  //       if (value == "all") {
  //         $('.filter-block').show('1000');
  //       }
  //       else {
  //         $(".filter-block").not('.' + value).hide('3000');
  //         $('.filter-block').filter('.' + value).show('3000');
  //       }
  //     });
  //   }
  //   if(loggedInUser.hierarchyLevel == 0){
  //     $('.community_icons a').removeClass('active_community');
  //     $('.'+communityCode).addClass('active_community');
  //   }
  //   if(this.props.config.params.userType != "All"){
  //     $('.community_icons a').removeClass('active_community');
  //     $('.'+this.props.config.params.userType).addClass('active_community');
  //   }
  // }
  // componentDidUpdate(){
  //   let loggedInUser = getAdminUserContext();
  //   if(loggedInUser.hierarchyLevel == 0){
  //     $('.community_icons a').removeClass('active_community');
  //     $('.'+communityCode).addClass('active_community');
  //   }
  // }

  componentDidUpdate(){
    if(this.props.config && this.props.config.params && this.props.config.params.userType && this.props.config.params.userType !==this.state.userType){
      this.setCommunityName(this.props.config.params.userType);
      this.setState({userType : this.props.config.params.userType});
    }
  }

  onStatusChange(userType,e) {
    if (userType) {
      this.setState({userType});
      let config = this.props.config;
      // config = _.omit(config, 'data')
      let options = {
          module: config.moduleName,
          queryProperty: {
            limit: config.perPageLimit,
            skip: 0,
            // loadMore:false
          },
      };
      if(config.sort) {
        options.queryProperty['sortBy'] = config.sortBy;
      }
      let hasQueryOptions = this.props.config&&this.props.config.queryOptions ? true : false;
      if (hasQueryOptions) {
        if (config && config.params) {
          let usertype = {userType: userType}
          _.extend(config.params, usertype)
        } else {
          let newParams = {params: {userType: userType}}
          data = _.omit(config, 'params')
          config = _.extend(data, newParams);
        }
      }

      let dynamicQueryOption = this.props.config&&this.props.config.buildQueryOptions ? this.props.config.buildQueryOptions(config) : {};
      options = _.extend(options,dynamicQueryOption);

      this.props.config.fetchMore(options, true);
      this.setCommunityName(userType);
    }
  }

  /**
   * @func componentWillMount()
   * @desc react life cycle
  */
  componentWillMount(){
    this.getSubChapterDetails();
  }

  /**
   * @param {*subChapterId}
   * @func getSubChapterDetails();
   * @return {*subChapterName}
   * @type {*async}
   */
  async getSubChapterDetails() {
    const { subChapterId } = this.props.config.params;
    const response = await fetchSubChapterDetails(subChapterId);
    if (response)
      this.setState({ subChapterName: response.subChapterName })
  }

  /**
   * @func getSelectedCommunityName()
   * @param {*} communityName
   * @return {*void}
   * @desc making the state set
   */
  setCommunityName(communityType) {
    const communityName = (communityType != 'All') && (communityType != '') ? ' : ' + communityType : null;
    this.setState({ communityName })
  }

  /**
   * @func getNullDataResult()
   * @desc called if null response from data
   * @return {*HTML}
   */
  getNullDataResult() {
    const { userType } = this.props.config && this.props.config.params ? this.props.config.params : { userType: '' };
    return (
      <p className="col-md-8 alert alert-info col-md-offset-2 map_alert text-center">
        There are no {userType} portfolios to be shown
      </p>
    )
  }
  /**
   * @func getPageCounter()
   * @desc called on page header
   * @return {*string}
   */
  getPageCounter(){
    const { count, data } = this.props.config && this.props.config.data ? this.props.config.data : { count: 0, data: [] };
    return <span className='count_text'>Showing {data.length}  of {count} results</span>;
  }

  /**
   * @desc called at render
   * @param {*string} communityCode
   * @param {*boolean} isInternaluser
   * @type switch case
   * @return {*string}
   */
  getCommunityIcon(communityCode, isInternaluser) {
    switch (communityCode) {
      case 'IDE':
        return 'ideator';
      case 'FUN':
        return 'funder';
      case 'STU':
        return 'startup';
      case 'CMP':
        return 'company';
      case 'SPS':
        return 'users';
      case 'INS':
        return 'institutions';
      default:
        return 'moolya-symbol'
    }
  }

  render(){
    const _this = this;
    const { subChapterName, communityName } = this.state;
    let data=this.props.data;
    let userType = this.state.userType;


    let clusterId = this.props.config.params&&this.props.config.params.clusterId?this.props.config.params.clusterId:"";
    let chapterId = this.props.config.params&&this.props.config.params.chapterId?this.props.config.params.chapterId:"";
    let subChapterId = this.props.config.params&&this.props.config.params.subChapterId?this.props.config.params.subChapterId:"";

  //   const list=  data.map((prop, idx) =>
  //     <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
  //       <div className="list_block provider_block">
  //         <div className={`cluster_status ${prop.isActive?"active":"inactive"}_cl `}>{/*<FontAwesome name={prop.profile.isActive?"check":"times"}/>*/}</div>
  //         {/*<div className={`cluster_status ${prop.statusField|| ""}_cl `}></div>*/}
  //         {/*{prop.communityCode?<a></a>:<a href={dashboardRoutes.backendUserDetailRoute(clusterId,chapterId,subChapterId,prop._id)}> <div className={"hex_outer"}><img src={prop.countryFlag}/></div></a>}*/}
  //         <h3>{prop.name}<br />
  //           {prop.communityCode?prop.clusterName:prop.roleNames}
  //         </h3>
  //       </div>
  //     </div>
  // );

    const list=  data.map(function(prop, idx){
      icon = _this.getCommunityIcon(prop.communityCode, prop.profile.isInternaluser);

      return (
        <div className="col-md-3 col-sm-4 col-lg-2" key={idx}>
          <a href={dashboardRoutes.userListRoute(clusterId, chapterId, subChapterId, prop.portfolioId, icon)}>
            <div className="ideators_list_block">
              {/*<div className={`${prop.isActive?"active":"inactive"}`}><span>Active</span></div>*/}
              <div className="premium">
                <span>{prop.accountType}</span>
              </div>
                <h3>{prop.name}</h3>
              {/*<span className={`ml2 ml-${icon}`}></span>*/}
              <img src={`${prop.profile&&prop.profile.profileImage?generateAbsolutePath(prop.profile.profileImage):"/images/ideator_01.png"}`} className="c_image"/>
              <div className="block_footer">
                {/*<span>{prop.communityCode?prop.clusterName:prop.roleNames}</span>*/}
                <span>{prop.chapterName} - {prop.communityDefName}</span>
              </div>
            </div>
          </a>
        </div>
      )}
    )



    return (
      <div>
        <MapCommunityFilter fixed_icon={true} onStatusChange={this.onStatusChange.bind(this)} userType={userType}/>
        <div className="col-md-12">
          <h2>Communities {subChapterName} {communityName} {this.getPageCounter()}</h2>
          <div className="row ideators_list">
            {list && list.length ? list : this.getNullDataResult()}
          </div>
          </div>
      </div>
        );

  }
}

/************<code_backup>*****************/
/**
 * wrt: getCommunityIcon()
 */
// if(prop.communityCode == "IDE")
      //   icon = "ideator"
      // else if(prop.communityCode == "FUN")
      //   icon = "funder"
      // else if(prop.communityCode == "STU")
      //   icon = "startup"
      // else if(prop.communityCode == "CMP")
      //   icon = "company"
      // else if(prop.communityCode == "SPS")
      //   icon = "users"
      // else if(prop.communityCode == "INS")
      //   icon = "institutions"
      // else if(prop.profile.isInternaluser)
      //   icon = "moolya-symbol"
/************<end_code_backup>*****************/
