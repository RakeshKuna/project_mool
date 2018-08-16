/**
 * Created by vishwadeep on 26/7/17.
 */
import React, {Component} from "react";
import {fetchFavouritesHandler}  from '../../actions/findUsersFavouritesHandlers'

export default class MlUsersFavourites extends Component {
  constructor(props, context) {
    super(props);
    this.state = {data: []}
    return this;
  }

  componentWillMount() {
    const resp = this.getAllConnections()
    return resp
  }

  async getAllConnections() {
    let communityCode = this.props.communityCode
    let registrationId = this.props.data.config.registrationId
    var response = await fetchFavouritesHandler(registrationId, communityCode)
    console.log(response)
    if (response && response.length > 0)
      this.setState({data: response})
    else
      toastr.error('No Favourites Available')
  }

  render() {
    let config = this.props
    const data = this.state.data && this.state.data.length > 0 ? this.state.data : []
    const list = data.map(function (prop, idx) {
      let icon;

      if (config.communityCode == "IDE") {
        icon = "ml my-ml-Ideator";
      } else if (config.communityCode == "FUN") {
        icon = "ml my-ml-Investors";
      } else if (config.communityCode == "SPS") {
        icon = "ml my-ml-Service-Providers";
      } else if (config.communityCode == "STU") {
        icon = "ml my-ml-Startups";
      } else if (config.communityCode == "INS") {
        icon = "ml my-ml-Institutions";
      } else if (config.communityCode == "CMP") {
        icon = "ml my-ml-Company";
      }
      return (
        <div className="col-lg-3 col-md-3 col-sm-3" key={idx}>
          <div className="subscriptions_block">
            <h3>{prop.firstName}&nbsp; {prop.lastName}</h3>
            <div className="sub_icon"><span className={icon}></span><br />{prop.chapterName}</div>
            <h4>{prop.displayName}</h4>
          </div>
        </div>
      )
    });

    return (
      <div className="row subscriptions">
        {list}
      </div>
    );
  }
}
