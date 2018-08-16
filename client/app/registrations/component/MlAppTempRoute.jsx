/**
 * Created by viswadeep on 6/7/17.
 */
import React, {Component} from "react";
import {render} from "react-dom";
import {fetchPendingRegistration} from "../actions/findRegistration";

export default class MlAppTempRoute extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:true,
      register:[]
    }
    this.fetchPendingReg.bind(this)
  }

  componentWillMount(){
    const resp = this.fetchPendingReg()
    return resp
  }

  async fetchPendingReg() {
    const response = await fetchPendingRegistration();
    if(response){
      this.setState({loading:false, register:response})
    }
  }
  fillRegistration(regId, e){
      FlowRouter.go('/app/register/'+regId)
  }
  render() {
    let that = this
    let icon;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12 ideators_list">
            <div className="row">
              {this.state.register.map(function (reg, idx) {
                if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Ideators")
                  icon = "ml my-ml-Ideator"
                else if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Investors")
                  icon = "ml my-ml-Investors"
                else if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Startups")
                  icon = "ml my-ml-Startups"
                else if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Companies")
                  icon = "ml my-ml-Company"
                else if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Service Providers")
                  icon = "Service-Providers"
                else if(reg&&reg.registrationInfo&&reg.registrationInfo.communityName == "Institutions")
                  icon = "ml my-ml-Institutions"
                console.log(icon)
                return (
                  <div className="col-md-2 col-sx-3 col-sm-4 col-lg-2" key={idx}>
                    {/*<a href={ideatorListRoutes.ideatorDetailsRoute("ideator",ideator.ideas[0].portfolioId)}>*/}
                    <a href='' onClick={that.fillRegistration.bind(that, reg.registrationId)}>
                      <div className="ideators_list_block">
                        <div className="premium">
                          <span>{reg&&reg.registrationInfo&&reg.registrationInfo.communityName?reg.registrationInfo.communityName:''}</span>
                        </div>
                        <h3>{reg&&reg.registrationInfo&&reg.registrationInfo.clusterName? reg.registrationInfo.clusterName : ''}</h3>
                        <div className="list_icon"><span className={icon}></span></div>
                        <div className="block_footer">
                          <span>{reg&&reg.registrationInfo&&reg.registrationInfo.email?reg.registrationInfo.email:''}</span>
                        </div>
                      </div>

                    </a>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </div>
    )
  }
};
