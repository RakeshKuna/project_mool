/**
 * Created by pankaj on 17/6/17.
 */

import React, {Component} from "react";
import MlAppActionComponent from "../../commons/components/MlAppActionComponent";
import MlAccordion from '../../commons/components/MlAccordion';
import MlAppInvestAction from './MlAppInvestActions';
import NoDataList from '../../../commons/components/noData/noDataList';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import MlLoader from "../../../commons/components/loader/loader";
export default class MlAppInvestmentItem extends Component {

  constructor(props){
    super(props);
    this.state= {
      selected : {}
    }
  }

  selectPortfolio(data){
    if(data && data.stage.length > 0 && data.stage[0].resourceStage === 'onboard'){
      let community = data.portfolio.communityCode === 'IDE'? 'ideator':data.portfolio.communityCode === 'STU'?'startup':data.portfolio.communityCode === 'FUN'? 'investor':"";
      let portfolioId = data.portfolio._id;
      FlowRouter.go(`/app/${community}/${portfolioId}`)
    }
    let selected = this.state.selected;
    if(data._id == selected._id){
      data = {};
    }
    this.setState({
      selected : data
    });
  }

  actionHandlerProxy(actionConfig,handlerCallback){
  if(handlerCallback) {
    handlerCallback(this);
  }else if(actionConfig&&actionConfig.customHandler){
    actionConfig.customHandler(this);
  }
};

  render(){
    const props = this.props;
    const that = this;
    const currentStage = props.currentStage;
    const account = props.account;
    const currentStageIndex = props.stages.findIndex(function (data) {
      return data.stageName == currentStage.stageName
    });
    let mlAppActionConfig = currentStage.stageActions.filter(function (action) {
      return action.actionName && action.isActive;
    }).map(function (action) {
        let actionObj = MlAppInvestAction[action.actionName];
        if(actionObj){
          let config = actionObj.config;
          config.handler = actionObj.handler;
          config.handler =that.actionHandlerProxy.bind(that);
          return config;
        } else {
          return {
            showAction: true,
            actionName: action.actionName,
          }
        }
    });

    export const genericPortfolioAccordionConfig= {id:'myInvestmentAccordion',
      panelItems:[{'title':'Actions',isText:false,style:{'background': '#ef4647'},contentComponent:<MlAppActionComponent  actionOptions={mlAppActionConfig}  />}]
    };
    let stageDataLegth =  props.portfolio.reduce( (count, port) => {
      let stageIndex;
      if(port.stage.length) {
        stageIndex = props.stages.findIndex(function (stage) {
          return stage.stage == port.stage[0].resourceStage
        });
      }
      if( (currentStageIndex == 0 && !stageIndex ) || stageIndex == currentStageIndex ) {
        if( port.portfolio && (port.portfolio.communityCode == "IDE" || port.portfolio.communityCode == "STU" )){
          count += 1;
        }
      }
      return count;
    }, 0 );
    console.log("stageDataLegth",stageDataLegth)
    return (
      <div>
          <div className="col-md-12 ideators_list">
            <div className="row">
              {stageDataLegth==0?<NoDataList moduleName={currentStage.stageName}/>:(
                <div>
                  {props.portfolio.map(function (data, idx) {
                    let stageIndex;
                    if(data.stage.length) {
                      stageIndex = props.stages.findIndex(function (stage) {
                        return stage.stage == data.stage[0].resourceStage
                      });
                    }
                    // > incase need to display at lower index tabs
                    // remove stageIndex < 0 incase all visible in index 0
                    if( (currentStageIndex == 0 && !stageIndex ) || stageIndex == currentStageIndex ) {
                      switch(data.portfolio.communityCode){
                        case "IDE":
                          return (<div className="col-md-3 col-sm-4 col-lg-2" key={idx} onClick={()=>that.selectPortfolio(data)}>
                            <div className={"ideators_list_block " + ( that.state.selected._id == data._id ? "selected_block"  : '') }>
                              <div className="premium">
                          <span>
                            {  data.account ? data.account : '' }
                            {/*{ideator.accountType}*/}
                          </span>
                          </div>
                          <h3>
                            {data.user.name}
                          </h3>
                          <div className="list_icon">{data.profileImage ? <img src={generateAbsolutePath(data.profileImage)} className="c_image"/>:<span className="ml ml-ideator"></span>}</div>
                          <p>
                            {data.idea[0] && data.idea[0].title && data.idea[0].title.substr(0,20)}{ data.idea && data.idea[0] && data.idea[0].title && data.idea[0].title.length ? '...' : ''}
                          </p>
                          <div className="block_footer">
                          <span>
                            {data.portfolio.chapterName}
                          </span>
                              </div>
                            </div>
                          </div>)
                          break;
                        case "STU":
                          return (<div className="col-md-3 col-sm-4 col-lg-2" key={idx} onClick={()=>that.selectPortfolio(data)}>
                            <div className={"ideators_list_block " + ( that.state.selected._id == data._id ? "selected_block"  : '') }>
                              <div className="premium">
                          <span>
                            {  data.account ? data.account : '' }
                            {/*{ideator.accountType}*/}
                            </span>
                              </div>
                              <h3>
                                {data.user.name}
                              </h3>
                              <div className="list_icon">{data.profileImage ? <img src={generateAbsolutePath(data.profileImage)} className="c_image"/>:<span className="ml ml-ideator"></span>}</div>
                              <p>
                                { data && data.startup && data.startup[0] && data.startup[0].aboutUs && data.startup[0].aboutUs.description ? data.startup[0].aboutUs.description.substr(0,30) : '' }
                                { data && data.startup && data.startup[0] && data.startup[0].aboutUs && data.startup[0].aboutUs.description && data.startup[0].aboutUs.description.length ? (data.startup[0].aboutUs.description.length>30 ? '...':'') : ''}
                              </p>
                              <div className="block_footer">
                          <span>
                            {data.portfolio.chapterName}
                          </span>
                              </div>
                            </div>
                          </div>)
                          break;
                        default:
                          return ''
                          break
                      }
                    }
                  })}
                </div>
              )}

            </div>
          </div>

        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
}
