import React from 'react';
import { render } from 'react-dom'
import _ from 'lodash';
import {fetchInteractionsCountActionHandler} from '../actions/fetchInteractionCountActionHandler';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';


export default class InteractionsCounter extends React.Component{
  constructor(props){
    super(props)
    this.state =  {data: []};
  }

  async componentWillMount() {
    //todo: this may be configured dynamically
    var actionNames=['like','connect','collaborate','favourite','view','partner','enquire','follow'];
    const response = await fetchInteractionsCountActionHandler({resourceType:this.props.resourceType,resourceId:this.props.resourceId,actionNames:actionNames});
    this.setState({data: response});
  }

  compareQueryOptions(a, b) {return JSON.stringify(a) === JSON.stringify(b);};

  async componentWillUpdate(nextProps, nextState) {
    var actionNames=['like','connect','collaborate','favourite','view','partner','enquire','follow'];
    if(!this.compareQueryOptions(this.props.interactionAutoId,nextProps.interactionAutoId)){
      const response = await fetchInteractionsCountActionHandler({resourceType:this.props.resourceType,resourceId:this.props.resourceId,actionNames:actionNames});
      this.setState({data: response});
    }
  }

  componentDidMount()
  {
    $('.paperfold').paperfold({'toggle': $('.paperfold-toggle'), 'folds': 1});
    $('.paperfold-toggle').click();
  }

  onBackHandler(e){
    console.log("on BackClick")
    this.props.backHandler();
    FlowRouter.setQueryParams({'tab':null,'subtab':null});

  }
  backFunction(){
    window.history.back();
    console.log('back clicked')
  }
  render(){
    var props = this.props.portfolioDetails
    let config = [
      {name: 'like',displayName:'Like',iconClass: 'ml my-ml-like'},
      {name: 'connect', displayName:'Connections',iconClass: 'ml flaticon-ml-handshake'},
      {name: 'collaborate',displayName:'Collaborations',iconClass: 'ml flaticon-ml-networking'},
      {name: 'favourite',displayName:'Favourites',iconClass: 'ml my-ml-favourites'},
      {name: 'partner', displayName:'Partners',iconClass: 'ml flaticon-ml-handshake-1'},
      {name: 'enquire',displayName:'Enquiries',iconClass: 'ml flaticon-ml-support'},
      {name: 'follow',displayName:'Followers',iconClass: 'ml flaticon-ml-shapes'},
      {name: 'view',displayName:'Profile Views',iconClass: 'ml my-ml-browser_3'}
    ];

    let data=this.state.data;
      //todo: configure the  this.props.actions
    let actionView = config.map(function(option) {
     /*let action = _.find(config, {'name': option.name});
      for (let i = 0; i < config.length; i++) {
        if (config[i].name == option.name && option.status !== true) {
           return;
        }
      }*/
      let actionCount=(_.find(data,{actionName:option.name})||{}).count;
        return (
           <li key={option.name}>
             <a href=""><span className={option.iconClass}></span>
             <b>{actionCount}</b>
             </a>
             <span className="tooltipnew">
             <span>{option.displayName}</span>
             </span>
           </li>
        )

    });

    return(
      <div>
        <div className="paperfold panel">
          {/*<a href="" className="back_btn" onClick={this.backFunction}>
            <span className="fa fa-angle-left fa-2x"/>
          </a>*/}
          <a className="startup-logo" href="" onClick={this.onBackHandler.bind(this)}>
            <img src={props && props.portfolioImage ? generateAbsolutePath(props.portfolioImage) : "/images/ideator_01.png"}
                 data-toggle="tooltip" title={props && props.communityType ? props.communityType : ''}
                 data-placement="right"/>
            &nbsp; {props && props.portfolioUserName ? props.portfolioUserName : ''}
          </a>
          <ul className="header-action-buttons">
            {actionView}
          </ul>
        </div>
         <button className="btn btn-default paperfold-toggle" style={{'visibility':'hidden','position':'absolute'}}>Toggle</button>
      </div>

    )
  }
};
