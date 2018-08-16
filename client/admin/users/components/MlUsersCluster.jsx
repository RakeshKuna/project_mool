/**
 * Created by vishwadeep on 25/7/17.
 */
/**
 * import of libs
 * */
import React, {Component} from "react";
import {findUserPortfolioActionHandler} from "../actions/findUsersHandlers";
import ScrollArea from 'react-scrollbar'
/**
 * default class export
 * */
export default class MlUsersCluster extends Component {
  constructor(props, context) {
    super(props);
    this.viewDetails.bind(this)
    return this;
  }

  /**
   * route to the detail view
   * */
  viewDetails(event, registrationId) {
    if(registrationId){
      const resp = this.changeUrl(registrationId)
      return resp
    }else {
      toastr.error('Invalid User')
    }
  }

  /**
   * attaching portfolioId to the route
   * */
  async changeUrl(registrationId) {
    const response = await findUserPortfolioActionHandler(registrationId);
    if (response && response.portfolioId && response.canAccess) {
      FlowRouter.go('/admin/users/' + registrationId + '/' + response.portfolioId + '/aboutuser')
    } else if (response && response.canAccess)
      FlowRouter.go('/admin/users/' + registrationId + '/' + 0 + '/aboutuser')
    else
      toastr.error('Not authorised')
  }

  /**
   * @params data
   * UI to be render with all the data
   * */
  render() {
    let that = this
    const data = this.props.data || [];
    const list = data.map(function (prop, idx) {
      let icon;

      if (prop.registrationType == "IDE") {
        icon = "ml my-ml-Ideator";
      } else if (prop.registrationType == "FUN") {
        icon = "ml my-ml-Investors";
      } else if (prop.registrationType == "SPS") {
        icon = "ml my-ml-Service-Providers";
      } else if (prop.registrationType == "STU") {
        icon = "ml my-ml-Startups";
      } else if (prop.registrationType == "INS") {
        icon = "ml my-ml-Institutions";
      } else if (prop.registrationType == "CMP") {
        icon = "ml my-ml-Company";
      } else {
        icon = "ml ml-moolya-symbol";
      }
      return (
        <div className="col-md-2 col-sx-3 col-sm-4 col-lg-2" key={idx}>
          <a href="" onClick={(event) => that.viewDetails(event, prop.registrationId)}>
            <div className="ideators_list_block">
              <div className="premium"><span>{prop.accountType}</span></div>
              <h3>{prop.firstName}&nbsp; {prop.lastName}</h3>
              <div className="list_icon"><span className={icon}></span></div>
              <div className="block_footer">
                <span>{prop.chapterName}</span>
              </div>
              {/*<h4>{prop.portfolioUserName}</h4>*/}
            </div>
          </a>
        </div>
      )
    });

    return (

      <div className="row ideators_list">
        <h2> Users </h2>
        <div className="list_scroll">
          <ScrollArea
            speed={0.8}
            className="list_scroll"
            smoothScrolling={true}
          >
        {list}
          </ScrollArea>
        </div>
      </div>
    );
  }
}
